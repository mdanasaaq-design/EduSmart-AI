# EduSmart AI

AI-powered educational institute management system — college mini project prototype.

## Stack
- React + Vite
- Tailwind CSS
- Recharts
- Firebase Authentication
- Cloud Firestore
- Python + Pandas/NumPy + Scikit-learn
- GitHub

## Prototype flow
Admin creates academic structure → students/classes/sections → teachers/subjects → teacher assignments → attendance and marks → Random Forest risk prediction → recommendations → analytics.

## ML model
The demo model is a Random Forest trained by `ml/train_model.py` on a synthetic dataset so the prototype can run without exposing real student data. Features are attendance, average marks, recent performance trend and missed assessments. The generated model is exported as JSON and evaluated in the React frontend. Replace the synthetic data with an approved anonymized dataset for research evaluation.

## Run locally
```bash
cd frontend
npm ci
npm run dev
```

Firebase configuration belongs in `frontend/.env.local` and must not be committed. Copy `frontend/.env.example` if present, then fill in the Firebase Web App values for your own Firebase project.

## Firebase Hosting deployment
The repository includes Firebase Hosting configuration for the Vite SPA, including a fallback rewrite to `index.html`, and a manual GitHub Actions production deployment workflow. Follow [Firebase Hosting Deployment](docs/FIREBASE_DEPLOYMENT.md) to create the Firebase project configuration, add repository secrets, and deploy.

## Firestore security setup
`firebase/firestore.rules` contains the prototype security rules. Publish these rules to the Firebase project before testing role-based access.

- A signed-in user cannot create their own `users/{uid}` profile or assign themselves a role.
- Provision the first administrator through a trusted project-owner workflow (Firebase Console or a trusted Admin SDK environment); the client app must never bootstrap an admin role.
- Once an administrator exists, user profiles must be provisioned by an administrator.
- Students can read their linked academic records, but only administrators/teachers can write attendance, marks, predictions and recommendations.
- Client-side role checks are for navigation only; Firestore rules are the authorization boundary.

These are prototype rules, not a substitute for a complete production authorization review. Teacher access to student data still needs assignment-scoped authorization before production use.

## Continuous integration
The `.github/workflows/frontend-ci.yml` workflow runs Firestore Emulator authorization tests, ESLint and a Vite production build on pushes to `main` and pull requests targeting `main`. On 2026-10-16, commit `6ac5a22` passed all 18 rules tests, lint and build. Browser acceptance and live rules deployment remain separate verification steps.

## Model evaluation

A reproducible synthetic holdout evaluation is documented in [ML Evaluation](ml/EVALUATION.md). The 86.25% accuracy result is on formula-generated synthetic labels only and must not be presented as real-world student prediction accuracy.

## Project documentation
The repository contains the project context and working documentation needed to continue development:

- [Canonical Project Context](docs/PROJECT_CONTEXT.md) — project identity, stack, scope, architecture, data model, ML rules, security and development conventions.
- [Development Status](docs/DEVELOPMENT_STATUS.md) — current implementation state, recent fixes, verification checklist and acceptance-test sequence.
- [Product Requirements](prd.md) — requirements and acceptance criteria.
- [Architecture](architecture.md) — system architecture and data model.
- [Project Rules](rules.md) — development and technology constraints.
- [UI/UX Design](design.md) — interface and demonstration guidelines.
- [Task Tracker](tasks.md) — implementation checklist.
- [Project Memory](memory.md) — compact persistent project memory.

**Source-of-truth rule:** verified code is authoritative. If documentation becomes outdated, update the documentation to match the implementation.
