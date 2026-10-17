# EduSmart AI — Product Requirements Document

## 1. Product overview

EduSmart AI is a college mini-project prototype for educational institute management with a student academic-risk prediction feature. It combines role-aware institute administration, attendance and marks, academic indicators, predictions, recommendations and analytics.

It is an academic prototype, not a production ERP or commercial SaaS platform.

## 2. Problem statement

Academic information can be scattered across separate records. Administrators need a simple way to organize institute data, teachers need controlled access to assigned academic workflows, and students need a clear view of their own performance. A prototype risk indicator can help demonstrate how available academic signals might be summarized for follow-up.

## 3. Objectives

- Manage basic institute structure and academic records.
- Support Admin, Teacher and Student roles.
- Provide a controlled first-administrator setup process.
- Let administrators provision teacher and student accounts.
- Record attendance and assessment marks.
- Calculate performance indicators and predict Low/Medium/High risk.
- Present measurable indicators and rule-based recommendations.
- Summarize persisted predictions in analytics.

## 4. Users and capabilities

### Admin
Manages branches, programs, academic years, classes, sections, students, enrollments, teachers, subjects, teacher assignments, user access, attendance/marks, and analytics.

### Teacher
Works with permitted assigned academic data, records attendance and marks, and reviews relevant student performance/risk information.

### Student
Views their own linked profile, attendance, marks, risk prediction, indicators and recommendations.

## 5. Functional requirements

1. Landing page displays **Create Admin** and **Sign In**, in that order.
2. Create Admin collects institution and first-administrator details.
3. A trusted callable function enforces one-time admin setup and writes the initial profile/institution record.
4. Shared Sign In authenticates all roles and routes using the trusted Firestore user profile.
5. Admin can provision teacher and student accounts through trusted server-side logic.
6. Users cannot assign themselves privileged roles.
7. Branch, program, academic year, class and section management.
8. Student, enrollment, teacher, subject and assignment management.
9. Attendance and assessment-mark entry with validation.
10. Academic feature calculation.
11. Random Forest inference for Low/Medium/High risk.
12. Persist predictions and rule-based recommendations.
13. Analytics summarizes saved academic/prediction data.
14. Firestore rules constrain access by role, linked identity, assignment and enrollment.
15. Local build and deployment can be reproduced from repository documentation.

## 6. ML workflow

Inputs: attendance percentage, average marks, recent performance trend and missed assessments. Outputs: Low, Medium or High.

The demo Random Forest is trained on synthetic data. Synthetic evaluation metrics must not be represented as real-world accuracy. Model output is advisory and not the sole basis for consequential student decisions.

## 7. Non-functional requirements

- Clear and responsive interface.
- Maintainable React modules.
- Firebase-backed persistence.
- Trusted account provisioning and Firestore authorization.
- Clear validation, loading, empty and error states.
- Reproducible setup and deployment.
- Honest documentation of prototype limitations.

## 8. Out of scope

Parent portal, mobile application, fees/payments, payroll, SMS/WhatsApp, chat, SaaS billing, microservices, and production-scale ML infrastructure.

## 9. Primary demonstration flow

Open landing page → Create Admin for initial setup → admin dashboard → create academic structure → create student/enrollment and teacher/subject → assign teacher → record attendance/marks → generate prediction → inspect factors/recommendation → analytics → sign in as a linked student.

## 10. Acceptance criteria

- Landing page exposes both required navigation actions.
- One-time admin setup succeeds only when setup is available.
- Administrator can sign in and provision teacher/student accounts.
- Authentication profile and Firestore role remain consistent.
- Data persists and authorization is enforced by Firestore rules.
- Core academic workflow produces a saved prediction and recommendation.
- Analytics displays persisted records.
- Student/teacher access is correctly scoped.
- Production build succeeds and the deployed frontend/functions/rules are separately verified.
