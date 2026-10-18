# EduSmart AI — Repository Audit

**Audit date:** 2026-10-18  
**Repository:** [mdanasaaq-design/EduSmart-AI](https://github.com/mdanasaaq-design/EduSmart-AI)  
**Branch reviewed:** `main`  
**Reviewed head:** `facd99297139a4e891ee461e3a674751d7bf24f0`  
**Firebase project:** `edusmart-ai-c4692`  
**Hosting URL:** https://edusmart-ai-c4692.web.app

## 1. Scope and method

This document records the initial read-only audit and subsequent follow-up corrections. The initial audit itself changed no application code and ran no tests. Follow-up work on 2026-10-18 corrected the Firestore test, added Python/browser ML contract tests, regenerated the model artifacts, improved no-billing account-setup messaging, and expanded CI. No Firebase deployment or Firebase data change was performed.

## 2. Executive assessment

EduSmart AI has a substantial academic-prototype foundation: React/Vite frontend, Firebase Authentication and Firestore integration, role-specific screens, institute structure management, attendance/marks workflows, browser-side Random Forest inference, recommendations, analytics, deployment configuration, and project documentation.

It is **not ready for a verified-complete sign-off**. The highest risks are:
1. The initial GitHub Actions run failed in the Firestore authorization test step because a test expected public self-created student profiles, while the current Firestore rule allows profile creation only by an administrator. The test was corrected to reflect the existing security policy; the rules were not weakened.
3. The user requires Firebase's no-Blaze/free-plan constraint to be preserved. Core onboarding and managed-account flows call Cloud Functions, while deployment of those functions is blocked under the current plan.
4. The numeric risk-label semantics appear consistent with the human-readable class order by source review; deterministic regression tests are needed to lock that behavior.
5. The initial checked-in frontend model had 5 trees while the training script and evaluation document described 40. Follow-up work regenerated and synchronized the artifacts to 40 trees.
6. The last documented Hosting deployment used a local checkout that had not successfully pulled the intended latest `main`; current live/source parity is unknown.
7. Full admin → teacher → student workflows, deployed rules/indexes/functions, and the current live site have not been proven by current acceptance evidence.

## 3. Repository baseline

The current tree contains:
- Root planning documents: `README.md`, `prd.md`, `architecture.md`, `design.md`, `rules.md`, `tasks.md`, `memory.md`.
- Status/deployment/demo documents under `docs/`.
- React/Vite application under `frontend/`.
- Cloud Functions source under `functions/`.
- Firestore rules and index declarations under `firebase/`.
- ML training/evaluation/model files under `ml/`.
- GitHub Actions workflows for frontend CI and manual Hosting deployment.

The current frontend scripts are `dev`, `build`, `lint`, and `preview`. CI runs Firestore emulator tests before lint/build, so a test failure prevents those later checks from running.

## 4. Evidence-based findings

### A-01 — Initial CI failure; follow-up CI now passes

The initial run for the reviewed head was [Frontend CI run 39010124131](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39010124131), which failed at the Firestore authorization test step before lint/build. The test-policy mismatch was corrected. Follow-up full CI passed in [run 39116887998](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39116887998): Firestore authorization, Python ML tests, browser inference tests, ESLint and production build. The latest run after a vote-share rounding correction is pending.

The exact assertion was captured: the self-registration success test failed with `PERMISSION_DENIED`. The test now expects denial, and the admin-create test uses a new UID.

### A-02 — Firestore test/rule mismatch resolved

The test `a user can self-register only a constrained student profile for their own UID` expects a normal authenticated user to create `users/{uid}`. The current `firebase/firestore.rules` says user profiles are provisioned by trusted admin-only logic and sets `allow create: if isAdmin()`.

This was a confirmed test/policy inconsistency and is now resolved in tests. The administrator-managed policy remains in force; the self-registration test expects denial. Full CI now passes the authorization suite.

### A-03 — Firebase free-plan constraint blocks the documented callable workflow

`frontend/src/pages/auth/Signup.jsx` calls `registerInstitutionAdmin`. Managed user creation and admin-profile recovery also depend on callable Functions. The user's Firebase project is not on Blaze, and Functions deployment has previously been blocked for that reason.

Do not recommend enabling billing as the default solution. For the near-term demo, use the already-provisioned administrator and, where necessary, manually provision demonstration Auth accounts and matching Firestore profiles through Firebase Console. Do not expose self-assigned roles or weaken Firestore rules. Treat the callable workflows as blocked until a no-billing architecture is explicitly selected or the user changes the constraint.

### A-04 — Risk-class mapping appears internally consistent; add regression tests

Source review of `ml/train_model.py` indicates the numeric encoding is consistent with the intended risk semantics: scores below 3.0 (poorer indicators) map to numeric class `2` / `High` risk; scores from 3.0 to below 4.3 map to class `1` / `Medium`; scores at or above 4.3 (stronger indicators) map to class `0` / `Low` risk. The exported metadata order is `["Low", "Medium", "High"]`, and tree leaf argmax indices are interpreted against that order. The default numeric class order used by `classification_report` is 0, 1, 2, so the documented class-name order is consistent by source inspection.

The earlier audit incorrectly described this as a reversed mapping. Deterministic Python and browser tests now cover risk semantics and fixed inference vectors. Both model files contain 40 trees and CI verifies deterministic equality. The browser vote-share calculation was also adjusted to avoid floating-point under-rounding at exact half values; the latest CI run is pending.

### A-05 — Shipped model artifact does not match the documented training configuration

The initial artifacts contained 5 trees despite the 40-tree training configuration. Follow-up work regenerated both artifacts from `ml/train_model.py`; each now contains 40 trees and CI reruns training and checks that regeneration produces no diff. Evaluation now reports both scikit-learn probability-averaging accuracy (86.25%) and the browser's majority-vote accuracy (87.08%) on the same synthetic holdout. Neither metric establishes real-world performance.

### A-06 — Live release parity is unverified

Project notes record that a local `git pull --ff-only origin main` was blocked by a local change in `frontend/src/services/authService.js`; a Hosting release then succeeded from the existing local checkout. GitHub `main` subsequently contains changes to admin-profile recovery, teacher-scoped record access, Functions runtime and Firestore indexes.

The current deployed source revision cannot be inferred from a successful Hosting deployment message. Preserve local changes, synchronize safely, and verify the live site and each Firebase deployment target independently before declaring parity.

### A-07 — Cloud deployment is split across services

`firebase.json` configures Hosting, Firestore rules, indexes and Functions, but a single successful Hosting deployment does not publish the other targets. The current Functions runtime is Node.js 22 in source configuration. The live state of Functions, rules and indexes has not been verified in this audit.

### A-08 — Large frontend bundle is a known optimization item

A prior local build on 2026-10-16/17 produced a JavaScript bundle of roughly 1.2 MB and triggered Vite's large-chunk warning. This is historical evidence, not a new build measurement for the reviewed head. Treat bundle splitting, lazy-loaded screens and dependency review as a later performance phase, after correctness and security are established.

### A-09 — Authentication and profile identity must be verified end-to-end

The login service authenticates through Firebase Auth and then expects `users/{auth.uid}`. The student dashboard separately expects a student record linked by `userId`; academic records use `studentUserId`, class, subject and enrollment fields. This design requires consistent Auth UID/profile linkage. Missing or mismatched documents can produce a successful Auth login followed by an unusable dashboard. Test these links explicitly; do not delete data as generic troubleshooting.

### A-10 — Model confidence is not calibrated probability

The browser reports the share of trees voting for the selected class. This is a tree-vote fraction, not a calibrated probability that a student is at risk. Keep the limitation visible in the UI, report, PPT and viva.

## 5. Areas implemented in source but not verified end-to-end

- First-admin setup and admin-profile recovery.
- Teacher/student account provisioning.
- Teacher assignment/class access records.
- Student enrollment and profile linkage.
- Attendance and marks persistence.
- Prediction/recommendation persistence.
- Analytics reflecting persisted records.
- Student-only visibility and teacher assignment/enrollment boundaries.
- Current Hosting, Functions, rules and index deployment state.
- Current production build and lint status.

These should be marked **implemented, verification pending**, not complete.

## 6. Scope boundaries and non-goals

Keep the approved stack: React, Vite, Tailwind CSS, Recharts, Lucide React, Firebase Auth, Firestore, Hosting, Functions source, and Python/scikit-learn for the demo model. Do not introduce paid Firebase usage, SQL/PostgreSQL, custom JWT, FastAPI, microservices, commercial SaaS features, or unrelated infrastructure without explicit approval.

## 7. Audit exit criteria

The audit phase is complete when:
- The original CI failure has a captured root cause and the test-policy mismatch is resolved; the latest expanded suite is passing on the prior code revision.
- Product policy for student account creation is explicit.
- Risk class encoding and artifact-size/configuration mismatch are recorded as high-priority fixes.
- Firebase free-plan constraints are reflected in the deployment and demo plan.
- A phased implementation and acceptance test plan exists.
- No source or live system is changed without a separately approved implementation phase.

## 8. Related documents

- [Bug and Improvement Backlog](BUG_BACKLOG.md)
- [Phased Roadmap](PHASED_ROADMAP.md)
- [Acceptance Test Plan](ACCEPTANCE_TEST_PLAN.md)
- [Architecture and Product Decisions](DECISIONS.md)
- [Development Status](DEVELOPMENT_STATUS.md)
- [Exam Demo Checklist](EXAM_DEMO_CHECKLIST.md)
