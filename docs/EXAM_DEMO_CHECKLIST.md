# EduSmart AI — Exam Demonstration Checklist

Use this checklist before presenting. A page rendering alone is not proof that a workflow works; verify the important data flow and record any limitation honestly.

## 1. Synchronize and build safely

From the repository root:

```powershell
git status --short
git log -1 --oneline
git pull --ff-only origin main
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

If Git refuses to pull because of local modifications, stop and inspect the diff. Preserve local work before synchronizing; do not use destructive reset/clean commands. Open the local URL printed by Vite (usually `http://localhost:5173`). Do not overwrite a working `.env.local`; never commit it.

## 2. Firebase prerequisites

- [ ] Confirm the selected Firebase project is the intended project (`edusmart-ai-c4692` for the current demo).
- [ ] Confirm Email/Password Authentication is enabled.
- [ ] Confirm frontend Firebase settings match the registered Web App.
- [ ] Confirm Cloud Functions used by account provisioning are deployed.
- [ ] Review and confirm the current Firestore rules are deployed.
- [ ] Use synthetic/demo academic records.
- [ ] For the live demo, confirm Hosting reflects the intended source commit; GitHub changes are not automatically live unless deployment ran successfully.

Hosting, Functions and Firestore rules are separate deploy targets. A Hosting success message does not verify Functions or rules.

## 3. Landing page and account setup

- [ ] Open the landing page in a fresh/incognito session.
- [ ] Confirm the top-right buttons appear in this order: **Create Admin**, then **Sign In**.
- [ ] Use Create Admin for one-time institution setup only.
- [ ] Enter institution details and the first administrator's credentials.
- [ ] Confirm registration succeeds, the admin is authenticated, a matching `users/{uid}` profile exists, and the app opens the admin workspace.
- [ ] Confirm Sign In works for the administrator after refresh.

Do not repeatedly submit setup if an Auth account already exists. Deleting Firestore collections does not delete Firebase Authentication users; inspect both systems separately.

## 4. Admin academic workflow

- [ ] Create a branch.
- [ ] Create a program linked to the branch.
- [ ] Create an active academic year.
- [ ] Create a class and section.
- [ ] Create a student and enrollment.
- [ ] Create a teacher and subject.
- [ ] Link the teacher profile to that teacher's Firebase Authentication UID.
- [ ] Create the teacher–subject–class assignment.
- [ ] Record attendance and marks for the enrolled student.
- [ ] Generate and save a risk prediction and recommendation.
- [ ] Open Analytics and verify the saved prediction count/risk distribution.

## 5. Managed teacher/student accounts

- [ ] From User Access & Roles, create a teacher account.
- [ ] Create a student account.
- [ ] Confirm the managed account's password setup flow is usable.
- [ ] Sign in with each role through the shared Sign In page.
- [ ] Confirm each account receives the correct workspace.
- [ ] Confirm a normal user cannot self-assign admin/teacher role.

## 6. Student-scoped workflow

- [ ] Link the student's Firebase Auth UID to the matching student profile.
- [ ] Sign in as that student.
- [ ] Verify only that student's linked records, prediction and recommendation are shown.
- [ ] Attempt an unauthorized read/write only in the approved test environment and confirm rules deny it.

## 7. Explain the model accurately

- Inputs: attendance, average marks, recent trend, missed assessments.
- Output classes: Low, Medium, High.
- Training labels and dataset are synthetic/formula-generated.
- The documented 86.25% holdout accuracy describes agreement with synthetic labels; it is not real-world student prediction accuracy.
- Tree-vote share is not a calibrated probability.
- Recommendations are rule-based.
- Risk outputs are advisory and must not be treated as definitive judgments.

## 8. Troubleshooting discipline

- Capture the exact error and identify which step failed.
- Check the signed-in UID and matching `users/{uid}` role profile.
- Check the student/teacher profile's `userId` linkage.
- Check that the correct Firebase project is selected.
- Check Functions deployment separately from Hosting.
- Do not weaken Firestore Rules or delete data just to make a demonstration appear successful.
- If a live workflow cannot be verified, state that limitation and demonstrate only the tested path.
