# Firebase Hosting Deployment

This repository is configured to host the Vite single-page app from `frontend/dist`. Firebase Hosting rewrites all paths to `/index.html`, so the client-side app continues to load on direct navigation and refresh.

## One-time Firebase setup

1. Create or select a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. In **Project settings → General → Your apps**, register a Web app and copy its Firebase configuration values.
3. Enable **Authentication** providers used by the app in **Authentication → Sign-in method**.
4. In **Firestore Database**, create the database and publish the repository's `firebase/firestore.rules` rules after reviewing them for your use case. The CI workflow currently tests these rules but does not publish them.
5. In **Authentication → Settings → Authorized domains**, add the Firebase Hosting domain after the first deployment (for example, `<project-id>.web.app` and `<project-id>.firebaseapp.com`, as applicable).

## Configure GitHub Actions

In GitHub, open **Settings → Secrets and variables → Actions → New repository secret** and add these secrets:

| Secret name | Value |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Web app API key from Firebase project settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Usually `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Exact Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket shown in Firebase config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID from Firebase config |
| `VITE_FIREBASE_APP_ID` | Web app ID from Firebase config |
| `FIREBASE_SERVICE_ACCOUNT_EDUSMART_AI` | Full JSON content of a service-account key for the target project |

Create the service account in **Google Cloud Console → IAM & Admin → Service Accounts** for the same project. Grant only the permissions needed to deploy Firebase Hosting (typically Firebase Hosting Admin, plus any required service-account usage permission). Create a JSON key and paste the entire JSON into the GitHub secret. Never commit the JSON key, paste it into chat, or expose it in client-side variables. If your organization prohibits service-account keys, replace this workflow's authentication with your approved keyless Workload Identity Federation setup.

The `VITE_FIREBASE_*` values are included in the browser bundle at build time. They are Firebase client configuration, not authorization secrets; protect user data with Firestore Security Rules and Authentication, not by hiding the web API key.

## Deploy

1. Confirm all seven repository secrets above are set.
2. Open **Actions → Deploy Firebase Hosting → Run workflow** on the `main` branch.
3. Wait for **Build and deploy production site** to finish. The Firebase action output includes the live hosting URL.
4. Open the URL and verify the landing page, login, direct-route refresh behavior, and Firebase sign-in.

The workflow is manual by design so a commit cannot accidentally publish before credentials and project settings are configured. After the first successful deployment, you can change its trigger to deploy on pushes to `main` if desired.

## Local build

From `frontend/`, create `.env.local` with the six `VITE_FIREBASE_*` values and run:

```bash
npm ci
npm run build
```
