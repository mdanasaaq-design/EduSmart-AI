# EduSmart AI — Task Tracker

**Last reviewed:** 2026-10-17  
Use `[x]` only for verified work, `[~]` for implemented but not fully verified, and `[ ]` for pending work.

## 1. Foundation
- [x] React + Vite frontend
- [x] Tailwind CSS, Recharts and Lucide React
- [x] Firebase SDK integration
- [x] Firebase Hosting configuration
- [x] Environment-variable template
- [x] Repository documentation and project structure

## 2. Authentication and onboarding
- [x] Email/password sign-in integration
- [x] Role-aware navigation
- [x] Landing source contains Create Admin followed by Sign In
- [x] Callable function source for one-time institution/admin registration
- [x] Callable function source for admin-managed teacher/student provisioning
- [~] Verify Create Admin is visible in the currently deployed website
- [~] Verify callable functions are deployed to the target Firebase project
- [~] Verify first-admin registration and success redirect in browser
- [~] Verify managed teacher/student creation and password setup
- [~] Verify login, logout, password reset and profile consistency in live Firebase

## 3. Institute administration
- [x] Branches
- [x] Programs
- [x] Academic years
- [x] Classes and sections
- [~] Students and enrollments — full browser CRUD verification pending
- [~] Teachers and subjects — full browser CRUD verification pending
- [~] Teacher assignments — full browser verification pending
- [~] User Access & Roles — managed-account lifecycle verification pending

## 4. Academic records
- [~] Attendance entry and persistence
- [~] Assessment marks entry and persistence
- [~] Performance calculations
- [~] Prediction generation and persistence
- [~] Recommendation persistence/display
- [~] Analytics counts and risk distribution
- [~] Complete admin → teacher → student workflow

## 5. Machine learning
- [x] Synthetic training data and Random Forest training script
- [x] Compact model export
- [x] Synthetic holdout evaluation documented in `ml/EVALUATION.md`
- [~] Confirm frontend `/model.json` loads in browser
- [~] Verify inference output against representative inputs
- [ ] Evaluate using approved, privacy-protected real data before any real-world claim

## 6. Security
- [x] Firestore rule source committed
- [x] Emulator tests previously documented for role escalation and student-scoped access
- [~] Re-run emulator tests against current repository head
- [~] Confirm current Firestore rules are deployed to live project
- [~] Browser-test administrator, teacher and student access boundaries

## 7. Deployment and build
- [x] Vite production build completed locally on 2026-10-17
- [x] Firebase Hosting release completed locally on 2026-10-17
- [ ] Confirm local checkout was updated to intended latest `main` before the next release
- [ ] Verify live landing page after deploying the latest source
- [ ] Deploy and verify Cloud Functions
- [ ] Review and deploy Firestore rules
- [~] Resolve local pull conflict in `frontend/src/services/authService.js` without losing changes
- [~] Re-run lint/build after synchronizing source

**Deployment caveat:** the 2026-10-17 local pull was aborted by a modified `frontend/src/services/authService.js`; the following successful build/Hosting release used the existing checkout. Do not mark latest-source deployment complete until source parity and live UI are checked.

## 8. Documentation and submission
- [x] README and architecture documentation
- [x] Product requirements, project rules and UI/UX design
- [x] Canonical project context and deployment guide
- [x] Synthetic model evaluation caveat
- [~] Recheck every document against current code before report/PPT finalization
- [ ] Complete final browser demonstration and capture genuine screenshots
- [ ] Finalize project report and presentation with actual student/guide details
- [ ] Rehearse the complete demo sequence

## 9. Acceptance checklist
- [ ] Fresh clone/setup works
- [ ] Create Admin → admin dashboard works
- [ ] Admin sign-in works after reload
- [ ] Teacher account can complete setup and sign in
- [ ] Student account can complete setup and sign in
- [ ] Academic structure and enrollment persist
- [ ] Assignment is valid and correctly scoped
- [ ] Attendance and marks persist
- [ ] Prediction and recommendation persist
- [ ] Analytics reflects saved data
- [ ] Student sees only their own records
- [ ] Teacher access respects assignments and enrollments
- [ ] Current Hosting, Functions and rules are verified independently
