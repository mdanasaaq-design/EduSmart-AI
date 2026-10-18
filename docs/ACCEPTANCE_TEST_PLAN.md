# EduSmart AI — Acceptance Test Plan

**Purpose:** Define the tests required to call a feature verified. This is a plan, not a claim that tests have been run.  
**Audit date:** 2026-10-18  
**Latest passing CI reference:** [run 39116887998](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39116887998)

## Status vocabulary

- **PASS:** test was executed on a known revision/environment and evidence is recorded.
- **FAIL:** executed and did not meet expected result.
- **BLOCKED:** cannot be executed because a dependency/plan/permission is unavailable.
- **NOT RUN:** no current execution evidence.
- **SOURCE REVIEW:** conclusion from code inspection only; not runtime verification.

The original CI run failed on a stale self-registration test. After correcting that test and adding ML contract checks, the latest full CI run passed Firestore authorization, Python model/export tests, browser inference tests, ESLint and production build. Live Firebase account provisioning and end-to-end role workflows remain NOT RUN unless explicitly marked.

## A. Repository and CI baseline

| ID | Test | Expected result | Current status |
|---|---|---|---|
| CI-01 | Inspect local `git status --short` and current commit before sync | All local changes identified and preserved | NOT RUN in current session |
| CI-02 | Synchronize local source with intended `origin/main` | No local changes lost; expected commit confirmed | BLOCKED until local state inspected |
| CI-03 | Run Firestore Emulator authorization suite | All tests pass against current rules | FAIL in latest GitHub Actions run; exact assertion to capture |
| CI-04 | Run ESLint after tests pass | No lint errors | NOT RUN in latest run |
| CI-05 | Run production build after lint passes | Build succeeds; record warnings/artifact size | NOT RUN in latest run |
| CI-06 | Inspect current tree and package manifests | Documentation and test commands reflect actual repository | SOURCE REVIEW completed |

## B. Authentication and profile linkage

| ID | Test | Expected result | Current status |
|---|---|---|---|
| AUTH-01 | Sign in as existing admin | Auth succeeds and `users/{uid}` profile matches same UID/role | NOT RUN against current live deployment |
| AUTH-02 | Reload admin workspace | User remains authenticated as supported and correct workspace loads | NOT RUN |
| AUTH-03 | Sign in with invalid credentials | Clear generic error; no unintended profile changes | NOT RUN |
| AUTH-04 | Password reset with valid registered email | Firebase sends reset email without exposing whether unrelated accounts exist | NOT RUN |
| AUTH-05 | Missing profile for ordinary user | Access is denied with actionable guidance; no role inferred from input | SOURCE REVIEW only |
| AUTH-06 | Admin profile recovery callable | Only same UID with server-issued admin claims can recover profile | BLOCKED on current Spark/no-Blaze plan unless callable already deployed |
| AUTH-07 | Teacher/student profile linkage | Auth UID matches `users/{uid}` and linked teacher/student record | NOT RUN |
| AUTH-08 | Student account self-promotion attempt | Rules deny role changes | PASS in full CI run 39116551389 |

## C. Free-plan account provisioning

| ID | Test | Expected result | Current status |
|---|---|---|---|
| PLAN-01 | Use existing manually provisioned admin | Admin signs in without requiring new callable deployment | Reported working previously; retest against current live revision |
| PLAN-02 | Manually create demo teacher in Firebase Console | Auth account and matching Firestore profile exist with role teacher | NOT RUN |
| PLAN-03 | Manually create demo student in Firebase Console | Auth account and matching Firestore profile exist with role student | NOT RUN |
| PLAN-04 | Public user attempts to create admin/teacher profile | Denied by rules | SOURCE REVIEW; emulator suite required |
| PLAN-05 | Admin UI invokes callable-based managed-user creation | If Functions are unavailable, show clear blocked/error state without partial or misleading success | BLOCKED/NOT RUN on current plan |
| PLAN-06 | Confirm no billing change was required | Demo setup stays on current Firebase plan | Required constraint |

Manual Console provisioning is an operational workaround for a demonstration, not proof that automated account provisioning works. Never store demo passwords or service-account secrets in these documents.

## D. Academic structure and records

| ID | Test | Expected result | Current status |
|---|---|---|---|
| DATA-01 | Create branch and program | Both persist with valid relationship | NOT RUN |
| DATA-02 | Create academic year, class and section | Valid parent references and status | NOT RUN |
| DATA-03 | Create student and enrollment | Enrollment has student/class/year IDs and linked Auth UID where applicable | NOT RUN |
| DATA-04 | Create teacher and subject | Teacher profile is linked to teacher Auth UID | NOT RUN |
| DATA-05 | Create teacher assignment | Assignment uses the expected teacher UID, subject and class references | NOT RUN |
| DATA-06 | Record attendance for enrolled student | Valid record persists and survives reload | NOT RUN |
| DATA-07 | Record assessment/marks | Valid record persists and survives reload | NOT RUN |
| DATA-08 | Edit a record | Only authorized fields/record scope change | NOT RUN |
| DATA-09 | Attempt record for missing/withdrawn enrollment | Teacher write is denied | Source test exists; current suite status FAIL |
| DATA-10 | Open analytics after records are saved | Counts and risk distribution reflect saved data | NOT RUN |

## E. Firestore authorization matrix

Execute in the emulator first. Only perform live denial checks using approved test accounts and non-sensitive demo records.

| Role | Read own profile | Read other student records | Write academic records | Manage academic structure | Create/promote privileged profile |
|---|---|---|---|---|---|
| Unauthenticated | Deny | Deny | Deny | Deny | Deny |
| Student | Allow own | Deny | Deny | Deny | Deny |
| Teacher | Allow own | Only within valid assignment/enrollment scope | Only within valid assignment/enrollment scope | Deny | Deny |
| Admin | Allow | Allow within institution scope currently implemented | Allow | Allow | Admin-only trusted provisioning policy |

The current prototype uses a single primary institution context. Multi-institution isolation is not to be claimed unless implemented and tested.

Required adversarial cases:
- [ ] Student tries to change own role to admin/teacher.
- [ ] Student tries to create a profile for another UID.
- [ ] Student tries to write attendance, marks, predictions or recommendations.
- [ ] Teacher queries a class not assigned to them.
- [ ] Teacher reads/writes a record for a student not enrolled in the assigned class/year.
- [ ] Teacher reads/writes a record for a withdrawn enrollment.
- [ ] Teacher changes class/subject/student identifiers during an update.
- [ ] Unauthenticated client attempts any academic-record access.
- [ ] A normal user tries to create or modify teacher assignment/access documents.

## F. ML correctness and provenance

| ID | Test | Expected result | Current status |
|---|---|---|---|
| ML-01 | Check numeric target mapping | Poor indicators map to High risk, middle to Medium, strong to Low; leaf indices match metadata | PASS: Python contract tests in CI run 39116551389 |
| ML-02 | Check exported tree count | Artifact count matches documented training configuration | PASS: 40 trees; regeneration diff check passed in CI run 39116551389 |
| ML-03 | Compare Python and browser inference on fixed inputs | Same risk label for each fixed vector | PASS: shared fixed vectors tested in Python and browser suites, CI run 39116551389 |
| ML-04 | Compare `ml/model.json` and `frontend/public/model.json` | Files are identical | PASS: both contain 40 trees and CI regeneration produced no diff |
| ML-05 | Re-run synthetic holdout evaluation after artifact reconciliation | Metrics generated from the exact model/configuration are recorded | PASS: sklearn baseline 86.25% (207/240); browser majority vote 87.08% (209/240), both synthetic-only |
| ML-06 | Review UI confidence language | Tree-vote share is not described as calibrated probability | SOURCE REVIEW: limitation documented; live UI review pending |
| ML-07 | Review report/PPT model claims | Synthetic results are not presented as real-world accuracy | NOT RUN |
| ML-08 | Verify vote-share rounding | 23 of 40 votes rounds to 58%; displayed share is not called probability | Local Python/Node tests pass; CI run 39117171929 pending |

Required ML test vectors should include very low attendance/marks, midrange indicators and strong attendance/marks with few missed assessments. Expected labels must be established from the agreed label semantics, not reverse-engineered from the current model output.

## G. UI, accessibility and responsive behavior

- [ ] Landing page exposes working Create Admin and Sign In actions.
- [ ] Navigation is usable at desktop and narrow viewport widths.
- [ ] Auth forms have labels, validation, pending state and readable errors.
- [ ] Data pages distinguish loading, empty, error and successful-save states.
- [ ] Keyboard focus is visible and tab order is logical.
- [ ] Buttons and form controls are keyboard operable.
- [ ] Contrast and status indicators are readable; color is not the only signal.
- [ ] Charts have clear titles/axes/tooltips and a textual interpretation.
- [ ] Tables do not overflow unusably at common viewport widths.
- [ ] No demo page falsely implies data is real or model outputs are definitive.

## H. Release and live verification

| ID | Test | Expected result | Current status |
|---|---|---|---|
| REL-01 | Confirm local commit and clean/understood worktree | Source revision recorded before build | NOT RUN |
| REL-02 | Confirm correct Firebase target | `edusmart-ai-c4692` selected explicitly | NOT RUN |
| REL-03 | Deploy Hosting from intended source | Hosting release references intended revision | Historical deploy exists; current parity unknown |
| REL-04 | Verify rules deployment | Deployed rules match reviewed source | NOT RUN |
| REL-05 | Verify index deployment | Required composite indexes are present/ready | NOT RUN |
| REL-06 | Verify callable Functions | Only if deployable under approved plan; do not enable billing to satisfy this test | BLOCKED by current plan |
| REL-07 | Test fresh/incognito browser session | Current live page and auth flows behave as expected | NOT RUN |
| REL-08 | Record browser screenshots for report | Genuine screenshots from the verified build/live site | NOT RUN |

## I. End-to-end demo acceptance

A minimal end-to-end demo passes only when:
1. Admin signs in and opens the admin workspace.
2. The academic structure exists.
3. A student has a valid active enrollment.
4. A teacher is linked to Auth and assigned to the relevant class/subject.
5. Attendance and marks save successfully.
6. The model returns a label with correct class mapping.
7. Prediction and rule-based recommendation persist.
8. Analytics reflects the saved prediction.
9. The student sees only their own linked records.
10. Unauthorized reads/writes are denied by rules.
11. The operator can state which setup/deployment features are blocked by the free-plan constraint.

## Evidence log template

For each executed test, record:
- Date/time and environment (emulator, local browser, or live Hosting).
- Git commit SHA.
- Firebase project ID if applicable.
- Test ID and result (PASS/FAIL/BLOCKED).
- Exact error or screenshot filename, excluding credentials and personal data.
- Follow-up bug ID.
