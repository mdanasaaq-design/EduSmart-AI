# EduSmart AI — Repository Audit

**Audit date:** 2026-10-18  
**Repository:** [mdanasaaq-design/EduSmart-AI](https://github.com/mdanasaaq-design/EduSmart-AI)  
**Branch reviewed:** `main`  
**Reviewed head:** `facd99297139a4e891ee461e3a674751d7bf24f0`  
**Firebase project:** `edusmart-ai-c4692`  
**Hosting URL:** https://edusmart-ai-c4692.web.app

## 1. Scope and method

This is a read-only source and documentation audit. It reviewed the GitHub tree, project documentation, frontend and Functions package manifests, Firebase configuration and Firestore rules, authentication UI/service code, academic records and analytics code, ML training script and checked-in model artifacts, Firestore rule tests, and recent GitHub Actions run metadata.

**No application code was changed, no build or test was run, no deployment was performed, and no Firebase data or security rules were changed during this audit.** Findings below distinguish source-level facts from items that require execution or live-project verification.

## 2. Executive assessment

EduSmart AI has a substantial academic-prototype foundation: React/Vite frontend, Firebase Authentication and Firestore integration, role-specific screens, institute structure management, attendance/marks workflows, browser-side Random Forest inference, recommendations, analytics, deployment configuration, and project documentation.

It is **not ready for a verified-complete sign-off**. The highest risks are:
1. Current GitHub Actions CI fails in the Firestore authorization test step; lint and build are skipped in that run.
2. A rule test expects public self-created student profiles, but the current Firestore rule allows profile creation only by an administrator.
3. The user requires Firebase's no-Blaze/free-plan constraint to be preserved. Core onboarding and managed-account flows call Cloud Functions, while deployment of those functions is blocked under the current plan.
4. The numeric risk labels in the training script do not match the human-readable class order in the exported model metadata.
5. The checked-in frontend model has 5 trees, while the training script and evaluation document describe 40 trees.
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

### A-01 — Current CI is red

The latest run for the reviewed head is [Frontend CI run 39010124131](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39010124131). The job summary shows:
- Dependency installation: passed.
- Firestore authorization test step: failed.
- ESLint: skipped.
- Production build: skipped.

The exact failing assertion must be captured from the job output when implementation work begins. The source contains a direct test/rule contradiction described in A-02, which is a strong candidate.

### A-02 — Firestore rule test contradicts the current account policy

The test `a user can self-register only a constrained student profile for their own UID` expects a normal authenticated user to create `users/{uid}`. The current `firebase/firestore.rules` says user profiles are provisioned by trusted admin-only logic and sets `allow create: if isAdmin()`.

This is a **confirmed source-level inconsistency**. The intended policy must be chosen explicitly before changing code. The existing product documents say teachers/students are provisioned by an administrator, and the user does not want role security weakened. The recommended direction is to keep administrator-only profile creation and update the stale test to assert denial for self-created profiles, unless the product owner explicitly approves a different secure enrollment design.

### A-03 — Firebase free-plan constraint blocks the documented callable workflow

`frontend/src/pages/auth/Signup.jsx` calls `registerInstitutionAdmin`. Managed user creation and admin-profile recovery also depend on callable Functions. The user's Firebase project is not on Blaze, and Functions deployment has previously been blocked for that reason.

Do not recommend enabling billing as the default solution. For the near-term demo, use the already-provisioned administrator and, where necessary, manually provision demonstration Auth accounts and matching Firestore profiles through Firebase Console. Do not expose self-assigned roles or weaken Firestore rules. Treat the callable workflows as blocked until a no-billing architecture is explicitly selected or the user changes the constraint.

### A-04 — Risk-class mapping appears internally consistent; add regression tests

Source review of `ml/train_model.py` indicates the numeric encoding is consistent with the intended risk semantics: scores below 3.0 (poorer indicators) map to numeric class `2` / `High` risk; scores from 3.0 to below 4.3 map to class `1` / `Medium`; scores at or above 4.3 (stronger indicators) map to class `0` / `Low` risk. The exported metadata order is `["Low", "Medium", "High"]`, and tree leaf argmax indices are interpreted against that order. The default numeric class order used by `classification_report` is 0, 1, 2, so the documented class-name order is consistent by source inspection.

The earlier audit incorrectly described this as a reversed mapping. Do not change the mapping without test evidence. Add deterministic tests that assert poor inputs map to High risk, middle-range inputs to Medium, strong inputs to Low, and Python/browser predictions agree. The separate artifact mismatch below remains a confirmed issue: current frontend artifact contains 5 trees while the training script specifies 40.

### A-05 — Shipped model artifact does not match the documented training configuration

Both `ml/model.json` and `frontend/public/model.json` currently contain 5 trees and are byte-identical. The training script specifies `n_estimators=40`, and `ml/EVALUATION.md` documents a 40-tree model.

Therefore the checked-in browser artifact does not match the documented 40-tree experiment. The 86.25% metric describes the documented synthetic holdout run, not necessarily the checked-in 5-tree artifact. Regenerate/export the model from the documented training configuration, verify the two artifacts are identical, and evaluate the exact artifact intended for the frontend.

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
- The current CI failure has a captured root cause.
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
