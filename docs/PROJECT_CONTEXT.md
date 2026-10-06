# EduSmart AI — Canonical Project Context

> This document is the durable project context for developers, documentation work, testing, and future AI-assisted development. It must be kept synchronized with the repository.

## Project identity
- Name: **EduSmart AI**
- Full title: **AI-Powered Educational Institute Management System with Student Academic Risk Prediction**
- Type: B.E. CSE (AI & ML) college mini-project / working prototype
- Repository: `mdanasaaq-design/EduSmart-AI`
- Default branch: `main`
- Primary IDE: VS Code
- College context: Nawab Shah Alam Khan College of Engineering & Technology (NSAKCET)
- Department: Computer Science & Engineering (AI & ML)
- Academic year: 2026–2027

## Project objective
Build a demonstrable web prototype that combines basic educational-institute management with student academic-risk prediction. The system manages academic structure, people, attendance and marks, then derives simple indicators and predicts **Low / Medium / High** academic risk.

This is an academic prototype, **not a production ERP, commercial SaaS product, or clinically/psychologically diagnostic system**.

## Approved technology stack
### Frontend
- React.js
- Vite
- Tailwind CSS
- Recharts
- Lucide React

### Firebase
- Firebase Authentication — Email/Password
- Cloud Firestore — primary application database
- Firebase Hosting — intended deployment target
- Cloud Functions — only if a future requirement genuinely needs server-side logic

### Machine learning
- Python
- Pandas
- NumPy
- Scikit-learn
- Primary model: Random Forest Classifier
- Possible future comparison: Logistic Regression

### Development/version control
- VS Code
- Git
- GitHub
- GPT — implementation, architecture, debugging and integration
- Claude — PPT, project report and research-paper synthesis

## Explicit exclusions
Do not introduce these unless the project owner explicitly changes scope:
- Kiro
- Postman
- PostgreSQL
- SQLAlchemy
- custom JWT authentication
- unnecessary FastAPI
- microservices
- parent portal
- payments/fees
- payroll
- SMS/WhatsApp notifications
- chat/real-time communication
- commercial SaaS billing
- mobile application
- advanced distributed ML infrastructure

## Core roles
### Admin
Manage branches, programs, academic years, classes, sections, students, enrollments, teachers, subjects, teacher assignments and analytics.

### Teacher
Work with academic assignments, record attendance and marks, and inspect student performance/risk.

### Student
View their own academic profile, attendance, marks, risk prediction, risk indicators and recommendations.

## Core demonstration flow
1. Admin logs in.
2. Admin creates branch/program/academic year/class/section.
3. Admin creates student and enrollment.
4. Admin creates teacher and subject.
5. Admin creates teacher-subject-class assignment.
6. Teacher/admin records attendance and assessment marks.
7. System calculates academic features.
8. Random Forest predicts Low/Medium/High risk.
9. System stores prediction and rule-based recommendation.
10. Analytics summarizes saved predictions.
11. A linked student account can view its own academic information.

## Firestore collections
- `users`
- `institutions`
- `branches`
- `programs`
- `academicYears`
- `classes`
- `sections`
- `students`
- `teachers`
- `subjects`
- `enrollments`
- `teacherAssignments`
- `attendance`
- `assessments`
- `marks`
- `predictions`
- `recommendations`

### Academic relationship
```
Student
  ↓
Enrollment
  ↓
Academic Year
  ↓
Class
  ↓
Section
```

### Student account linkage
A student profile may contain `userId`, which stores the Firebase Authentication UID for that student's account.

Academic records created for the student carry `studentUserId` so the student workspace can query its own records without exposing other students' records.

## ML specification
### Input features
- `attendance`
- `averageMarks`
- `recentTrend`
- `missedAssessments`

### Output classes
- Low
- Medium
- High

### Training data
The prototype model is trained using **synthetic/demo data**, not real institutional student data.

Reason:
- no approved real institutional dataset is available;
- student privacy must be protected;
- this is a college prototype.

Never claim synthetic-data performance is proof of real-world effectiveness.

### Inference
Python/Scikit-learn is used for training. The compact exported model is loaded by the React frontend for browser-side demonstration inference, avoiding a separate ML API.

### Explainability
The prototype displays measurable indicators such as attendance, average marks and recent trend. These are **risk indicators/features**, not causal explanations.

### Recommendations
Recommendations are rule-based. Example categories:
- low attendance → improve attendance/participation;
- low marks → focus on academic preparation;
- declining trend → review recent topics and upcoming assessments.

Do not describe them as AI-generated counseling unless a separate model is actually implemented.

## Security model
- Firebase Authentication handles identity.
- Firestore Security Rules enforce authorization.
- Client-side role checks are UX only and are not the security boundary.
- A normal user must not be able to change their own role.
- Students may read only records linked to their authenticated account.
- Admin/teacher write permissions follow the rules in `firebase/firestore.rules`.
- Never commit `frontend/.env.local` or Firebase secrets.

## Repository structure
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

## Important frontend areas
- `frontend/src/App.jsx` — application navigation/dashboard
- `frontend/src/firebase.js` — Firebase client initialization
- `frontend/src/pages/admin/` — administration modules
- `frontend/src/pages/AcademicRecords.jsx` — attendance/marks/prediction workflow
- `frontend/src/pages/RoleDashboard.jsx` — teacher/student workspace
- `frontend/public/model.json` — compact browser inference model
- `frontend/.env.local` — local Firebase configuration; never commit

## ML files
- `ml/train_model.py` — synthetic-data model training/export workflow
- `ml/model.json` — exported model artifact
- `frontend/public/model.json` — frontend-accessible copy used by browser inference

## Documentation source of truth
The following files collectively document the project:
- `prd.md` — product requirements and scope
- `architecture.md` — architecture and data model
- `rules.md` — development/project rules
- `design.md` — UI/UX design
- `tasks.md` — implementation/testing status
- `memory.md` — compact project memory
- `docs/PROJECT_CONTEXT.md` — canonical consolidated context
- `docs/DEVELOPMENT_STATUS.md` — current implementation/verification state

If documentation conflicts with verified code, **verified code is authoritative**, and the documentation must then be updated.

## Academic documentation rules
The PPT/report must:
- distinguish implemented, pending verification and planned functionality;
- identify the ML dataset as synthetic/demo;
- never invent accuracy, precision, recall, F1, screenshots or test results;
- use real, traceable research papers;
- describe limitations and ethical/privacy considerations;
- present the project as a college prototype.

## Development rules
- Work directly on `main` unless a branch is explicitly requested.
- Before updating an existing GitHub file, fetch its current SHA.
- Keep commits focused and descriptive.
- Pull remote changes before local testing.
- Implement the simplest working solution first.
- Browser-test each major workflow before calling it complete.
- Do not add scope merely to make the project appear larger.

## Definition of done
The project is complete when:
1. the complete core workflow works locally;
2. authentication and role restrictions work;
3. Firestore rules block unauthorized operations;
4. attendance/marks persist correctly;
5. ML prediction loads and runs;
6. recommendations persist and display;
7. analytics displays saved predictions;
8. student/teacher workflows work;
9. production build succeeds;
10. Firebase Hosting configuration/deployment is verified if deployment is required;
11. documentation and academic report reflect the actual implementation and limitations.

## Current known status
Major modules have been implemented, but the project is **not yet declared final** until browser/end-to-end verification and production build testing are completed. See `docs/DEVELOPMENT_STATUS.md`.
