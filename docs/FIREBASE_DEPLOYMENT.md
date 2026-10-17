# Firebase Deployment and Verification

This repository hosts the Vite single-page application from `frontend/dist`. Firebase Hosting rewrites client routes to `/index.html`. Hosting, Cloud Functions, and Firestore rules are separate deployment targets; deploying one does not publish the others.

## Target project

The current demonstration project is `edusmart-ai-c4692`, with Hosting URL [https://edusmart-ai-c4692.web.app](https://edusmart-ai-c4692.web.app). Confirm this is the intended project before deploying.

## Prerequisites

- Node.js/npm supported by the repository's Vite version
- Firebase CLI installed and authenticated
- Access to the Firebase project
- Correct frontend Firebase Web App configuration
- Billing/plan and IAM permissions required by the configured Cloud Functions

## One-time Firebase setup

1. In Firebase Console, select the target project and register a Web App.
2. Enable Email/Password under Authentication → Sign-in method.
3. Create Firestore and review `firebase/firestore.rules` before publishing.
4. Add the Hosting domains to Authentication → Settings → Authorized domains if required.
5. Ensure the Cloud Functions required by the account workflow are deployed to the expected region (`us-central1`).

## Frontend environment

Create `frontend/.env.local` locally with the six values below, copied exactly from the registered Firebase Web App:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Do not commit `.env.local`, service-account JSON, or private credentials. Firebase web configuration is client-visible; authorization must be enforced by Firestore rules and trusted server-side code.

## Local build and Hosting deployment

From the repository root in PowerShell:

```powershell
cd frontend
npm ci
npm run lint
npm run build
cd ..
firebase use edusmart-ai-c4692
firebase deploy --only hosting --project edusmart-ai-c4692
```

**Important:** Build only after the intended source commit is present locally. A successful build/deploy of an older local checkout does not publish newer GitHub changes. Verify `git log -1 --oneline` and confirm the expected source (including the landing-page actions) before building.

## Deploy functions and rules when required

Review the code and rules first, then deploy explicitly:

```powershell
firebase deploy --only functions --project edusmart-ai-c4692
firebase deploy --only firestore:rules --project edusmart-ai-c4692
```

Functions deployment can require additional project billing and IAM configuration. Do not assume it succeeded merely because Hosting deployment succeeded. If the deployment fails, retain the complete error output for diagnosis.

## GitHub Actions

If using the repository workflow, configure the required frontend `VITE_FIREBASE_*` secrets and the deployment identity secret described in the workflow. Grant the service account only the permissions required for deployment. Never commit or share its JSON key. A successful workflow verifies only the steps that ran; inspect its log to confirm which targets were deployed.

## Post-deployment acceptance checklist

- [ ] Landing page loads at the intended Hosting URL.
- [ ] Top-right actions appear in order: **Create Admin**, **Sign In**.
- [ ] Hard refresh/incognito still shows the updated page.
- [ ] Create Admin form submits and the callable returns success for first-time setup.
- [ ] Administrator is authenticated and a matching `users/{uid}` profile exists.
- [ ] Sign In works for the administrator.
- [ ] Admin can provision teacher and student accounts.
- [ ] Managed accounts can complete password setup and sign in.
- [ ] Role-based data access matches Firestore rules.
- [ ] Core academic workflow is tested end-to-end.

Deleting a Firestore user profile does not delete its Firebase Authentication account. Avoid clearing collections to troubleshoot account conflicts; inspect Authentication and Firestore state separately.
