# EduSmart AI

**AI-Powered Educational Institute Management System with Student Academic Risk Prediction**

EduSmart AI is a college mini-project prototype that brings institute administration, academic records, and a demonstrative student academic-risk model into one React web application.

- **Repository:** [mdanasaaq-design/EduSmart-AI](https://github.com/mdanasaaq-design/EduSmart-AI)
- **Firebase project:** `edusmart-ai-c4692`
- **Hosting URL:** [https://edusmart-ai-c4692.web.app](https://edusmart-ai-c4692.web.app)
- **Status:** implementation and integration verification; do not assume every live workflow is verified.

## Technology stack

- React, Vite, Tailwind CSS, Recharts, Lucide React
- Firebase Authentication (email/password)
- Cloud Firestore
- Firebase Hosting
- Firebase Cloud Functions for trusted account provisioning
- Python, Pandas, NumPy, Scikit-learn for model training
- Git and GitHub

## Account and role workflow

1. The landing page offers **Create Admin** and **Sign In** in the top-right navigation.
2. **Create Admin** is intended for one-time institution setup. It collects institution and administrator details, calls the trusted `registerInstitutionAdmin` Cloud Function, and then signs in the new administrator.
3. If a Firestore admin profile was accidentally deleted but the original account retains its server-issued admin custom claim, the shared sign-in flow calls the restricted `restoreAdminProfile` function to restore that same UID's profile. The administrator then receives the workspace permitted by the trusted Firestore profile role.
4. From **User Access & Roles**, an administrator can provision teacher and student accounts. Public users must not be able to assign themselves admin or teacher privileges.
5. Teachers and students sign in through the same sign-in entry point. Their available screens and data depend on their role and linked records.

Teacher academic-record access is scoped by assignment-specific queries and `teacherClassAccess/{uid}__{classId}` documents; student profiles receive `currentClassId` when an enrollment is saved. The account and academic workflows depend on deployed Cloud Functions, Firebase Authentication configuration, Firestore rules, and the composite indexes in `firebase/firestore.indexes.json`. Deleting Firestore documents does **not** delete Firebase Authentication accounts. Do not repeatedly clear collections to troubleshoot account setup.

## Core demonstration flow

Manage institute structure → manage students and enrollments → manage teachers and subjects → assign teachers → record attendance and marks → calculate features → generate academic-risk prediction → inspect factors and recommendations → review analytics → sign in as a linked student.

## Machine-learning prototype

The demo Random Forest is trained by `ml/train_model.py` on a synthetic dataset. Inputs include attendance, average marks, recent performance trend, and missed assessments. The compact exported model is loaded by the frontend for browser inference.

The documented 86.25% holdout accuracy is measured against formula-generated synthetic labels only. It is **not** evidence of real-world student-risk accuracy, fairness, or calibration. See [ML Evaluation](ml/EVALUATION.md).

## Run locally

Requirements: a supported Node.js version, npm, and access to a Firebase project.

```bash
cd frontend
npm ci
```

Create `frontend/.env.local` with the six Firebase Web App settings (see `frontend/.env.example` if present). Never commit this file.

```bash
npm run dev
npm run build
npm run lint
```

## Firebase deployment

See [Firebase Deployment](docs/FIREBASE_DEPLOYMENT.md). Hosting serves the built SPA from `frontend/dist`. Build after pulling the intended commit; deploying an old local build will not publish newer GitHub source. If the frontend calls Cloud Functions, deploy the functions separately as documented.

Current target: `edusmart-ai-c4692`, region `us-central1`. Confirm the target project before every deployment.

## Security notes

- Firestore Security Rules, not hidden buttons or client-side role checks, are the authorization boundary.
- Normal users must not create or edit their own role.
- Trusted Cloud Functions use the Admin SDK to provision administrator and managed-user profiles.
- Never commit `.env.local`, service-account JSON, or other credentials.
- Teacher/student record access must remain constrained by linked identity and academic assignment/enrollment data.
- These are prototype controls; complete production security review is still required.

## Documentation index

- [Canonical Project Context](docs/PROJECT_CONTEXT.md)
- [Development Status and Verification](docs/DEVELOPMENT_STATUS.md)
- [Firebase Deployment](docs/FIREBASE_DEPLOYMENT.md)
- [Product Requirements](prd.md)
- [Architecture](architecture.md)
- [Project Rules](rules.md)
- [UI/UX Design](design.md)
- [Task Tracker](tasks.md)
- [Project Memory](memory.md)
- [Synthetic ML Evaluation](ml/EVALUATION.md)

**Source-of-truth rule:** code and verified test output take precedence over outdated documentation. Mark a workflow verified only after running its acceptance test.
