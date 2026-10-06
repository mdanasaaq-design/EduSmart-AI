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

## Run
```bash
cd frontend
npm install
npm run dev
```

Firebase configuration belongs in `frontend/.env.local` and must not be committed.

## Firestore rules
`firebase/firestore.rules` contains the prototype security rules. Publish these rules in the Firebase Console before testing student-role access.


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
