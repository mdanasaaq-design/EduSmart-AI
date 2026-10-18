# Firebase Deployment and Verification

This repository hosts the Vite single-page application from `frontend/dist`. Firebase Hosting rewrites client routes to `/index.html`. Hosting, Cloud Functions, Firestore rules and Firestore indexes are separate deployment targets; deploying one does not publish the others.

## Target project

- Firebase project: `edusmart-ai-c4692`
- Hosting URL: [https://edusmart-ai-c4692.web.app](https://edusmart-ai-c4692.web.app)
- Functions region in source: `us-central1`
- Functions runtime in source: Node.js 22

Confirm the intended project before any authorized deployment.

## Binding billing constraint

The project owner does **not** want to upgrade Firebase to Blaze. Do not recommend enabling billing as the default way to finish the project.

The source contains callable Functions for first-admin setup, admin-profile recovery and managed-user provisioning. These workflows must not be described as available unless the required Functions are already deployed and callable. The current plan has previously blocked Functions deployment.

For the immediate no-billing demo, follow [No-Billing Demo Setup](FREE_PLAN_DEMO_SETUP.md):
1. Use the existing manually provisioned administrator account.
2. If teacher/student demo accounts are required, create the Auth accounts and matching Firestore profiles manually in Firebase Console.
3. Ensure profile document IDs match Auth UIDs and role values are correct.
4. Link the teacher/student profile documents to the relevant academic records.
5. Keep Firestore rules restrictive; do not enable public role assignment or self-promotion.
6. Label this procedure as **manual demo provisioning**, not verified automated onboarding.

Do not attach billing, deploy Functions, or change the Firebase plan as part of a documentation or implementation phase unless the owner explicitly changes this constraint.

## Prerequisites for the frontend

- Supported Node.js/npm version for the repository's Vite version.
- Firebase CLI installed and authenticated if deploying.
- Correct Firebase Web App configuration.
- Email/Password Authentication enabled.
- Firestore created and rules reviewed.
- Hosting domains configured as authorized domains where required.

## Frontend environment

Create `frontend/.env.local` locally with the six values copied exactly from the registered Firebase Web App:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Do not commit `.env.local`, service-account JSON or private credentials. Firebase web configuration is client-visible; authorization must be enforced by Firestore rules and trusted server-side code.

## Synchronize and verify before building

From the repository root in PowerShell:

```powershell
git status --short
git log -1 --oneline
```

Inspect any local changes before pulling. Preserve local work; do not use destructive reset/clean commands to resolve conflicts. Synchronize the intended source only after the local diff is understood.

Then:

```powershell
cd frontend
npm ci
npm run lint
npm run build
```

The expanded CI workflow now checks pinned ML artifact regeneration, Python inference/export tests, Firestore Emulator authorization, browser inference vectors, ESLint and production build. Latest full passing run before the vote-share rounding correction: [39116887998](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39116887998); check the latest run after any subsequent source change.

## Hosting deployment (only when explicitly authorized)

After confirming source parity, build output, Firebase target and authorization:

```powershell
cd ..
firebase use edusmart-ai-c4692
firebase deploy --only hosting --project edusmart-ai-c4692
```

A Hosting success message does not prove that the latest intended source was built unless the commit was checked first. It also does not publish Functions, Firestore rules or indexes.

## Firestore rules and indexes

The repository defines:
- Rules: `firebase/firestore.rules`
- Indexes: `firebase/firestore.indexes.json`

Review the exact diff and test it in the emulator before any live publication. If a rules/index deployment is separately approved, target only the intended project and record the outcome. Do not weaken rules to make a UI workflow pass.

## Cloud Functions

The source lives under `functions/` and is configured for Node.js 22. The callables are part of the intended automated onboarding and account-management design. Under the current no-Blaze constraint, treat their deployment as **blocked/not assumed available**. Do not attempt to deploy them or enable billing as part of the default roadmap.

If the owner changes the constraint in the future, revisit Functions deployment prerequisites and IAM/billing requirements as a separate explicit decision.

## GitHub Actions

The frontend CI workflow now runs Python ML artifact regeneration and contract tests, Firestore Emulator authorization tests, browser inference tests, ESLint and production build. The original test/policy mismatch was resolved without weakening rules.

The manual Hosting workflow requires repository secrets and a deployment identity. Do not add, print or commit credentials during this documentation task. Historical deployment workflow failures do not prove current deployment status.

## Post-deployment acceptance

- [ ] Source commit and built revision are recorded.
- [ ] Correct Firebase project is selected.
- [ ] Landing page loads at the intended Hosting URL.
- [ ] Create Admin and Sign In navigation appear and behave as intended.
- [ ] Current Firebase Web App configuration is correct.
- [ ] Admin sign-in works and `users/{uid}` matches the authenticated UID.
- [ ] Teacher/student demo profiles are linked to the correct Auth UIDs.
- [ ] Academic structure, enrollment and teacher assignment are valid.
- [ ] Attendance/marks persist.
- [ ] Prediction and recommendation persist with correct class-label mapping and the current 40-tree artifact.
- [ ] Analytics reflects saved data.
- [ ] Student and teacher access boundaries are verified.
- [ ] Rules and indexes deployment state is recorded separately.
- [ ] Functions-based onboarding is marked blocked unless it was actually deployed and tested.

## Troubleshooting discipline

- Capture the exact error and identify the failing step.
- Check the signed-in UID and `users/{uid}` profile.
- Check linked student/teacher profile and enrollment IDs.
- Check the selected Firebase project and Web App config.
- Check Hosting, Functions, rules and indexes separately.
- Do not delete collections to troubleshoot account conflicts; deleting Firestore profiles does not delete Auth users.
- If a workflow cannot be verified under the current plan, state that limitation and demonstrate only the tested path.
