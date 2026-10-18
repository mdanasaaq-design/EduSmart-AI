# EduSmart AI — Canonical Project Context

> Durable context for implementation, testing, documentation and future development. Keep this file synchronized with verified source and deployment state.

## Project identity

- **Name:** EduSmart AI
- **Full title:** AI-Powered Educational Institute Management System with Student Academic Risk Prediction
- **Type:** B.E. CSE (AI & ML) college mini-project / working prototype
- **Repository:** `mdanasaaq-design/EduSmart-AI`
- **Default branch:** `main`
- **College context:** Nawab Shah Alam Khan College of Engineering & Technology (NSAKCET)
- **Department:** Computer Science & Engineering (AI & ML)
- **Academic year:** 2026–2027
- **Firebase project:** `edusmart-ai-c4692`
- **Hosting URL:** `https://edusmart-ai-c4692.web.app`

## Objective and scope

Provide a demonstrable web prototype for institute structure and people management, attendance/marks recording, academic-risk prediction, recommendations and analytics. This is not a production ERP or commercial SaaS platform.

## Approved stack

- React, Vite, Tailwind CSS, Recharts, Lucide React
- Firebase Authentication (email/password), Cloud Firestore, Firebase Hosting
- Existing Firebase Cloud Functions source for trusted account provisioning
- Python, Pandas, NumPy, Scikit-learn
- VS Code, Git, GitHub

## Binding constraints and exclusions

- The project owner does **not** want to upgrade Firebase to Blaze. Do not recommend billing upgrade as the default solution.
- Do not introduce Kiro, Postman, PostgreSQL, SQLAlchemy, custom JWT, unnecessary FastAPI, microservices, parent portal, payments/fees, payroll, SMS/WhatsApp notifications, chat, SaaS billing, mobile application or distributed ML infrastructure unless scope is explicitly changed.
- Preserve local changes and user data. Never use destructive reset/clean commands to resolve a sync conflict; never clear Firestore collections as generic troubleshooting.

## Roles and permissions

- **Admin:** institute structure, people, enrollments, teacher assignments, academic records, analytics and managed-user provisioning.
- **Teacher:** assigned academic work and permitted attendance/marks workflows; access must be constrained by assignments and enrollments.
- **Student:** own linked profile, attendance, marks, risk indicators and recommendations.

Firestore Rules—not hidden UI controls—must enforce data access. Public users must not assign themselves admin/teacher roles. Current product documents describe administrator-managed student/teacher profiles. A test that expects public student-profile creation contradicts the current rule and should be reconciled without weakening security.

## Account workflow and current plan limitation

Intended workflow:
1. Landing navigation shows **Create Admin** then **Sign In**.
2. Callable `registerInstitutionAdmin` performs one-time institution and first-admin setup.
3. The administrator provisions teacher/student accounts through trusted managed-user logic.
4. Shared Sign In opens the workspace based on the trusted `users/{uid}` profile.
5. Admin profile recovery is intended only for the original account with server-issued admin custom claims.

Current limitation:
- Callable functions are part of the source design, but their deployment is blocked by the current Spark/no-Blaze constraint and must not be assumed available.
- The existing manually provisioned admin was reported working previously; reverify against the current live site.
- For the no-billing demo, manually provision teacher/student Auth accounts and matching Firestore profiles through Firebase Console if needed. Link the profile and academic records to the correct Auth UIDs. This is a manual demonstration path, not proof of automated provisioning.
- Never allow client-supplied role assignment or relax rules to bypass missing Functions.

## Main collections

`users`, `institutions`, `branches`, `programs`, `academicYears`, `classes`, `sections`, `students`, `teachers`, `subjects`, `enrollments`, `teacherAssignments`, `teacherClassAccess`, `attendance`, `assessments`, `marks`, `predictions`, `recommendations`.

Academic relationship: Student → Enrollment → Academic Year / Class / Section. Saving enrollment should update the student's current class/section/year references. Academic records use identity and scope fields so rules can constrain access.

## Machine-learning status and limitations

- Features: attendance, average marks, recent trend, missed assessments.
- Output labels: Low, Medium, High.
- Recommendations are rule-based.
- Dataset and labels are synthetic/formula-generated.
- Tree-vote share is not a calibrated probability; outputs are advisory.

Audit dated 2026-10-18 found two source-level discrepancies:
1. Source review indicates numeric label semantics are consistent with the `Low, Medium, High` metadata order: poor scores map to High risk (index 2), middle scores to Medium (index 1), strong scores to Low risk (index 0). The earlier audit's reversed-mapping claim was incorrect; deterministic tests are still required.
2. `ml/model.json` and `frontend/public/model.json` contain 5 trees, while the training script and `ml/EVALUATION.md` specify 40 trees.

Do not claim the current 86.25% synthetic holdout metric describes the shipped frontend artifact until the artifact/configuration is reconciled and the exact shipped artifact is reevaluated.

## Audit and current verification state (2026-10-18)

- Code baseline audited: `facd99297139a4e891ee461e3a674751d7bf24f0`; later commits in this audit task changed documentation only.
- Latest recorded CI run for the audited code baseline failed during Firestore Emulator authorization tests; ESLint and build were skipped.
- A test expects a user to self-create a student profile; current `users/{userId}` rules permit creation only by admin. Exact failing assertion still needs to be captured from CI output.
- A previous local `git pull --ff-only origin main` failed because of local modifications to `frontend/src/services/authService.js`. Preserve and inspect local changes before syncing.
- A local build and Hosting release succeeded on 2026-10-17, but the local checkout had not successfully synchronized to intended latest source first. Current live/source parity is unverified.
- Hosting, Cloud Functions, Firestore rules and indexes are separate deployment targets.
- A previous local build produced a roughly 1.2 MB JavaScript bundle with a Vite chunk warning; this is historical, not a current measurement.

## Required phases

1. Preserve local changes, synchronize source and repair CI.
2. Prepare a no-billing demo using verified/manual account provisioning.
3. Add ML label-semantic regression tests, reconcile the artifact mismatch and verify Python/browser parity.
4. Verify the complete academic workflow.
5. Complete security acceptance for all roles.
6. Polish UI states, accessibility, responsive layout and performance.
7. Perform authorized release verification and independently verify each Firebase target.
8. Finalize report/PPT/demo from verified evidence.

## Canonical documents

- `docs/REPOSITORY_AUDIT.md`
- `docs/BUG_BACKLOG.md`
- `docs/PHASED_ROADMAP.md`
- `docs/ACCEPTANCE_TEST_PLAN.md`
- `docs/DECISIONS.md`
- `docs/DEVELOPMENT_STATUS.md`
- `docs/FIREBASE_DEPLOYMENT.md`
- `docs/EXAM_DEMO_CHECKLIST.md`

## Development rules

- Inspect the current repository and local state before editing.
- Work directly on `main` unless asked otherwise.
- Fetch the latest file SHA before updating an existing GitHub file.
- Keep commits focused and descriptive.
- Never commit `.env.local`, service-account JSON or credentials.
- Report changed files, tests, deployment status and remaining limitations honestly.
- Treat verified code and test output as authoritative over stale documentation.
