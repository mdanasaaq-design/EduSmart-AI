# EduSmart AI — System Architecture

## 1. Architecture overview

EduSmart AI is a React single-page application backed by Firebase. The browser handles interface rendering and model inference; Firebase provides identity, persistent records, trusted account-provisioning functions, and hosting.

```text
Browser
  └── React + Vite application
      ├── Firebase Authentication (identity)
      ├── Cloud Firestore (profiles and academic records)
      ├── Callable Cloud Functions (trusted account provisioning)
      └── Browser-side Random Forest inference (exported model.json)

Python training workflow
  └── synthetic data → preprocessing/training → compact model export
      └── frontend/public/model.json
```

## 2. Technology stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React
- **Identity and data:** Firebase Authentication, Cloud Firestore
- **Trusted backend operations:** Firebase Cloud Functions using the Admin SDK
- **Hosting:** Firebase Hosting with SPA fallback to `index.html`
- **ML training:** Python, Pandas, NumPy, Scikit-learn
- **Development:** VS Code, Git, GitHub

## 3. Authentication and role provisioning

### First administrator

The public landing page provides **Create Admin** and **Sign In**. Create Admin is a one-time setup flow that submits institution and administrator details to the callable `registerInstitutionAdmin` function. The function validates the request, creates the Firebase Authentication account, assigns trusted custom claims, and writes the initial administrator and institution profiles. The frontend then signs in the administrator.

This flow requires the deployed function, correct Firebase client configuration, and consistent project IDs. Existing Authentication accounts are independent of Firestore documents: deleting a `users/{uid}` document does not delete the Auth account.

### Managed users

The administrator provisions teacher and student accounts through the managed-user flow. The callable `createManagedUser` verifies the caller's administrator profile, restricts assignable roles to teacher/student, creates the account/profile, and returns the password setup link. If the Firestore admin profile is missing but the original Authentication account retains the server-issued `role=admin` and `institutionId=primary` claims, `restoreAdminProfile` can recreate only that same UID's profile. The shared sign-in page then routes users based on the role stored in the trusted Firestore profile.

### Authorization

- Firebase Authentication establishes identity.
- `users/{uid}` stores the application profile and role.
- `teacherClassAccess/{teacherUid}__{classId}` is a denormalized scope record used by Firestore rules to allow teachers to read only student/enrollment records for assigned classes.
- Custom claims are set by trusted server-side code; they are not user-editable.
- Firestore Security Rules protect data operations.
- Client-side role checks are navigation controls only, not the security boundary.

## 4. Repository structure

```text
EduSmart-AI/
├── frontend/             # React/Vite app and browser model
├── functions/             # Trusted Firebase callable functions
├── ml/                    # Training and evaluation
├── docs/                  # Setup, project context and status
├── firebase/              # Firestore Security Rules
├── tests/                 # Rule and workflow tests
├── README.md
├── architecture.md
├── design.md
├── prd.md
├── rules.md
├── tasks.md
└── memory.md
```

## 5. Main Firestore collections

- `users`, `institutions`
- `branches`, `programs`, `academicYears`, `classes`, `sections`
- `students`, `teachers`, `subjects`, `enrollments`, `teacherAssignments`
- `attendance`, `assessments`, `marks`, `predictions`, `recommendations`

Academic relationship: Student → Enrollment → Academic Year / Class / Section. Saving an enrollment also stores the student's current class/section/year IDs for teacher-scoped student queries. Student-linked academic records carry identity and scope fields used by rules to restrict access. Composite indexes for marks and attendance queries are defined in `firebase/firestore.indexes.json`.

## 6. Academic-record and ML flow

1. An authorized user records attendance and assessment marks.
2. The application derives attendance percentage, average marks, recent trend, and missed-assessment count.
3. The exported Random Forest model predicts Low, Medium, or High risk in the browser.
4. The application persists the prediction and a separate rule-based recommendation.
5. Analytics summarizes saved records.

The model was trained on synthetic/demo data. Tree-vote fraction shown as confidence is not a calibrated probability; output is advisory and must not be used as the sole basis for consequential decisions.

## 7. Deployment boundaries

- Hosting deploys the built frontend from `frontend/dist`.
- Cloud Functions are deployed separately from Hosting.
- Firestore rules are deployed separately and must be reviewed before publication.
- GitHub Actions checks do not by themselves prove that live Hosting, Functions, or rules match the repository.

## 8. Architectural principles

- Keep the implementation appropriate to an academic prototype.
- Prefer Firebase-native services over unnecessary infrastructure.
- Never expose credentials or commit `frontend/.env.local`.
- Treat Firestore rules as mandatory authorization controls.
- Distinguish implemented, tested, and planned features in documentation.
