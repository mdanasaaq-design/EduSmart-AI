# EduSmart AI — Task Tracker

**Last reviewed:** 2026-10-18  
**Code baseline audited:** `facd992`  
**Current status:** Latest remote CI passes on commit `29bd3d5` (run [39118541428](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39118541428)): 21 Firestore tests, 4 Python ML tests, 10 browser/helper tests, ESLint and production build. Phase 1 local Windows source synchronization, Phase 2 live Firebase Console verification and end-to-end academic workflow acceptance remain open.

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
- [x] Review ML label semantics; correct the audit finding to a regression-test gap rather than a confirmed mapping bug.
- [x] Identify 5-tree artifact versus 40-tree documentation mismatch.
- [x] Record Firebase no-Blaze constraint.
- [x] Create repository audit, bug backlog, phased roadmap, acceptance test plan and decisions document.
- [x] Update development status.
- [x] Cross-link the audit, backlog, roadmap, acceptance tests, decisions and status documents; perform a final repository-tree presence check.

## Phase 1 — Source synchronization and CI recovery (P0)

- [ ] Inspect local `git status --short`, current commit and `frontend/src/services/authService.js` diff.
- [ ] Preserve all local modifications before syncing.
- [ ] Synchronize to intended `origin/main` without destructive reset/clean commands.
- [x] Original CI failure captured: self-registration test failed with `PERMISSION_DENIED` at `frontend/tests/firestore.rules.test.js:51`.
- [x] Reconcile self-registration test with administrator-managed account policy; admin-create test now targets a new UID.
- [x] Full CI passed: 18 Firestore tests, 4 Python ML tests, 7 browser/helper tests, ESLint and production build, including vote-share rounding and class-query batching (run [39117547050](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39117547050)).
- [ ] Inspect local `git status --short`, current commit and `frontend/src/services/authService.js` diff; preserve and synchronize local work safely.

## Phase 2 — Firebase free-plan-safe demo readiness (P0)

- [x] Add `docs/FREE_PLAN_DEMO_SETUP.md` with the safe manual Auth/profile linkage procedure.
- [x] Update Create Admin and User Access messaging to explain the no-billing fallback.
- [~] Existing manually provisioned admin was reported working previously; reverify on current live source.
- [ ] Verify admin Auth UID matches `users/{uid}`.
- [ ] Create/verify one demo teacher Auth account and matching profile through Firebase Console (requires project-owner Console action).
- [ ] Create/verify one demo student Auth account and matching profile through Firebase Console (requires project-owner Console action).
- [ ] Link each teacher/student profile to the correct Auth UID.
- [ ] Prepare a small, internally consistent demo dataset.
- [BLOCKED] Automated callable-based first-admin, recovery and managed-user flows cannot be assumed available under the current Spark/no-Blaze constraint.
- [ ] Ensure no public role self-assignment or weakened security rules are introduced.

## Phase 3 — ML correctness and artifact provenance (P0)

- [x] Document the current numeric mapping semantics: index 0 = Low risk, 1 = Medium risk, 2 = High risk.
- [x] Add deterministic low/medium/high risk-label tests.
- [x] Verify Python/browser interpretation of exported leaf indices.
- [x] Add Python/browser prediction parity tests using shared fixed vectors.
- [x] Regenerate exported model from the approved training script.
- [x] Confirm `ml/model.json` and `frontend/public/model.json` are identical (40 trees each; verified after regeneration).
- [x] Resolve 5-tree versus 40-tree artifact mismatch; both artifacts contain 40 trees and are byte-identical.
- [x] Evaluate the exact browser majority-vote contract: 87.08% (209/240); scikit-learn probability-averaging baseline is 86.25% (207/240), both synthetic-only.
- [x] Update `ml/EVALUATION.md` with both metrics and limitations.
- [x] Fix vote-share rounding at exact half values (23/40 → 58%); verified in CI run [39117262846](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39117262846).
- [x] Keep synthetic-data and uncalibrated-confidence limitations visible in evaluation documentation.

## Phase 4 — Academic workflow integration (P1)

- [x] Fix source-level teacher query truncation: batch `in` queries in groups of 30 instead of silently dropping assignments after the first 30.
- [x] Add boundary tests for 0, 30 and 65 IDs; verified in full CI run [39117547050](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39117547050).
- [x] Replace the guessed missed-assessment proxy with an explicit integer input (0–7); parser boundary tests passed in CI run [39118541428](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39118541428).
- [~] Make enrollment writes and current-student pointer changes atomic; ESLint/build pass in CI run [39118541428](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39118541428); live/manual enrollment verification remains pending.
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
- [x] Fix the test/rule policy mismatch without weakening rules; CI passes 21/21 emulator tests in run [39118541428](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39118541428).
- [x] Add tests for teacher academic-record identifier mutation, class-access/assignment writes and admin self-demotion; verified in CI run [39118541428](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39118541428).
- [x] Test student role escalation and cross-student access denial in the emulator suite.
- [x] Test teacher access against assignment and enrollment in the emulator suite.
- [x] Test withdrawn/mismatched enrollment denial in the emulator suite.
- [x] Test unauthenticated access denial in the emulator suite.
- [x] Test users cannot create privileged profiles in the emulator suite.
- [ ] Confirm required indexes support actual queries.
- [ ] Independently verify live rules and index state if deployment is authorized.

## Phase 6 — UI/UX and reliability polish (P2)

- [ ] Verify Create Admin and Sign In navigation on live site.
- [ ] Review loading, empty, success, validation and error states.
- [ ] Review mobile/tablet layout and keyboard accessibility.
- [ ] Check contrast, labels, focus states and chart text alternatives.
- [~] Label the landing-page static metrics as an illustrative preview; complete the broader live/demo data review before sign-off.
- [x] Measure current bundle in CI run [39118541428](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39118541428): main JS 238.17 kB; Analytics 360.71 kB; Firebase 560.38 kB; Vite chunk warning remains.
- [~] Add route-level lazy loading and defer Firebase/dashboard imports; main JS is reduced, but the 560.38 kB Firebase chunk still needs a measured follow-up split.

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
