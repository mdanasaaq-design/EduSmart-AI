# EduSmart AI — Exam Demonstration Checklist

Use this checklist before presenting. A page rendering alone is not proof that a workflow works; verify data flow and record any limitation honestly. This checklist assumes the user's current Firebase no-Blaze constraint and must not require a billing upgrade.

## 1. Repository and build readiness

- [ ] Inspect local `git status --short` and `git log -1 --oneline`.
- [ ] Inspect local changes before syncing; preserve work in `frontend/src/services/authService.js` or any other modified file.
- [ ] Synchronize to the intended source without destructive reset/clean commands.
- [ ] Confirm the current Firestore authorization tests pass.
- [ ] Confirm ESLint passes.
- [ ] Confirm the production build passes.
- [ ] Record the exact commit tested.

**Current status:** Full CI run [39116887998](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39116887998) passed 18 Firestore tests, 4 Python ML tests, 3 browser inference tests, ESLint and production build. Both shipped model files now contain 40 trees and are reproducible from the pinned training script. Manual Firebase Console setup and live role workflows still need verification.

## 2. Firebase prerequisites — no-billing path

- [ ] Confirm the selected project is `edusmart-ai-c4692`.
- [ ] Confirm Email/Password Authentication is enabled.
- [ ] Confirm frontend Firebase settings match the registered Web App; do not expose config secrets in reports or logs.
- [ ] Use the existing manually provisioned admin account and verify its Auth UID matches `users/{uid}`.
- [ ] If needed, manually create demo teacher/student Auth accounts in Firebase Console.
- [ ] Create matching Firestore user profiles and link the records to the correct Auth UIDs.
- [ ] Prepare synthetic/demo academic records only.
- [ ] Do not assume `registerInstitutionAdmin`, `restoreAdminProfile` or `createManagedUser` are deployed; current Spark/no-Blaze constraint blocks assuming callable Functions are available.
- [ ] Do not upgrade billing, weaken rules or allow public role self-assignment just to make the demo work.

Manual Console account provisioning is a demo workaround, not proof that automated account provisioning works.

## 3. Landing page and sign-in

- [ ] Open the landing page in a fresh/incognito session.
- [ ] Confirm top-right actions appear in this order: **Create Admin**, then **Sign In**.
- [ ] Confirm Sign In opens the shared authentication form.
- [ ] Sign in as the existing administrator.
- [ ] Confirm the signed-in UID matches the Firestore profile ID and the role is `admin`.
- [ ] Refresh and verify the admin workspace remains usable.
- [ ] Confirm errors are clear if an automated setup callable is unavailable; do not claim setup succeeded without a matching profile.

## 4. Admin academic workflow

- [ ] Create a branch.
- [ ] Create a program linked to the branch.
- [ ] Create an active academic year.
- [ ] Create a class and section.
- [ ] Create a student and enrollment.
- [ ] Create a teacher and subject.
- [ ] Link the teacher profile to that teacher's Firebase Authentication UID.
- [ ] Create the teacher–subject–class assignment and any required class-access record.
- [ ] Confirm the enrollment is active and references the intended student, class and academic year.

## 5. Attendance, marks, prediction and analytics

- [ ] Record attendance for the enrolled student.
- [ ] Record assessment marks.
- [ ] Reload the page and verify records persisted.
- [ ] Verify the risk label against deterministic test vectors and confirm the browser interprets exported leaf indices correctly.
- [ ] Confirm the model artifact served by the frontend matches the documented training/evaluation configuration.
- [ ] Generate and save a prediction and rule-based recommendation.
- [ ] Open Analytics and verify the saved prediction count/risk distribution.
- [ ] Explain that training data/labels are synthetic and tree-vote share is not a calibrated probability.

**For accurate reporting, distinguish the 86.25% scikit-learn baseline from the 87.08% browser majority-vote result. Both are measured against synthetic, formula-generated labels and are not real-world validation.**

## 6. Teacher and student workflows

- [ ] Sign in as the manually provisioned teacher.
- [ ] Verify the teacher sees only assigned classes/students.
- [ ] Verify the teacher can record allowed attendance/marks and save records for an actively enrolled student.
- [ ] Verify out-of-assignment and withdrawn-enrollment operations are denied.
- [ ] Sign in as the linked student.
- [ ] Verify only that student's profile, attendance, marks, prediction and recommendations are shown.
- [ ] Verify student writes to academic records and role escalation are denied.

## 7. Security and deployment checks

- [ ] Run emulator authorization tests against current rules.
- [ ] Verify the rules match the approved administrator-managed account policy.
- [ ] Confirm no public client can assign itself admin/teacher role.
- [ ] Verify current Hosting/source parity; a historical Hosting success does not prove current source is live.
- [ ] Record Hosting, Firestore rules, indexes and Functions as separate statuses.
- [ ] Do not attempt Functions deployment under the current no-Blaze constraint.
- [ ] Do not delete Auth users or Firestore collections as generic troubleshooting.

## 8. Report and PPT readiness

- [ ] Use genuine screenshots from the tested build/live site.
- [ ] Describe only features that are implemented and verified; label blocked/unverified features.
- [ ] Include architecture, module flow, security boundaries, test outcomes, ML limitations and future work.
- [ ] Verify every research citation against a publisher record.
- [ ] Do not invent test results, screenshots, references or performance claims.
- [ ] Ensure report, PPT, README and website tell the same factual story.
- [ ] Rehearse the end-to-end flow and a truthful fallback if a live service is unavailable.

## 9. Troubleshooting discipline

1. Capture the exact error and identify which step failed.
2. Check the signed-in UID and matching `users/{uid}` profile.
3. Check linked student/teacher profile, enrollment and assignment IDs.
4. Confirm the selected Firebase project and registered Web App config.
5. Check CI, Hosting, Functions, rules and indexes separately.
6. Do not weaken rules or delete data to make a demonstration appear successful.
7. If a workflow cannot be verified under the current plan, state that limitation and demonstrate only the tested path.
