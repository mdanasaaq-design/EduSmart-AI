# EduSmart AI

**AI-Powered Educational Institute Management System with Student Academic Risk Prediction**

EduSmart AI is a college mini-project prototype that brings institute administration, academic records, and a demonstrative student academic-risk model into one React web application.

- **Repository:** [mdanasaaq-design/EduSmart-AI](https://github.com/mdanasaaq-design/EduSmart-AI)
- **Firebase project:** `edusmart-ai-c4692`
- **Hosting URL:** [https://edusmart-ai-c4692.web.app](https://edusmart-ai-c4692.web.app)
- **Status:** implementation and integration verification; not signed off as complete.
- **Current audit:** [Repository Audit](docs/REPOSITORY_AUDIT.md)

## Technology stack

- React, Vite, Tailwind CSS, Recharts, Lucide React
- Firebase Authentication (email/password)
- Cloud Firestore
- Firebase Hosting
- Firebase Cloud Functions source for trusted account provisioning
- Python, Pandas, NumPy, Scikit-learn for model training
- Git and GitHub

## Important current limitations

- The original Firestore test failure was resolved without weakening rules. The expanded CI now covers Firestore, Python ML contract tests, browser inference tests, ESLint and production build. See [Development Status](docs/DEVELOPMENT_STATUS.md) for the latest run.
- A source-level mismatch exists between a test that expects student self-registration and the current administrator-only user-profile creation rule. The intended security policy should be resolved without weakening authorization.
- The user's Firebase project is constrained to the no-Blaze/free plan. Callable Cloud Functions are required by some automated onboarding/account workflows and must not be assumed deployed. Do not upgrade billing as a default recommendation. For the immediate demo, the existing administrator and manually provisioned demo accounts may be used, with matching Firestore profiles and restrictive rules.
- The numeric class mapping is consistent with the Low/Medium/High metadata and has deterministic Python/browser inference tests. The shipped model artifacts contain 40 trees and are byte-identical. On the synthetic holdout, scikit-learn probability averaging scores 86.25% and browser majority voting scores 87.08%; neither is real-world validation.
- The most recent known Hosting release used a local checkout that had not successfully synchronized to the intended latest GitHub source. Current live/source parity is unverified.

## Account and role workflow

The intended account design uses a one-time institution/admin setup, then administrator-managed teacher/student accounts. All roles use the shared sign-in page; trusted user profiles determine their workspace. Public users must not be able to promote themselves to administrator or teacher.

The current Create Admin and managed-user workflows call trusted Cloud Functions. Because the current plan blocks assuming those functions are deployed, distinguish the **intended automated workflow** from the **manual Firebase Console setup used for the current demo**. Do not claim automated provisioning is verified unless the callable is available and tested.

Teacher academic-record access is intended to be scoped by assignment and enrollment data. Student records must be linked to the correct Firebase Auth UID. Deleting Firestore documents does not delete Firebase Authentication accounts; inspect both systems before troubleshooting.

## Core demonstration flow

Manage institute structure → create student and enrollment → create teacher and subject → assign teacher → record attendance/marks → generate academic-risk prediction → inspect recommendation → review analytics → sign in as linked student.

Run the flow only after the relevant acceptance checks pass. If a feature is blocked or unverified, state that limitation and use the tested demo path.

## Machine-learning prototype

The demo Random Forest is trained by `ml/train_model.py` on synthetic data. Inputs include attendance, average marks, recent performance trend, and missed assessments. The compact model is loaded by the frontend for browser inference.

The evaluation document distinguishes the 86.25% scikit-learn baseline from the 87.08% browser majority-vote result on formula-generated synthetic labels. The regenerated 40-tree artifacts match the training configuration and are byte-identical; CI tests artifact reproducibility and inference contracts. Neither metric establishes real-world academic-risk accuracy, fairness or calibration. See [ML Evaluation](ml/EVALUATION.md), [Repository Audit](docs/REPOSITORY_AUDIT.md) and [Bug Backlog](docs/BUG_BACKLOG.md).

## Run locally

Requirements: a supported Node.js version, npm, and access to a Firebase project.

```bash
cd frontend
npm ci
```

Create `frontend/.env.local` with the six Firebase Web App settings (see `frontend/.env.example`). Never commit this file.

```bash
npm run dev
npm run lint
npm run build
```

The current CI workflow includes Firestore authorization tests, Python ML export/inference tests, browser model-contract tests, ESLint and the production build. Check the latest Actions run before relying on the result.

## Firebase deployment

See [Firebase Deployment](docs/FIREBASE_DEPLOYMENT.md). Hosting serves the built SPA from `frontend/dist`. Build after synchronizing the intended source; deploying an old local build will not publish newer GitHub source. Hosting, Firestore rules, indexes and Cloud Functions are separate targets.

Current target: `edusmart-ai-c4692`. Confirm the target before any authorized deployment. Do not attempt to deploy Cloud Functions while the no-Blaze constraint remains in force.

## Security notes

- Firestore Security Rules, not hidden buttons or client-side role checks, are the authorization boundary.
- Normal users must not create or edit their own privileged roles.
- Trusted Cloud Functions provision privileged accounts when available; manual Console setup is a separate demonstration procedure.
- Never commit `.env.local`, service-account JSON, or other credentials.
- Teacher/student record access must remain constrained by linked identity and academic assignment/enrollment data.
- These are prototype controls; complete production security review is still required.

## Documentation index

- [Repository Audit](docs/REPOSITORY_AUDIT.md)
- [No-Billing Demo Setup](docs/FREE_PLAN_DEMO_SETUP.md)
- [Bug and Improvement Backlog](docs/BUG_BACKLOG.md)
- [Phased Roadmap](docs/PHASED_ROADMAP.md)
- [Acceptance Test Plan](docs/ACCEPTANCE_TEST_PLAN.md)
- [Architecture and Product Decisions](docs/DECISIONS.md)
- [Canonical Project Context](docs/PROJECT_CONTEXT.md)
- [Development Status and Verification](docs/DEVELOPMENT_STATUS.md)
- [Firebase Deployment](docs/FIREBASE_DEPLOYMENT.md)
- [Exam Demonstration Checklist](docs/EXAM_DEMO_CHECKLIST.md)
- [Product Requirements](prd.md)
- [Architecture](architecture.md)
- [Project Rules](rules.md)
- [UI/UX Design](design.md)
- [Task Tracker](tasks.md)
- [Project Memory](memory.md)
- [Synthetic ML Evaluation](ml/EVALUATION.md)

**Source-of-truth rule:** code and verified test output take precedence over outdated documentation. Mark a workflow verified only after running its acceptance test. See the phased roadmap for the order of work.
