# EduSmart AI — Phased Roadmap

**Planning baseline:** repository audit dated 2026-10-18  
**Execution rule:** No phase is marked complete merely because code exists. Each phase requires evidence. Implementation and testing are authorized phase by phase; production deployment and Firebase data/rules changes remain excluded unless separately authorized.

## Guiding principles

1. Correctness and access control before visual polish.
2. Preserve the user's Firebase no-Blaze constraint.
3. Do not discard local changes, clear data, or weaken security rules to get a green demo.
4. Separate source implementation, automated test status, deployment status and live acceptance.
5. Treat the ML model as a synthetic-data academic demonstration, not a validated student-risk product.
6. Keep scope appropriate to a college mini-project and the existing stack.

## Phase 0 — Audit and planning baseline

**Status: Complete on 2026-10-18 (documentation-only work). No application source, build, deployment or Firebase data was changed by this phase.**

### Work
- Record the current repository head and recent CI state.
- Identify known bugs, architectural constraints and unverified assumptions.
- Define phase gates, acceptance tests and no-billing decisions.
- Align existing status/task documents with the audit.

### Deliverables
- `docs/REPOSITORY_AUDIT.md`
- `docs/BUG_BACKLOG.md`
- `docs/PHASED_ROADMAP.md`
- `docs/ACCEPTANCE_TEST_PLAN.md`
- `docs/DECISIONS.md`
- Updated `README.md`, `tasks.md`, `memory.md` and `docs/DEVELOPMENT_STATUS.md`

### Exit gate
All known findings are recorded and the plan does not assume unverified deployment or billing availability.

## Phase 1 — Source synchronization and CI recovery

**Priority: P0. No feature work before this gate.**

### Work
1. Inspect the user's local `git status --short`, current commit, and the diff for `frontend/src/services/authService.js`.
2. Preserve local work; do not use destructive reset/clean commands.
3. Synchronize with the intended `origin/main` only after the local changes are understood and safely retained.
4. Capture the exact failing assertion from the latest Firestore Emulator test run. **Done:** the self-registration success test failed with `PERMISSION_DENIED`.
5. Resolve the test/rule policy contradiction. **Committed:** test now expects self-registration denial; admin-create test uses a new UID. The admin-managed account policy is unchanged.
6. Rerun Firestore authorization tests, then lint, then production build. **Pending current CI run 39115312291.**
7. Record the exact commit and complete output summaries.

### Exit gate
- Current-head CI passes Firestore tests, lint and build.
- Tests express the approved security policy.
- Local changes are preserved and source parity is clear.
- No live Firebase changes have been made as a side effect of local verification.

## Phase 2 — Firebase free-plan-safe demo readiness

**Priority: P0. Must not require billing changes.**

### Work
1. Keep the existing manually provisioned administrator account and verify its Auth UID matches `users/{uid}`.
2. In Firebase Console, manually provision one teacher and one student demonstration Auth account if needed.
3. Create corresponding Firestore user profiles and linked teacher/student records with the correct UIDs and roles. Console operations must be performed by the project owner; never put passwords or service-account credentials in repository documentation.
4. Prepare a minimal demo dataset: one branch, program, academic year, class, section, subject, student enrollment, teacher and assignment.
5. Verify that the current Firestore rules permit the intended workflows and deny out-of-scope access.
6. Clearly mark callable-based Create Admin and managed-account creation as blocked/unavailable on the current plan unless the user explicitly changes the constraint.

### Important constraint
Do not enable Blaze, attach billing, weaken rules, add public role assignment, or claim callable functions are deployed. A Firebase Console-created account/profile is a manual demo setup, not proof that the automated account-provisioning workflow works.

### Exit gate
- A known admin can sign in.
- A teacher and student test account have matching Auth/profile identities.
- The project has a small, consistent demo dataset.
- The demo can proceed without deploying Cloud Functions or adding billing.
- Blocked automated setup flows are disclosed honestly.

## Phase 3 — Correct the ML class mapping and artifact provenance

**Priority: P0 for the core prediction feature.**

### Work
1. Establish a canonical mapping between numeric target values and Low/Medium/High labels.
2. Fix the export contract so tree leaf labels and metadata use the same mapping.
3. Add deterministic tests for representative low-, medium- and high-risk feature vectors.
4. Confirm the browser's inference agrees with Python inference on the same model and feature vectors.
5. Regenerate the model artifact from the approved training script.
6. Confirm `ml/model.json` and `frontend/public/model.json` are identical.
7. Resolve the current 5-tree artifact versus 40-tree training/evaluation mismatch.
8. Re-run evaluation only after these changes; update `ml/EVALUATION.md` from actual output.
9. Keep the UI/report explicit that data and labels are synthetic, and tree-vote fraction is not calibrated probability.

### Exit gate
- Numeric label mapping, displayed names, training script, exported artifact and evaluation document agree.
- Python/browser parity tests pass.
- The metric is explicitly tied to the artifact/configuration actually evaluated.
- No real-world accuracy or fairness claim is made.

## Phase 4 — Academic workflow integration

**Priority: P1.**

### Work
1. Create/verify academic structure in dependency order: branch → program → academic year → class/section.
2. Create student profile and enrollment; verify current class/year references.
3. Create teacher profile and subject; ensure teacher Auth UID is linked.
4. Create a valid teacher assignment and any required class-access record.
5. Record attendance and marks for the enrolled student.
6. Generate and persist prediction and rule-based recommendation.
7. Reload each page and confirm records persist.
8. Open analytics and confirm counts/risk distribution reflect saved records.

### Exit gate
The full admin-to-teacher academic-record flow works in a browser against the intended Firebase project and the data remains after refresh.

## Phase 5 — Role-based security acceptance

**Priority: P0/P1.**

### Work
- Verify admin, teacher, student and unauthenticated behavior using the emulator suite.
- Verify students can read only their own records and cannot write academic records.
- Verify teachers can read/write only records for valid assignments and active matching enrollments.
- Verify withdrawn/mismatched enrollment and other-class cases are denied.
- Verify users cannot create or promote privileged profiles.
- Verify queries used by the UI are compatible with Firestore Rules and required indexes.
- Review the rules as an authorization boundary; UI hiding alone does not count.

### Exit gate
All authorization tests pass on the current rules; live role-specific checks agree with the approved policy. Do not deploy rules until the reviewed diff and target project are confirmed.

## Phase 6 — UI/UX and reliability polish

**Priority: P2, after core correctness.**

### Work
- Confirm Create Admin and Sign In are visible and navigate correctly, while explaining the plan-related limitation of the callable.
- Audit forms and pages for loading, empty, success, validation, permission-denied and network-error states.
- Check responsive layout, keyboard navigation, focus states, semantic labels, contrast and chart text alternatives.
- Review dashboard copy so synthetic/demo data is not presented as live institutional facts.
- Consider route-level lazy loading and bundle splitting based on a fresh build measurement.
- Keep the approved palette: `#1A312C`, `#428475`, `#89D7B7`, `#FFF4E1`.

### Exit gate
Core flows are understandable and stable at laptop and mobile widths; no visual change hides a functional or security limitation.

## Phase 7 — Deployment and release verification

**Priority: P1. Perform only when the owner authorizes deployment.**

### Work
1. Verify source commit and local environment before building.
2. Build from the intended synchronized source.
3. Confirm Firebase target is `edusmart-ai-c4692`.
4. Deploy Hosting only after explicit confirmation.
5. Review/deploy Firestore rules and indexes separately, only after review and explicit confirmation.
6. Do not attempt Functions deployment under the current Spark/no-Blaze constraint.
7. Verify the live site in a fresh/incognito browser and record the commit and target.
8. Confirm the app uses the correct Firebase Web App configuration and authorized domains.

### Exit gate
Each target is separately marked verified, blocked or not deployed; the live UI matches the intended source. A Hosting success is not treated as proof that Functions/rules/indexes are deployed.

## Phase 8 — Academic submission and demo readiness

**Priority: P1 for submission.**

### Work
- Finalize the report and PPT using only verified implementation details and genuine screenshots.
- Include architecture, modules, data flow, security design, test results, ML methodology, limitations and future scope.
- Keep research citations verified against publisher records; do not retain unverified candidate references.
- Rehearse the complete demo and keep a concise fallback path if live internet or Firebase services fail.
- Clearly distinguish implemented, tested, deployed and planned features.
- Prepare a short viva explanation of why the model is demonstrative and what the synthetic metrics mean.

### Exit gate
Report, PPT, live demo and repository status documents tell the same factual story; no unverified feature or metric is described as complete.

## Phase order and dependencies

```text
Phase 0 Audit/docs
    ↓
Phase 1 Sync + CI
    ↓
Phase 2 No-billing demo readiness
    ↓
Phase 3 ML mapping/artifact correctness
    ↓
Phase 4 Academic workflow
    ↓
Phase 5 Security acceptance
    ↓
Phase 6 UI/UX polish
    ↓
Phase 7 Authorized release verification
    ↓
Phase 8 Report/PPT/demo sign-off
```

Phase 3 and Phase 4 can be developed in parallel only after Phase 1 is green, but their acceptance gates remain independent. Phase 7 is not implied by any earlier phase and requires explicit deployment authorization.

## Change-control checklist

Before each implementation phase:
- [ ] Confirm the phase and allowed scope.
- [ ] Inspect current repository/local status.
- [ ] List exact files expected to change.
- [ ] Preserve user changes and private configuration.
- [ ] Define tests and acceptance evidence first.
- [ ] Do not add billing or new infrastructure.
- [ ] After implementation, report changed files, test outcomes, deployment status and remaining limitations.
