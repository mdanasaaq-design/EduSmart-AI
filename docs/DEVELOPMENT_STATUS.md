# EduSmart AI — Development Status

**Last documented state:** 2026-10-16 (CI verification on commit `6ac5a22`)

## Overall status
The prototype is in the **integration verification** phase. The latest GitHub Actions run on `main` passed Firestore Emulator authorization tests (18/18), ESLint, and the Vite production build. The app still needs a live browser acceptance pass and confirmation that the current Firestore rules are published to the Firebase project.

The earlier internal estimate of roughly **75–80% implementation** is a development estimate only, not an academic project result.

## Completed foundation
- React + Vite frontend
- Tailwind CSS
- Recharts
- Lucide React
- Firebase SDK
- Firebase Authentication
- Cloud Firestore
- GitHub repository/version control
- environment variable template
- core documentation set

## Implemented modules
- Login/logout and role-aware navigation
- Branches
- Programs
- Academic Years
- Classes & Sections
- Students & Enrollments
- Teachers
- Subjects
- Teacher Assignments
- Attendance & Marks
- Random Forest browser inference
- Prediction persistence
- Rule-based recommendations
- Analytics
- Teacher/Student role workspace

## Recent integration fixes
### Student identity linkage
Student profiles now support a `userId` field containing the Firebase Auth UID.

Attendance, marks, predictions and recommendations created through the academic-record workflow carry `studentUserId`.

The student workspace uses the authenticated UID to retrieve the student's linked records.

### Firestore security
`firebase/firestore.rules` now enforces the following baseline:
- signed-in users cannot create their own user profile or assign themselves a role;
- an existing administrator provisions user profiles; the first administrator must be seeded through a trusted Firebase Console/Admin SDK workflow;
- users cannot change their own role;
- students can read only their linked student and academic records;
- students cannot create or modify attendance, marks, predictions or recommendations;
- only administrators can modify classes, sections, subjects and teacher assignments;
- role-aware authorization is enforced by Firestore, not just by client-side navigation.

Automated Firestore Emulator regression tests live in `frontend/tests/firestore.rules.test.js` and cover role escalation, administrator provisioning, and student record access/write restrictions. The GitHub Actions workflow runs those tests alongside frontend lint and build checks.

These rules still require publication to the actual Firebase project and a manual browser acceptance test. Teacher access to student data is not yet restricted by individual class/subject assignments, so the current rules remain prototype-level rather than production-ready.

### Recommendation persistence
When a prediction is saved, the prototype also saves a rule-based recommendation in `recommendations`.

## ML status
- Synthetic training dataset exists.
- Random Forest model exists.
- Compact exported model exists.
- Frontend inference path uses `/model.json`.
- Risk classes: Low / Medium / High.
- Features: attendance, averageMarks, recentTrend, missedAssessments.

**Do not report final evaluation metrics until they are measured and recorded from a defined evaluation run.**

## Still to verify
1. `frontend/public/model.json` loads correctly in the browser.
2. Students & Enrollments CRUD and enrollment creation.
3. Teachers and Subjects CRUD.
4. Teacher assignment creation/deletion.
5. Attendance and marks persistence.
6. Prediction generation and persistence.
7. Recommendation persistence/display.
8. Analytics counts and risk chart.
9. Student account linkage and student dashboard reads.
10. Teacher role workflow.
11. Firestore unauthorized-access cases.
12. Empty/loading/error states.
13. Responsive UI.
14. Production build.

## End-to-end acceptance test
Use this order after pulling the latest `main`:

1. Admin login.
2. Create a branch.
3. Create a program linked to the branch.
4. Create active academic year.
5. Create class and section.
6. Create a student and provide the Firebase Auth UID if a student account exists.
7. Create enrollment.
8. Create teacher.
9. Create subject.
10. Assign teacher + subject + class.
11. Open Attendance & Marks.
12. Enter several attendance/mark records for the student.
13. Generate/save prediction.
14. Confirm prediction and recommendation exist.
15. Open Analytics and confirm saved prediction is counted.
16. Log in with the linked student account.
17. Confirm the student sees only their own records, prediction and recommendation.
18. Test an unauthorized action.
19. Run a production build.

## Important testing rule
Do not mark a task complete because a page renders. Mark it complete only after the relevant data flow and permissions have been verified.

## Verified CI state (2026-10-16)
- Commit: `6ac5a22a048500b5ee5da0164734ce4b32f02437` (`fix: preserve registration setup error cause for lint`).
- Firestore Emulator authorization tests: **18 passed, 0 failed**.
- ESLint: passed.
- Vite production build: passed.
- This verifies CI and the rules against the emulator, not the live Firebase deployment or end-to-end browser behavior.
- The login logo lint issue and registration error-handling lint issue have been fixed on `main`.

## Current next action
Run the browser acceptance flow against the current build and verify that Firestore rules have been deployed to the live Firebase project. Do not claim the whole application is fully verified based on CI alone.

### Teacher assignment enforcement (in progress)
- Teacher profiles can now store the Firebase Authentication UID in `userId`; assignment creation requires that linkage.
- New assignment documents use deterministic IDs in the form `<teacher UID>__<subject ID>__<class ID>`, which Firestore Rules check before granting teacher access to attendance, assessments, marks, predictions or recommendations.
- Academic records and saved risk outputs now include class/subject scope fields. Legacy records without those fields are intentionally not available to teachers under the new rules.
- Teacher access to student profiles and enrollments is restricted while the data model lacks a safe direct assignment lookup for those documents.
- Existing random-ID assignments do not grant access under the new rules. Recreate each assignment from the admin UI after adding the teacher's Firebase Auth UID.
- This change is not yet complete until the Firestore Emulator, lint and production build checks pass and the assignment workflow is manually verified. Firestore rules have not been published to the live Firebase project.


### Teacher enrollment membership validation (2026-10-16)
- Enrollment documents created through the admin UI now use deterministic IDs: `<student ID>__<class ID>__<academic year ID>`.
- Teacher access to academic records now requires both the teacher's subject/class assignment and a matching enrollment for the record's student, class, and academic year. The enrollment's linked student UID must match the record's `studentUserId`; withdrawn enrollments do not authorize teacher access.
- Academic record and prediction/recommendation writes now include `academicYearId` and `sectionId` from the selected enrollment.
- Added Firestore Emulator tests for cross-class reads, un-enrolled students, and withdrawn enrollment.
- Legacy random-ID enrollments are not discoverable by the deterministic membership check; recreate/re-key enrollments in the admin UI or migrate their IDs before expecting teacher access. Legacy records without `academicYearId` fail closed for teachers.
- CI previously confirmed Firestore Rules tests passed, but lint failed on existing effect-based data-loading patterns; the affected admin screens now defer initial loader invocation to a microtask to avoid the synchronous-effect lint rule. Await the latest CI run before considering this complete.


### Authentication flows (2026-10-16)
- Added student self-registration with name, email, password confirmation and a Firestore profile at `users/{auth UID}`.
- Added Firebase password-reset email flow and clearer login/registration error feedback.
- Public registration is limited by Firestore Rules to a constrained `student` profile; the app never exposes admin/teacher role selection.
- The first administrator must still be provisioned through Firebase Console or a trusted Admin SDK workflow.
- Added a Firestore Emulator regression test for a valid student self-registration profile.
- Pending verification: latest GitHub Actions run, live Firestore Rules deployment, production hosting rebuild/deployment, and browser tests for register/login/reset/logout.
