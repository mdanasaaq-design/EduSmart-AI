# EduSmart AI — Product Requirements Document

## 1. Product Overview
EduSmart AI is a college mini-project prototype for educational institute management with an academic-risk prediction feature. It combines role-based institute management, attendance, assessment marks, analytics, and a machine-learning prediction workflow.

This is a working academic prototype, not a production ERP or commercial SaaS platform.

## 2. Problem Statement
Educational data is often maintained across disconnected records. Teachers and administrators need a simple way to manage academic information and identify students who may require additional academic support.

## 3. Objective
Build a usable web prototype that:
- manages basic academic institute structure;
- supports Admin, Teacher, and Student roles;
- records attendance and assessment marks;
- calculates simple performance indicators;
- predicts Low, Medium, or High academic risk;
- explains the prediction using measurable factors;
- provides rule-based recommendations.

## 4. Target Users
### Admin
Manages branches, programs, academic years, classes, sections, students, teachers, subjects, and teacher assignments.

### Teacher
Works with assigned academic data, records attendance and marks, and views student performance/risk information.

### Student
Views their academic profile, attendance, marks, prediction, risk factors, and recommendations.

## 5. Core Functional Requirements
1. Firebase Email/Password authentication.
2. Role-based access for Admin, Teacher, and Student.
3. Branch CRUD.
4. Program CRUD.
5. Academic year CRUD.
6. Class and section CRUD.
7. Student and enrollment management.
8. Teacher management.
9. Subject management.
10. Teacher-subject-class assignments.
11. Attendance recording.
12. Assessment/marks recording.
13. Performance calculations.
14. ML-based risk prediction.
15. Risk factors and recommendations.
16. Analytics dashboard.
17. Firebase/Firestore persistence.
18. Git/GitHub version control.

## 6. Core ML Workflow
Input features:
- attendance percentage;
- average marks;
- recent performance trend;
- missed assessments.

Output:
- Low;
- Medium;
- High.

The prototype uses a Random Forest classifier. The current demonstration model is trained on synthetic data because real institutional student data is unavailable. No fabricated real-world accuracy claim may be included in the project report.

## 7. Non-Functional Requirements
- Simple and responsive web UI.
- Clear navigation.
- Maintainable React code.
- Firebase-backed persistence.
- Basic role-aware security through Firestore rules.
- Reproducible GitHub project structure.
- Prototype-level reliability suitable for academic demonstration.

## 8. Out of Scope
- Parent portal.
- Mobile application.
- Fees/payment management.
- Payroll.
- Notifications/SMS/WhatsApp integration.
- Chat or real-time communication.
- Commercial SaaS billing.
- Microservice architecture.
- Production-grade distributed ML infrastructure.

## 9. Primary Demonstration Flow
Admin creates academic structure → creates student/teacher/subject → assigns teacher → teacher records attendance and marks → system calculates indicators → ML predicts risk → factors and recommendations are displayed → analytics summarizes risk distribution → student can view their academic information.

## 10. Acceptance Criteria
The prototype is considered functionally complete when the above demonstration flow works from the browser, data persists in Firestore, authentication and role restrictions work, predictions are generated from the model, analytics renders saved predictions, and the main project can be reproduced from the GitHub repository.
