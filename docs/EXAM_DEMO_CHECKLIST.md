# EduSmart AI — Exam Demonstration Checklist

Use this checklist before presenting the project. A page rendering is not enough; verify the important data flow.

## 1. Get the latest code

1. Open the project folder in VS Code.
2. Open Terminal → New Terminal.
3. Run:

```bash
git pull origin main
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).
5. Do not overwrite `.env.local` if it already contains the Firebase web configuration. Never commit this file.

## 2. Before the demonstration

- Confirm Firebase Authentication has Email/Password enabled.
- Confirm Firestore Rules in `firebase/firestore.rules` are published to the intended Firebase project.
- Confirm an administrator account has been provisioned through a trusted Firebase Console/Admin SDK workflow. Public registration creates student accounts only.
- Use synthetic/demo student data for the demonstration.
- Confirm the live Hosting URL reflects the latest code. The latest GitHub commit is not automatically deployed by the manual Hosting workflow.

## 3. Admin workflow

- [ ] Sign in as administrator.
- [ ] Create a branch.
- [ ] Create a program linked to the branch.
- [ ] Create an active academic year.
- [ ] Create a class and section.
- [ ] Create a student and enrollment.
- [ ] Create a teacher and subject.
- [ ] Add the teacher's Firebase Authentication UID to the teacher profile.
- [ ] Create the teacher–subject–class assignment.
- [ ] Record attendance and marks for the enrolled student.
- [ ] Generate and save a risk prediction and recommendation.
- [ ] Open Analytics and show the saved prediction count/risk distribution.

## 4. Student workflow

- [ ] Register a student account or use an existing linked account.
- [ ] Copy the Firebase Authentication UID from Firebase Console → Authentication.
- [ ] Link that UID to the matching student profile in the admin screen.
- [ ] Sign in as that student and verify only that student's linked records appear.

## 5. Be accurate when explaining the AI

- The Random Forest uses four features: attendance, average marks, recent trend, and missed assessments.
- Output classes are Low, Medium, and High.
- The training data is synthetic and labels are formula-generated.
- The measured 86.25% holdout accuracy describes agreement with those synthetic labels only; it is not real-world student prediction accuracy.
- The UI's tree-vote share is not a calibrated probability.
- Recommendations are rule-based.
- Risk outputs support human review and must not be treated as definitive judgments.

## 6. If a step fails

- Read the exact error message and note which step failed.
- Check that the signed-in account has the expected role in `users/{uid}`.
- Check that the student profile's `userId` equals the student's Auth UID.
- Check that the teacher profile's `userId` equals the teacher's Auth UID.
- Recreate legacy/random-ID enrollment and assignment records through the current admin UI if they do not match deterministic IDs.
- Do not weaken Firestore Rules to make a failed step appear to work.
- If live rules or deployment cannot be verified, present the tested local build and clearly state that live deployment verification is pending.
