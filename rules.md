# EduSmart AI — Project Rules

## 1. Scope
Build only what is needed for the academic mini-project prototype. Do not add commercial SaaS features or unrelated infrastructure without explicit approval.

## 2. Approved technology
- React + Vite
- Tailwind CSS, Recharts, Lucide React
- Firebase Authentication, Cloud Firestore, Firebase Hosting
- Firebase Cloud Functions for trusted account provisioning
- Python, Pandas, NumPy, Scikit-learn for model training
- Git and GitHub

Do not introduce Kiro, Postman, PostgreSQL, SQLAlchemy, custom JWT, unnecessary FastAPI, or microservices.

## 3. Git and editing
- Work directly on `main` unless asked to use a branch.
- Fetch the latest file SHA before updating an existing GitHub file.
- Keep commits focused and descriptive.
- Preserve local changes; do not recommend destructive resets to solve ordinary merge conflicts.
- Never commit `.env.local`, service-account JSON, or credentials.
- Pull the intended remote source before building and deploying.

## 4. Account and role security
- Landing page order: **Create Admin**, then **Sign In**.
- First-admin creation must be enforced by trusted server-side code; never trust a client-supplied role.
- Admin provisions teacher/student accounts through trusted logic.
- Shared sign-in uses the Firestore user profile to select the workspace.
- Do not allow public self-promotion to admin or teacher.
- Firestore rules—not hidden UI controls—must enforce data access.
- Deleting Firestore records does not delete Firebase Authentication accounts. Inspect both before troubleshooting.

## 5. Firebase
- Use Firestore as the primary application database.
- Confirm project ID, web configuration, function region, Authentication provider and deployed rules agree.
- Hosting, Cloud Functions and Firestore rules are separate deployment targets.
- Review rules and deployment logs; never claim deployment based on a successful frontend build alone.

## 6. ML
- Never invent accuracy, precision, recall, F1 or other metrics.
- Clearly identify synthetic training and evaluation data.
- Treat model output as advisory.
- Do not describe rule-based recommendations as output from a separate AI model.
- Interpret input features as indicators, not proven causes.

## 7. UI and data
- Prefer clear navigation, readable forms and reusable components.
- Provide loading, empty, success, validation and error feedback where practical.
- Use enrollment as the source of a student's academic-year/class/section association.
- Scope student access to linked records and teacher access to valid assignments/enrollments.

## 8. Documentation
- Describe current implementation, not intended behavior alone.
- Mark pending browser/deployment verification explicitly.
- Do not fabricate test results, screenshots, paper references, or project metrics.
- Keep README, architecture, PRD, status, task tracker and memory consistent.

## 9. Completion
A feature is complete only when it builds, runs, persists the expected data, enforces permissions and passes its relevant browser acceptance test.
