# EduSmart AI Frontend

React + Vite single-page application for the EduSmart AI educational institute management prototype.

## Responsibilities

- Landing page with **Create Admin** and **Sign In**.
- Shared email/password sign-in and role-aware navigation.
- Admin, teacher, and student workspaces.
- Institute structure, people, enrollment, assignment, attendance, and marks workflows.
- Browser-side inference using the exported model at `public/model.json`.
- Firebase-backed persistence and role-aware data access.

## Local development

From this directory:

```bash
npm ci
```

Create `.env.local` with these Firebase Web App settings:

```dotenv
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_web_app_id
```

Use the exact values from Firebase Console → Project settings → General → Your apps. These client settings are compiled into the frontend; never put service-account credentials or private keys here. Do not commit `.env.local`.

Run the development server:

```bash
npm run dev
```

Validate before deploying:

```bash
npm run lint
npm run build
```

## Authentication dependencies

Create Admin and managed-user provisioning rely on callable Firebase Cloud Functions. Hosting the frontend alone does not deploy those functions. The Firebase project, function region, Authentication provider, Firestore rules and frontend environment values must agree.

See [Firebase deployment guide](../docs/FIREBASE_DEPLOYMENT.md) and [project context](../docs/PROJECT_CONTEXT.md).

## Prototype limitation

The risk model is trained on synthetic data and is for demonstration only. Its output must not be treated as a validated real-world academic decision.
