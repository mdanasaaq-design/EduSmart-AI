# EduSmart AI — Task Tracker

**Last reviewed:** 2026-10-18  
**Code baseline audited:** `facd992`  
**Current status:** planning baseline recorded; application implementation and deployment are not being performed in this task.

Use:
- `[x]` only for verified work.
- `[~]` for implemented in source but not fully verified.
- `[ ]` for pending.
- `[BLOCKED]` for a known external constraint.
- `[FAIL]` for a test that was executed and failed.

## Phase 0 — Audit and planning

- [x] Inspect current GitHub tree and project configuration.
- [x] Record latest CI run metadata and failing step.
- [x] Identify security test/rule inconsistency.
- [x] Identify ML class mapping mismatch.
- [x] Identify 5-tree artifact versus 40-tree documentation mismatch.
- [x] Record Firebase no-Blaze constraint.
- [x] Create repository audit, bug backlog, phased roadmap, acceptance test plan and decisions document.
- [x] Update development status.
- [ ] Finish cross-linking all canonical documents and recheck consistency.

## Phase 1 — Source synchronization and CI recovery (P0)

- [ ] Inspect local `git status --short`, current commit and `frontend/src/services/authService.js` diff.
- [ ] Preserve all local modifications before syncing.
- [ ] Synchronize to intended `origin/main` without destructive reset/clean commands.
- [FAIL] Latest recorded CI run fails during Firestore authorization tests.
- [ ] Capture exact failing assertion from GitHub Actions.
- [ ] Reconcile self-registration test with administrator-managed account policy.
- [ ] Run Firestore Emulator tests on current head.
- [ ] Run ESLint after tests pass.
- [ ] Run production build after lint passes.
- [ ] Record commit SHA and results.

## Phase 2 — Firebase free-plan-safe demo readiness (P0)

- [~] Existing manually provisioned admin was reported working previously; reverify on current live source.
- [ ] Verify admin Auth UID matches `users/{uid}`.
- [ ] Create/verify one demo teacher Auth account and matching profile through Firebase Console.
- [ ] Create/verify one demo student Auth account and matching profile through Firebase Console.
- [ ] Link each teacher/student profile to the correct Auth UID.
- [ ] Prepare a small, internally consistent demo dataset.
- [BLOCKED] Automated callable-based first-admin, recovery and managed-user flows cannot be assumed available under the current Spark/no-Blaze constraint.
- [ ] Ensure no public role self-assignment or weakened security rules are introduced.

## Phase 3 — ML correctness and artifact provenance (P0)

- [ ] Define a canonical numeric mapping for Low/Medium/High.
- [ ] Correct model export leaf-label mapping.
- [ ] Add deterministic low/medium/high prediction tests.
- [ ] Add Python/browser prediction parity tests.
- [ ] Regenerate exported model from the approved training script.
- [ ] Confirm `ml/model.json` and `frontend/public/model.json` are identical.
- [ ] Resolve 5-tree artifact versus 40-tree script/evaluation mismatch.
- [ ] Re-run evaluation on the exact shipped artifact and update `ml/EVALUATION.md` from actual output.
- [ ] Keep synthetic-data and uncalibrated-confidence limitations visible.

## Phase 4 — Academic workflow integration (P1)

- [~] Institute structure and academic-record screens exist in source.
- [ ] Create branch → program → academic year → class/section.
- [ ] Create student and active enrollment.
- [ ] Create teacher and subject with correct Auth UID linkage.
- [ ] Create valid teacher assignment and required class-access record.
- [ ] Record attendance and marks.
- [ ] Generate and persist prediction and rule-based recommendation.
- [ ] Verify persistence after reload.
- [ ] Verify analytics reflects saved records.

## Phase 5 — Security acceptance (P0/P1)

- [~] Firestore rules and emulator tests exist in source.
- [ ] Fix the test/rule policy mismatch without weakening rules.
- [ ] Test student role escalation and cross-student access denial.
- [ ] Test teacher access against assignment and enrollment.
- [ ] Test withdrawn/mismatched enrollment denial.
- [ ] Test unauthenticated access denial.
- [ ] Test users cannot create privileged profiles.
- [ ] Confirm required indexes support actual queries.
- [ ] Independently verify live rules and index state if deployment is authorized.

## Phase 6 — UI/UX and reliability polish (P2)

- [ ] Verify Create Admin and Sign In navigation on live site.
- [ ] Review loading, empty, success, validation and error states.
- [ ] Review mobile/tablet layout and keyboard accessibility.
- [ ] Check contrast, labels, focus states and chart text alternatives.
- [ ] Confirm synthetic/demo data is clearly labeled.
- [ ] Measure current bundle after build is green.
- [ ] Consider lazy-loading/splitting only after functional correctness.

## Phase 7 — Release verification (requires explicit authorization)

- [ ] Confirm local source SHA and preserve local changes.
- [ ] Confirm Firebase target is `edusmart-ai-c4692`.
- [ ] Build from intended source.
- [ ] Deploy Hosting only after explicit authorization.
- [ ] Review/deploy Firestore rules and indexes separately, after approval.
- [BLOCKED] Do not attempt Cloud Functions deployment while the no-Blaze constraint remains.
- [ ] Verify live app in fresh/incognito browser.
- [ ] Record the revision and status of each Firebase target separately.

## Phase 8 — Report, PPT and demo sign-off (P1)

- [ ] Finalize the 50–65 page report against verified implementation.
- [ ] Update PPT with verified architecture, modules, test results and ML limitations.
- [ ] Verify research-paper titles/authors/DOIs against publisher records.
- [ ] Capture genuine screenshots from the verified build/live app.
- [ ] Rehearse admin → teacher → student demo and fallback path.
- [ ] Ensure report, PPT, README and actual website do not contradict each other.

## Deployment caveat

A previous local pull was blocked by a local modification in `frontend/src/services/authService.js`, and a Hosting release then succeeded from that existing checkout. The current live/source parity is unknown. Preserve local changes and verify the exact revision before building or deploying. Hosting does not deploy Cloud Functions, Firestore rules or indexes.

## Definition of project completion

The project is not complete until:
- CI passes on the intended source revision.
- The displayed ML risk label matches the numeric class semantics.
- The shipped model artifact matches its documented training/evaluation configuration.
- Admin, teacher and student workflows are tested with linked identities.
- Security boundaries pass emulator tests.
- The no-billing demo path is reliable and honest about blocked callables.
- Current live targets are verified independently where deployment is authorized.
- Report and PPT claims match the verified system.
