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

### BUG-001 — Risk-class semantics need deterministic regression tests
- **Status:** Resolved by deterministic Python and browser contract tests; full CI passed in run [39116887998](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39116887998)
- **Area:** `ml/train_model.py`, `ml/model.json`, `frontend/public/model.json`, `frontend/src/pages/AcademicRecords.jsx`
- **Evidence:** Poorer synthetic scores map to numeric class `2` / `High` risk; stronger scores map to class `0` / `Low` risk. The model metadata order is `["Low", "Medium", "High"]`, and leaf argmax indices are used as class indices. This is consistent by source inspection; the earlier audit's claim of reversed labels was incorrect.
- **Impact:** Without deterministic tests, a future edit could accidentally reverse class semantics without detection.
- **Plan:** Add fixed low-/medium-/high-risk test vectors and compare Python predictions with the browser inference contract. Preserve the current mapping unless test evidence demonstrates a defect.
- **Acceptance:** Test vectors prove poor inputs map to High risk, midrange inputs to Medium, strong inputs to Low, and the browser interprets exported class indices consistently.

### BUG-002 — Model artifact was inconsistent with the documented experiment
- **Status:** Resolved; 40-tree artifacts regenerated, synchronized and checked for reproducibility by CI
- **Area:** `ml/train_model.py`, `ml/EVALUATION.md`, `ml/model.json`, `frontend/public/model.json`
- **Evidence:** The original artifacts contained 5 trees while the training script specified 40.
- **Change:** Commit `30f52d7` regenerated both artifacts from the canonical training script. CI now reruns training and fails if the checked-in artifacts differ.
- **Verification:** Both artifacts contain 40 trees, are byte-identical, and the pinned run reproduces 86.25% synthetic holdout accuracy.
- **Limitation:** This metric reflects synthetic labels and is not real-world validation.

### BUG-003 — Current Firestore rule test contradicted the security policy
- **Status:** Resolved; current-head CI passed
- **Area:** `frontend/tests/firestore.rules.test.js`, `firebase/firestore.rules`, `.github/workflows/frontend-ci.yml`
- **Evidence:** CI run `39010124131` and follow-up run `39114483639` failed because `a user can self-register only a constrained student profile for their own UID` expected success but received `PERMISSION_DENIED`. The existing rule permits create only when `isAdmin()`.
- **Impact:** CI failed before lint/build, so there was no green verification signal.
- **Change:** Commit `f65742c8b04385ef609e92fc885e063c8f36b145` changes the test to expect denial and changes the admin-create test to use a new UID.
- **Acceptance:** Current-head CI passes all authorization tests, lint and production build; tests match the intended policy rather than weakening it. Verified by full CI run [39116551389](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39116551389): 18 emulator tests, 4 Python ML tests, 3 browser inference tests, ESLint and production build all passed.

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
- **Status:** Resolved in UI copy; both setup screens now explain the no-billing/manual fallback without recommending a billing upgrade
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
- **Status:** Resolved at source/test level; batching regression tests passed in CI run [39117547050](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39117547050)
- **Area:** `frontend/src/pages/AcademicRecords.jsx`, `frontend/src/utils/chunkArray.js`
- **Evidence:** The teacher workflow previously sliced unique assigned class IDs to the first 30, silently omitting later classes.
- **Change:** Removed truncation and batches `in` queries into groups of at most 30 IDs. Student and enrollment results are combined and deduplicated across batches.
- **Acceptance:** 65 class IDs produce batches of 30, 30 and 5 without loss or duplication. Verified by the chunking test suite in CI run [39117547050](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39117547050).

### BUG-014 — Browser vote-share percentage can round down at exact half values
- **Status:** Resolved; Python and browser regression tests pass in CI run [39117262846](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39117262846)
- **Area:** `frontend/src/ml/modelInference.js`, `ml/model_test_vectors.json`, `ml/test_train_model.py`
- **Evidence:** Calculating `Math.round((23 / 40) * 100)` can produce 57 because the intermediate floating-point value is slightly below 57.5, despite 23 of 40 votes representing 57.5%. The corrected calculation uses `Math.round(23 * 100 / 40)` and returns 58.
- **Change:** Calculate `Math.round(voteCount * 100 / treeCount)` to avoid the under-rounding case and update the shared fixed vector to expect 58%.
- **Acceptance:** Python and browser tests agree on the same rounded vote share for fixed vectors, including the 23/40 case. Verified in CI run [39117262846](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39117262846).

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
