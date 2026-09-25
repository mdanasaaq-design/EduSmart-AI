# EduSmart AI — Architecture

## 1. Architecture Style
EduSmart AI uses a lightweight client-centric Firebase architecture suitable for a college mini-project.

## 2. Technology Stack
### Frontend
- React.js
- Vite
- Tailwind CSS
- Recharts
- Lucide React

### Backend / Cloud Services
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Cloud Functions only if a later feature genuinely requires server-side logic

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn

### Development
- VS Code
- Git
- GitHub
- GPT
- Claude

## 3. High-Level Flow
Browser
→ React application
→ Firebase Authentication
→ Firestore

React academic-record workflow
→ feature calculation
→ Random Forest inference
→ prediction + factors + recommendations
→ Firestore

Python ML workflow
→ synthetic/prototype dataset
→ preprocessing
→ model training
→ exported compact model
→ frontend inference for demonstration

## 4. Repository Structure
```
EduSmart-AI/
├── frontend/
├── functions/
├── ml/
├── docs/
├── firebase/
├── tests/
├── README.md
├── .gitignore
└── LICENSE
```

## 5. Frontend Structure
```
frontend/src/
├── components/
├── pages/
│   ├── auth/
│   ├── admin/
│   ├── teacher/
│   └── student/
├── layouts/
├── services/
├── hooks/
├── utils/
├── routes/
├── App.jsx
├── main.jsx
└── index.css
```

## 6. Data Model
Core Firestore collections:
- users
- institutions
- branches
- programs
- academicYears
- classes
- sections
- students
- teachers
- subjects
- enrollments
- teacherAssignments
- attendance
- assessments
- marks
- predictions
- recommendations

Academic progression is represented through:
Student → Enrollment → Academic Year → Class → Section.

## 7. Authentication
Firebase Authentication handles email/password authentication. The Firestore `users/{uid}` document stores application role information:
- admin
- teacher
- student

The frontend uses the authenticated UID to load the user profile and determine the workspace.

## 8. Security Boundary
Firestore Security Rules enforce role-aware access. Client-side role checks are for user experience only; authorization must ultimately be enforced by Firestore rules.

## 9. ML Design
Training is performed in Python with Scikit-learn. The prototype model uses Random Forest classification with four input features. The frontend loads the exported compact model for browser-side inference so the demonstration does not require a separate ML API.

## 10. Architectural Principles
- Prefer simple Firebase-native solutions.
- Avoid unnecessary backend infrastructure.
- Keep the prototype modular.
- Persist important academic records in Firestore.
- Never expose secrets or `.env.local` in Git.
- Do not claim production-grade ML validation from synthetic data.
