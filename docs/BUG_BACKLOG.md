# EduSmart AI — Bug and Improvement Backlog

**Last reviewed:** 2026-10-18  
**Source baseline:** `main` at `facd992` for the audit findings  
**Rule:** no item is closed until its fix is tested and the relevant acceptance evidence is recorded.

Priority definitions:
- **P0 — Demo/security blocker:** core demo cannot be trusted or a security boundary may be wrong.
- **P1 — High:** core workflow or CI reliability issue.
- **P2 — Medium:** usability, robustness, maintainability, or performance improvement.
- **P3 — Later:** optional enhancement outside the minimum reliable prototype.

Statuses: **Confirmed** = supported directly by current source or run metadata; **Needs verification** = plausible concern requiring execution/live evidence; **Planned** = improvement rather than a proven defect.

## P0 — Must resolve before relying on the demonstration

### BUG-001 — Low/High risk labels may be reversed
- **Status:** Confirmed source-level inconsistency
- **Area:** `ml/train_model.py`, `ml/model.json`, `frontend/public/model.json`, `frontend/src/pages/AcademicRecords.jsx`
- **Evidence:** Synthetic label generation uses numeric 2 for low risk and 0 for high risk, while model metadata maps class index 0 to Low and index 2 to High. Exported leaf indices are interpreted through that metadata.
- **Impact:** A correct numeric model output can be shown with the wrong human-readable risk label. The evaluation script's `classification_report(..., target_names=CLASSES)` and the documented confusion-matrix headings also likely mislabel the low/high classes.
- **Plan:** Define one canonical label-to-index mapping; export leaves using that mapping; add unit tests for known low/medium/high feature cases; validate browser output against Python predictions; regenerate the per-class report and confusion matrix from the corrected numeric label order.
- **Acceptance:** For a fixed set of representative feature vectors, Python and browser outputs agree on the same label. The numeric encoding and displayed label order are documented and tested.

### BUG-002 — Model artifact is inconsistent with the documented experiment
- **Status:** Confirmed
- **Area:** `ml/train_model.py`, `ml/EVALUATION.md`, `ml/model.json`, `frontend/public/model.json`
- **Evidence:** The two checked-in model artifacts contain 5 trees, while the training script and evaluation document specify 40 trees.
- **Impact:** The documented 86.25% holdout metric cannot be assumed to describe the model currently served by the frontend.
- **Plan:** After fixing label mapping, regenerate the artifact from the documented training script; verify model file equality; evaluate the exact exported artifact and update evaluation documentation only from real output.
- **Acceptance:** Artifact tree count, training configuration, evaluation record and frontend model file all agree.

### BUG-003 — Current Firestore rule test contradicts the security policy
- **Status:** Confirmed source-level inconsistency; likely contributor to current CI failure
- **Area:** `frontend/tests/firestore.rules.test.js`, `firebase/firestore.rules`, `.github/workflows/frontend-ci.yml`
- **Evidence:** A test expects a user to create their own student profile, but `users/{userId}` currently permits create only when `isAdmin()`.
- **Impact:** CI fails before lint/build, so the current revision lacks a green verification signal.
- **Plan:** Keep the documented administrator-managed account policy and replace the stale self-registration success test with a denial test, unless a different secure registration design is explicitly approved. Capture the actual failed assertion from CI, then rerun the complete suite.
- **Acceptance:** Current-head CI passes all authorization tests, lint and production build; tests match the intended policy rather than weakening it to make CI green.

## P1 — High-priority integration blockers

### BUG-004 — Callable account workflows are unavailable under the current Firebase plan
- **Status:** Confirmed project constraint / deployment blocker
- **Area:** `functions/index.js`, `Signup.jsx`, managed user provisioning, admin profile recovery, deployment documentation
- **Impact:** First-admin setup, managed-user creation and recovery cannot be assumed to work on the user's current Spark plan.
- **Plan:** Do not enable Blaze by default. For the immediate demo, use the existing manually provisioned administrator and manually create test Auth accounts plus corresponding Firestore profiles through Firebase Console. Keep admin/teacher role assignment out of public UI and retain restrictive rules. Document which callable flows remain unavailable.
- **Acceptance:** The demo has a tested, no-billing account setup path; no public role escalation is introduced; blocked callable flows are accurately labeled.

### BUG-005 — Live site may not match the latest GitHub source
- **Status:** Needs live verification; historical release risk confirmed in project notes
- **Area:** Local Git state, Hosting release
- **Impact:** The browser may still show an older landing page or older authentication code.
- **Plan:** Inspect local status and diff first; preserve all local modifications; synchronize to intended `main`; confirm exact commit before any build/deploy; then verify live UI.
- **Acceptance:** Recorded source SHA, build result and Hosting verification refer to the same intended revision.

### BUG-006 — Deployed Functions, Firestore rules and indexes are not verified
- **Status:** Needs live verification
- **Area:** Firebase deployment
- **Impact:** Frontend may query unavailable indexes, call undeployed functions, or behave differently from the checked-in rules.
- **Plan:** Verify each target independently in Firebase Console/CLI logs. Under the no-Blaze constraint, document Functions as blocked rather than attempting a deployment that requires billing.
- **Acceptance:** Hosting, rules, indexes and any available Functions have an explicit verified/blocked status with evidence.

### BUG-007 — Authentication account and Firestore profile can become inconsistent
- **Status:** Known integration risk; exact live state needs verification
- **Area:** `authService.js`, `users/{uid}`, student/teacher profile linkage
- **Impact:** Firebase Auth may succeed while the app cannot find the profile or linked academic record.
- **Plan:** Create a role/account mapping checklist; verify UID equality across Auth, user profile, student/teacher profile and records. Use a documented recovery path; do not clear collections or change roles casually.
- **Acceptance:** Admin, teacher and student can each sign in and land in the correct workspace with valid linked profile data.

### BUG-008 — Teacher access and academic record persistence have not been fully accepted
- **Status:** Needs live/browser verification
- **Area:** Assignments, `teacherClassAccess`, enrollments, attendance, marks, predictions, recommendations
- **Impact:** Rules may correctly deny data that the UI queries incorrectly, or a workflow may display data but fail on write.
- **Plan:** Test one assigned teacher/class/subject with an active enrollment; test out-of-scope and withdrawn enrollment cases; verify create/update/read behavior.
- **Acceptance:** Assigned teacher reads/writes permitted records only; unrelated classes and students are denied; records persist after reload.

## P2 — Robustness and user experience

### BUG-009 — Institution setup error text assumes a Blaze deployment
- **Status:** Confirmed copy mismatch with user's constraint
- **Area:** `frontend/src/pages/auth/Signup.jsx`
- **Impact:** The error message suggests a paid-plan action the user has explicitly declined.
- **Plan:** In a future UI change, replace the message with a truthful, actionable explanation that secure first-time setup requires a deployed callable function and that the current demo uses a pre-provisioned admin on the current plan.
- **Acceptance:** Error guidance matches the supported deployment path and does not pressure the user to enable billing.

### BUG-010 — Large JavaScript bundle
- **Status:** Historical warning; current head requires fresh measurement
- **Area:** Frontend bundling and route loading
- **Evidence:** A previous local build produced a roughly 1.2 MB JavaScript bundle and Vite emitted a large-chunk warning.
- **Impact:** Slower initial load and a less polished experience on weaker networks/devices.
- **Plan:** After correctness, consider lazy-loading major pages, reviewing dependency imports, and splitting noncritical charts/screens.
- **Acceptance:** A fresh build report is captured; any optimization is measured against that baseline without breaking routes.

### BUG-011 — Empty/error/loading states need a systematic pass
- **Status:** Planned audit
- **Area:** Forms, tables, analytics, student/teacher dashboards
- **Plan:** Verify each data-backed page for loading, empty, success, permission-denied and network-error states. Ensure no empty result is misrepresented as meaningful zero performance.
- **Acceptance:** Each state is understandable, actionable and accessible.

### BUG-012 — Mobile, keyboard and contrast behavior needs explicit acceptance
- **Status:** Planned audit
- **Area:** Landing, auth, dashboards, tables and charts
- **Plan:** Check laptop and narrow viewport layouts, focus visibility, keyboard operation, semantic labels, contrast, and text alternatives for charts/statuses.
- **Acceptance:** Core workflows can be completed without mouse-only interaction and without status communicated only by color.

### BUG-013 — Teacher academic-record queries silently cap class scope at 30 IDs
- **Status:** Confirmed source-level behavior; user impact needs verification
- **Area:** `frontend/src/pages/AcademicRecords.jsx`
- **Evidence:** The teacher workflow derives assigned class IDs and slices the list to the first 30.
- **Impact:** Teachers with more than 30 assigned classes may silently miss records for later classes.
- **Plan:** Decide whether to page/batch queries or show a clear limit message; preserve Firestore query limits and security constraints.
- **Acceptance:** No assigned classes are silently omitted; larger assignment sets are either handled correctly or explicitly reported.

## P3 — Future improvements, not prerequisites for the immediate demo

- **IDEA-001:** Add route-level code splitting after baseline correctness.
- **IDEA-002:** Add stronger form validation and reusable error components.
- **IDEA-003:** Add a repeatable synthetic demo-data setup guide that avoids production data.
- **IDEA-004:** Add a model artifact verification script/test and explicit artifact version metadata.
- **IDEA-005:** Evaluate the model only with approved, privacy-protected data and labels independent of the feature-generation formula.
- **IDEA-006:** Add an explicit audit log for privileged changes if scope and available backend permit it.
- **IDEA-007:** Add export/print-friendly reports only after core academic flows are stable.

## Out of scope unless explicitly approved

- Moving to Firebase Blaze or adding billable infrastructure.
- Public client-side assignment of admin/teacher roles.
- Removing or weakening Firestore rules to make the demo pass.
- Clearing Firestore/Auth data as a generic fix.
- Introducing PostgreSQL, SQLAlchemy, custom JWT, FastAPI, microservices, parent portals, payments, payroll, chat, messaging or commercial SaaS features.

## Definition of done for each backlog item

1. Fix is approved and implemented in a dedicated change.
2. Relevant automated tests pass.
3. Relevant browser acceptance passes.
4. Security impact is reviewed where authorization/data access is involved.
5. Documentation is updated from actual evidence.
6. Status changes from Confirmed/Needs verification to Resolved only with linked evidence.
