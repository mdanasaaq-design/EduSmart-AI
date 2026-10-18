# EduSmart AI — No-Billing Demo Account Setup

**Purpose:** Safely prepare a small exam/demo environment while the project remains on the current Firebase no-Blaze plan.  
**Important:** This is a manual Firebase Console procedure, not a replacement implementation of automated account provisioning. Do not publish or weaken Firestore rules to make the manual setup work.

## What works and what is blocked

- Existing administrator: use the already provisioned Auth account and matching `users/{uid}` profile; verify before the demo.
- First-admin registration: the app calls the `registerInstitutionAdmin` Cloud Function. If that callable is unavailable on the current plan, the page cannot create the first admin account automatically.
- Managed teacher/student account creation: the User Access screen calls `createManagedUser`. Do not claim this is working unless the callable is deployed and tested.
- Manual demo setup: the project owner can create Auth accounts in Firebase Console and then create matching Firestore profiles and academic records. The Auth UID must match the Firestore profile document ID.

Do not enable billing, deploy Functions, or change production rules as part of this procedure.

## Before starting

1. Confirm the Firebase project is `edusmart-ai-c4692`.
2. Confirm Email/Password is enabled under Firebase Authentication.
3. Use only dedicated demo email accounts and synthetic academic records.
4. Keep demo credentials out of GitHub, Markdown files, screenshots, logs and the project report.
5. Do not delete existing Auth users or Firestore documents to resolve duplicate-account errors.

## Step 1 — Verify the administrator

1. Open Firebase Console → Authentication → Users.
2. Find the existing administrator account and copy its UID.
3. Open Firestore Database → Data → `users`.
4. Confirm a document exists whose document ID is exactly that UID.
5. Confirm its `role` is `admin`, `status` is `active`, and `institutionId` is `primary`.
6. Sign in through EduSmart AI and verify the admin workspace opens.

If the profile is missing or the role does not match, stop and inspect the account before changing data. Do not make a public registration flow or grant admin privileges to a different account as a workaround.

## Step 2 — Create a teacher demo account

1. In Firebase Console → Authentication → Users, choose **Add user** and enter a dedicated demo email/password.
2. Copy the new user's UID.
3. In Firestore, create a document at `users/<AUTH_UID>` with these fields:

| Field | Type | Example |
|---|---|---|
| `name` | string | `Demo Teacher` |
| `email` | string | same email as Auth |
| `role` | string | `teacher` |
| `status` | string | `active` |
| `createdAt` | timestamp | current timestamp |
| `institutionId` | string | `primary` |

Use the exact Auth UID as the document ID. Never create the teacher profile with a random ID. The Console-created profile is trusted manual setup for this demo; normal clients must not be allowed to assign roles.

4. In EduSmart AI's admin workspace, open **Teachers** and create a teacher record. Enter the same name/email and paste the Firebase Auth UID into the **Firebase Auth UID** field.
5. Create a subject if the demo does not already have one.
6. Open **Teacher Assignments** and assign this teacher to the intended subject and class. The assignment screen uses the teacher Auth UID to create the deterministic assignment and class-access records.
7. Sign out, sign in as the teacher, and verify only the assigned class/subject is accessible.

## Step 3 — Create a student demo account

1. In Firebase Console → Authentication → Users, choose **Add user** and create a dedicated demo student account.
2. Copy the new user's UID.
3. In Firestore, create `users/<AUTH_UID>` with the same fields as the teacher profile, except `name`, `email`, and `role: student`.
4. In EduSmart AI's admin workspace, open **Students & Enrollments** and create a student record. Paste the student's Auth UID into the **Firebase Auth UID** field and use the same email.
5. Create the academic structure in dependency order if it does not exist: branch → program → academic year → class → section.
6. Create an active enrollment for the student in the intended academic year, class and section. The UI creates a deterministic enrollment document and links the student's current class/year fields.
7. Sign out, sign in as the student, and verify only the student's own linked records are visible.

## Step 4 — Prepare the minimum demo dataset

Use the application UI where possible after the Auth/profile setup. The recommended minimum dataset is:

- One branch and one program.
- One active academic year.
- One class and one section.
- One subject.
- One student with an active enrollment.
- One teacher with a valid Auth UID and a matching class/subject assignment.
- At least one attendance record and one marks record.
- One saved prediction and rule-based recommendation, only after the ML mapping/artifact issue in the backlog is corrected.

The enrollment document ID follows `<student-document-id>__<class-document-id>__<academic-year-document-id>`. Teacher assignment IDs follow `<teacher-auth-uid>__<subject-document-id>__<class-document-id>`. Use the application UI to create these relationships where possible rather than hand-writing IDs.

## Step 5 — Verification and troubleshooting

- [ ] Auth UID equals the `users/{uid}` document ID for admin, teacher and student.
- [ ] User profile email matches the Auth email.
- [ ] Role is correct and is not supplied by an untrusted public form.
- [ ] Teacher record's `userId` matches the teacher Auth UID.
- [ ] Student record's `userId` matches the student Auth UID.
- [ ] Enrollment is active and points to the intended student/class/year/section.
- [ ] Teacher assignment references the teacher UID, subject and class.
- [ ] Attendance/marks can be saved and persist after reload.
- [ ] Teacher cannot access an unassigned class or a student without a matching active enrollment.
- [ ] Student cannot access another student's records or write academic records.
- [ ] No billing upgrade or live rules relaxation was required.

If sign-in succeeds but the workspace cannot load, inspect the Auth UID, `users/{uid}` profile, linked student/teacher record, enrollment and assignment IDs. Do not assume that creating an Auth account alone creates the EduSmart profile.

## Known limitations

- Manual Console setup is not automated onboarding.
- The user who creates Auth users in the Console must keep the credentials secure and share them privately only with the intended demo participants.
- Cloud Functions-dependent registration/recovery workflows remain blocked unless already deployed and verified.
- This runbook does not prove the live Hosting site matches the current GitHub revision.
- Do not use predictions as real-world academic-risk assessments; the current model mapping/artifact correction remains a separate acceptance gate.
