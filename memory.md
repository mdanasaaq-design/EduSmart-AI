# EduSmart AI — Project Memory

## Identity
- Project: EduSmart AI
- Full title: AI-Powered Educational Institute Management System with Student Academic Risk Prediction
- Type: college mini-project / working prototype
- Repository: `mdanasaaq-design/EduSmart-AI`
- Default branch: `main`
- Firebase project: `edusmart-ai-c4692`
- Hosting URL: `https://edusmart-ai-c4692.web.app`

## Purpose
Manage institute structure, student/teacher records, attendance and marks, then demonstrate academic-risk prediction and recommendations.

## Approved stack
React, Vite, Tailwind CSS, Recharts, Lucide React, Firebase Authentication, Cloud Firestore, Firebase Hosting, Firebase Cloud Functions, Python, Pandas, NumPy, Scikit-learn, Git, GitHub.

## Explicit exclusions
Do not introduce Kiro, Postman, PostgreSQL, SQLAlchemy, custom JWT, unnecessary FastAPI/backend infrastructure, microservices, or out-of-scope commercial features unless the project owner changes scope.

## Required account flow
- Landing page top-right actions: **Create Admin**, then **Sign In**.
- Create Admin is one-time institution setup using callable `registerInstitutionAdmin`.
- Admin can provision teacher/student accounts using the trusted managed-user callable.
- All roles use shared Sign In; the Firestore user profile controls the workspace.
- Public users must not select their own role or self-promote.
- Deleting Firestore profiles does not delete Firebase Authentication accounts. Never clear data as a generic troubleshooting step.

## Core roles
- **Admin:** institute structure, people, assignments, academic records, analytics, user provisioning.
- **Teacher:** assigned academic data and permitted attendance/marks workflows.
- **Student:** own profile, attendance, marks, risk and recommendations.

## Main collections
`users`, `institutions`, `branches`, `programs`, `academicYears`, `classes`, `sections`, `students`, `teachers`, `subjects`, `enrollments`, `teacherAssignments`, `attendance`, `assessments`, `marks`, `predictions`, `recommendations`.

## ML model
Random Forest classifier; features: `attendance`, `averageMarks`, `recentTrend`, `missedAssessments`. Training/evaluation data are synthetic. Metrics must never be presented as real-world model performance. Recommendations are rule-based.

## Known status and constraints
- GitHub `main` source has the Create Admin and Sign In navigation actions.
- Local development has previously had an uncommitted `frontend/src/services/authService.js` change that blocked `git pull --ff-only`.
- A local Vite production build and Firebase Hosting release completed on 2026-10-17, but the build was made before the failed pull. Therefore that deployment does not establish that latest `main` source is live or that the button is visible.
- Hosting deployment does not deploy Cloud Functions or Firestore rules.
- Live Create Admin, managed-user, teacher/student, and end-to-end academic workflows still require explicit browser verification.

## Development rules
- Inspect the current repository state before editing.
- Work directly on `main` unless asked otherwise.
- Fetch the latest file SHA before updating a GitHub file.
- Preserve local changes; never recommend destructive resets or indiscriminate data deletion.
- Keep commits focused and descriptive.
- Report changed files, tests, and remaining limitations honestly.
- Treat verified code and test output as authoritative over stale documentation.
