# EduSmart AI — Project Memory

## Identity
- Project: EduSmart AI
- Full title: AI-Powered Educational Institute Management System with Student Academic Risk Prediction
- Type: college mini-project / working prototype
- Repository: `mdanasaaq-design/EduSmart-AI`
- Default branch: `main`
- Firebase project: `edusmart-ai-c4692`
- Hosting URL: `https://edusmart-ai-c4692.web.app`
- College context: Nawab Shah Alam Khan College of Engineering & Technology (NSAKCET), CSE (AI & ML), academic year 2026–2027.

## Purpose
Manage institute structure, student/teacher records, attendance and marks, then demonstrate academic-risk prediction and recommendations.

## Approved stack and explicit exclusions
- Stack: React, Vite, Tailwind CSS, Recharts, Lucide React, Firebase Auth/Firestore/Hosting, existing Cloud Functions source, Python, Pandas, NumPy, Scikit-learn, Git/GitHub.
- Do not introduce Kiro, Postman, PostgreSQL, SQLAlchemy, custom JWT, unnecessary FastAPI/backend infrastructure, microservices, parent portal, fees/payments, payroll, messaging/chat, SaaS billing or mobile app unless the project owner changes scope.
- **Firebase billing constraint:** the user does not want to upgrade to Blaze. Do not recommend a billing upgrade as the default solution.

## Required account flow and security
- Landing page actions: **Create Admin**, then **Sign In**.
- Intended first-admin setup uses callable `registerInstitutionAdmin`.
- If the original administrator retains server-issued `role=admin` and `institutionId=primary` claims but the Firestore profile is missing, `restoreAdminProfile` is intended to restore that same UID securely.
- Admin-managed teacher/student accounts use trusted provisioning logic.
- Public users must not assign themselves admin/teacher roles or bypass security rules.
- On the current no-Blaze plan, callable workflows cannot be assumed deployed. For the demo, use the existing manually provisioned admin and, if necessary, create demo Auth accounts plus matching Firestore profiles through Firebase Console. Treat this as manual setup, not verified automated provisioning.
- Deleting Firestore profiles does not delete Firebase Authentication accounts. Never clear data as generic troubleshooting.

## Roles and collections
- Admin: institute structure, people, enrollments, assignments, academic records, analytics and managed-user provisioning.
- Teacher: assigned academic data and permitted attendance/marks workflows.
- Student: own linked profile, attendance, marks, risk and recommendations.
- Main collections: `users`, `institutions`, `branches`, `programs`, `academicYears`, `classes`, `sections`, `students`, `teachers`, `subjects`, `enrollments`, `teacherAssignments`, `attendance`, `assessments`, `marks`, `predictions`, `recommendations`, `teacherClassAccess`.

## ML model
- Features: `attendance`, `averageMarks`, `recentTrend`, `missedAssessments`.
- Output labels: Low, Medium, High; recommendations are rule-based.
- Training/evaluation data and labels are synthetic. Metrics do not establish real-world performance.
- Audit correction dated 2026-10-18: source review indicates the numeric label mapping is consistent with the human-readable class order; deterministic regression tests are required.
- The checked-in `ml/model.json` and `frontend/public/model.json` now contain 40 trees and are regenerated reproducibly by CI. The scikit-learn baseline scores 86.25% and the browser majority-vote model scores 87.08% on the synthetic holdout; neither metric establishes real-world performance.
- Tree-vote fraction is not a calibrated probability.

## Latest audit and verification state (2026-10-18)
- Audited code baseline: commit `facd99297139a4e891ee461e3a674751d7bf24f0`; documentation-only audit commits followed.
- The original Firestore test/rule mismatch was fixed by changing the test to expect denial for self-registration; rules were not weakened. Full CI passed 18 Firestore tests, 4 Python ML tests, 3 browser inference tests including vote-share rounding, ESLint and production build in run `39117262846`.
- A local `git pull --ff-only origin main` previously failed due to local changes in `frontend/src/services/authService.js`. Preserve local changes; never destructive-reset to solve a sync conflict.
- A previous local Vite build and Hosting release succeeded on 2026-10-17, but the local checkout had not successfully pulled intended latest source first. Current live/source parity is unverified.
- Hosting, Functions, Firestore rules and indexes are separate deployment targets. Do not infer one from another.
- Previous local bundle was about 1.2 MB with a Vite chunk warning; treat this as historical, not a current measurement.

## Current roadmap
1. Source synchronization and CI recovery.
2. No-billing demo account setup.
3. ML label-semantic regression tests, artifact reconciliation, Python/browser parity and vote-share rounding tests.
4. End-to-end academic workflow.
5. Security acceptance.
6. UI/accessibility/responsive polish.
7. Authorized release verification.
8. Report/PPT/demo sign-off.

## Canonical planning documents
- `docs/REPOSITORY_AUDIT.md`
- `docs/BUG_BACKLOG.md`
- `docs/PHASED_ROADMAP.md`
- `docs/ACCEPTANCE_TEST_PLAN.md`
- `docs/DECISIONS.md`
- `docs/DEVELOPMENT_STATUS.md`
- `docs/EXAM_DEMO_CHECKLIST.md`

## Development rules
- Inspect current repository and local state before editing.
- Work directly on `main` unless asked otherwise.
- Fetch the latest file SHA before updating an existing GitHub file.
- Preserve local changes; never use destructive resets for ordinary merge conflicts.
- Keep commits focused and descriptive.
- Never commit `.env.local`, service-account JSON or credentials.
- Report changed files, test results, deployment status and limitations honestly.
- Treat verified code/test output as authoritative over stale documentation.
