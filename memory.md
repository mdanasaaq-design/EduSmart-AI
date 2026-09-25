# EduSmart AI — Project Memory

## Project Identity
- Project name: EduSmart AI
- Type: College mini-project / working prototype
- Repository: mdanasaaq-design/EduSmart-AI
- Default branch: main
- Primary development environment: VS Code

## Purpose
Build a practical educational institute management prototype with an academic-risk prediction feature.

## Approved Stack
React, Vite, Tailwind CSS, Recharts, Lucide React, Firebase Authentication, Cloud Firestore, Firebase Hosting, Python, Pandas, NumPy, Scikit-learn, Git, GitHub.

## Explicitly Not Used
Kiro, Postman, PostgreSQL, SQLAlchemy, custom JWT, unnecessary FastAPI/backend infrastructure.

## Working Method
GPT is the main implementation/development assistant for architecture, coding, debugging, and integration. Claude is primarily used for the presentation and project report, including research-paper synthesis.

## Current Data Model
users
institutions
branches
programs
academicYears
classes
sections
students
teachers
subjects
enrollments
teacherAssignments
attendance
assessments
marks
predictions
recommendations

## Current Role Model
- admin
- teacher
- student

## Current ML Model
Random Forest classifier with:
- attendance
- averageMarks
- recentTrend
- missedAssessments

The demonstration model is trained using synthetic data and exported for frontend inference. It must not be presented as a validated real-world academic-risk model.

## Current Prototype Flow
Admin setup → academic structure → people/subjects → teacher assignment → attendance/marks → feature calculation → prediction → factors/recommendations → analytics → student view.

## Important Constraints
- Keep the project at mini-project scope.
- Prefer simple working code.
- Do not add features just because they are technically possible.
- Do not fabricate data or metrics.
- Keep documentation synchronized with implementation.
- Test workflows in the browser.

## Known Verification Areas
- Students & Enrollments needs browser verification.
- Teachers & Subjects needs browser verification.
- Teacher Assignments needs browser verification.
- Academic Records needs browser verification.
- frontend/public/model.json must contain a valid exported model.
- Firestore rules must support legitimate student reads without allowing unauthorized writes.
- Student identity linkage must be consistent between authentication, student documents, and academic records.

## Completion Definition
The project is finished when the complete core workflow works locally, security rules are verified, the production build succeeds, and documentation reflects the actual implementation and limitations.
