# EduSmart AI — Project Rules

## 1. Scope Rule
Build only what is required for the academic mini-project prototype. Do not add business/SaaS features unless explicitly requested.

## 2. Technology Rule
Use the approved stack:
- React + Vite
- Tailwind CSS
- Recharts
- Lucide React
- Firebase Auth
- Cloud Firestore
- Firebase Hosting
- Python + Scikit-learn for ML
- GitHub

Do not introduce Kiro, Postman, PostgreSQL, SQLAlchemy, custom JWT authentication, or unnecessary FastAPI infrastructure.

## 3. Git Rule
- Work directly on `main` unless a branch is explicitly requested.
- Fetch the current file SHA before updating an existing GitHub file.
- Keep commits focused and descriptive.
- Never commit `.env.local` or Firebase secrets.
- Pull before local testing when repository changes were made remotely.

## 4. Development Rule
- GPT handles implementation, architecture, debugging, and code decisions.
- Claude is primarily used for the PPT and project report/research synthesis.
- Implement the simplest working solution first.
- Test each major workflow in the browser before adding unnecessary polish.

## 5. Firebase Rule
- Use Firestore as the primary application database.
- Use Firebase Authentication for login.
- Enforce authorization with Firestore Security Rules.
- Do not rely only on hidden UI buttons for security.
- Keep test data clearly identifiable as demo data.

## 6. ML Rule
- Never invent accuracy, precision, recall, F1, or other metrics.
- Clearly identify synthetic-data training/validation.
- Use actual measured metrics if the report includes evaluation results.
- Keep prediction factors interpretable.
- Recommendations must be rule-based unless a separate recommendation model is actually implemented.

## 7. UI Rule
- Keep navigation understandable for a student project evaluator.
- Prefer reusable components over duplicated UI.
- Show loading, empty, success, and error states where practical.
- Keep forms simple and readable.
- Do not optimize for enterprise-scale UX.

## 8. Data Rule
Use consistent document relationships. Enrollment is the source for a student's academic-year/class/section association rather than hardcoding one permanent class.

## 9. Documentation Rule
Project documentation must describe what is actually implemented. Planned features must be labeled as planned; prototype limitations must be stated honestly.

## 10. Completion Rule
A feature is not considered complete merely because its code exists. It must be buildable, runnable, connected to the intended data flow, and browser-tested where applicable.
