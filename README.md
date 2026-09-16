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
