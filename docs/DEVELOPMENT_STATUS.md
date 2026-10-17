# EduSmart AI — Development Status

**Status updated:** 2026-10-17  
**Repository:** `mdanasaaq-design/EduSmart-AI`, branch `main`  
**Firebase project:** `edusmart-ai-c4692`

## Overall status

The project is in **integration and live acceptance verification**, not final sign-off. The latest documented CI results and the local Hosting deployment are distinct from browser verification. Do not describe the full system as complete until the required acceptance flow has been exercised.

## Implemented areas

- React + Vite frontend and role-aware navigation
- Firebase email/password authentication
- Institution/admin setup callable in `functions/index.js`
- Managed teacher/student provisioning callable
- Branches, programs, academic years, classes and sections
- Student/enrollment management
- Teacher, subject and assignment screens
- Attendance and marks workflow
- Browser-side Random Forest inference
- Prediction persistence and rule-based recommendations
- Analytics and role workspaces
- Firestore rules and emulator tests
- Firebase Hosting configuration and deployment workflow

Implementation status means source exists; it does not imply every path has passed browser acceptance.

## Account workflow: required behavior

1. Landing page top-right actions: **Create Admin**, then **Sign In**.
2. Create Admin invokes `registerInstitutionAdmin` for one-time institution setup.
3. The first administrator signs in and enters the admin workspace.
4. Admin provisions teacher/student accounts through the managed-user callable.
5. All roles use shared Sign In and receive access based on their Firestore profile.
6. Public clients must not self-assign admin or teacher roles.

The frontend in GitHub `main` contains both landing-page actions. However, on 2026-10-17 the local `git pull --ff-only origin main` was aborted because `frontend/src/services/authService.js` had a local modification. A subsequent local build and Firebase Hosting deployment succeeded from that checkout. **This does not verify that the latest GitHub frontend was deployed or that the live button is visible.** Resolve the Git synchronization issue without discarding the local change, pull, rebuild, and redeploy before asserting source parity.

## Deployment status

- [x] Local Vite production build completed on 2026-10-17.
- [x] Firebase Hosting release completed on 2026-10-17 for the local build.
- [ ] Confirm the local checkout matches the intended latest `main` commit.
- [ ] Confirm live landing page shows Create Admin then Sign In in a fresh/incognito session.
- [ ] Confirm the `registerInstitutionAdmin` callable is deployed and callable from the web app.
- [ ] Confirm the managed-user callable is deployed and works.
- [ ] Confirm Firestore rules deployed to the live project match the reviewed repository rules.
- [ ] Run complete role-based browser acceptance.

Hosting deploy does not deploy Cloud Functions or Firestore rules.

## ML status

- Synthetic dataset and Random Forest training/export workflow exist.
- Frontend loads the compact model from `/model.json`.
- Features: attendance, average marks, recent trend, missed assessments.
- Evaluation is recorded in `ml/EVALUATION.md`: 86.25% accuracy on formula-generated synthetic labels. This is not real-world academic-risk accuracy or evidence of fairness/calibration.
- Recommendations are rule-based.

## Automated verification previously recorded

The repository previously documented 18 passing Firestore Emulator authorization tests and passing lint/build on CI for earlier commits. Those results do not prove the current live Firebase project is correctly deployed. Re-run/inspect CI for the current head before reporting current test status.

## High-priority acceptance checklist

### A. Deployment and onboarding
- [ ] Resolve local Git pull conflict while preserving `authService.js`.
- [ ] Pull intended `main` source and verify Create Admin in `frontend/src/App.jsx`.
- [ ] Run `npm ci`, `npm run lint`, `npm run build`.
- [ ] Deploy Hosting from the updated build.
- [ ] Deploy Cloud Functions and Firestore rules after reviewing changes and permissions.
- [ ] Verify Create Admin form, one-time setup guard, success redirect, and useful error messages.
- [ ] Verify Sign In for the administrator.

### B. Managed roles
- [ ] Admin can create a teacher account.
- [ ] Admin can create a student account.
- [ ] Password setup and first sign-in work.
- [ ] Role cannot be self-assigned or escalated.
- [ ] Missing/mismatched Firestore profile errors are understandable.

### C. Academic flow
- [ ] Create branch, program, academic year, class and section.
- [ ] Create student and enrollment.
- [ ] Create teacher and subject.
- [ ] Link teacher to Firebase Auth UID and create assignment.
- [ ] Record attendance and marks.
- [ ] Generate and save prediction and recommendation.
- [ ] Verify analytics reads persisted predictions.
- [ ] Verify linked student sees only their own records.
- [ ] Verify teacher access is restricted by assignments and active enrollment.

### D. Quality
- [ ] Test loading, empty, validation and permission-error states.
- [ ] Test responsive layout and direct-route refresh.
- [ ] Confirm Firestore rules are deployed and test unauthorized access.
- [ ] Confirm fresh clone/setup instructions work.

## Important data note

Deleting Firestore collections does not delete Firebase Authentication users. Check both systems separately; do not repeatedly delete data as a generic troubleshooting measure.
