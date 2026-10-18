# EduSmart AI — Development Status

**Status updated:** 2026-10-18  
**Repository:** `mdanasaaq-design/EduSmart-AI`, branch `main`  
**Code baseline audited:** `facd99297139a4e891ee461e3a674751d7bf24f0`  
**Firebase project:** `edusmart-ai-c4692`  
**Hosting URL:** https://edusmart-ai-c4692.web.app

## Current overall status

**Not signed off.** The project has substantial implemented source, but current CI is failing, the ML label/artifact contract has source-level inconsistencies, the user's Firebase no-Blaze constraint blocks assumed callable workflows, and live deployment parity has not been verified.

The current work is **planning/documentation only**. No application source was changed, no build or test was run, and no Firebase deployment or data change was performed during the 2026-10-18 audit.

## Latest automated verification evidence

Latest CI run for the audited code baseline: [Frontend CI run 39010124131](https://github.com/mdanasaaq-design/EduSmart-AI/actions/runs/39010124131).

- Dependency installation: passed.
- Firestore Emulator authorization test step: **failed**.
- ESLint: **skipped** after the test failure.
- Production build: **skipped** after the test failure.

A current source-level mismatch is visible: one rules test expects a signed-in user to create their own student profile, while the current `users/{userId}` Firestore rule permits creation only for an administrator. This is a likely cause, but the exact failed assertion must be confirmed from CI output before a code change. Do not weaken authorization just to make CI green.

## Implemented in source (not equivalent to verified)

- React + Vite frontend and role-aware navigation.
- Firebase email/password authentication and password reset UI.
- First-admin registration callable and managed-user provisioning callable source.
- Admin-profile recovery callable source.
- Branch/program/year/class/section management.
- Student/enrollment and teacher/subject/assignment screens.
- Attendance/marks workflows.
- Browser-side Random Forest inference, prediction persistence and rule-based recommendations.
- Analytics and role workspaces.
- Firestore rules, index definitions and emulator tests.
- Firebase Hosting and GitHub Actions configuration.
- Project requirements, architecture, design, context and deployment documentation.

## High-priority findings

### 1. Firebase no-Blaze constraint
The current project plan must not assume Cloud Functions can be deployed. The first-admin, admin-profile recovery and managed-user flows depend on callables. Do not recommend a billing upgrade as the default. For the immediate demo, use the existing manually provisioned admin and, if required, manually provision teacher/student Auth accounts plus matching Firestore profiles through Firebase Console. Keep role assignment trusted and rules restrictive. Mark automated callable flows blocked unless the project owner changes the constraint.

### 2. ML class mapping
The training script encodes low risk as numeric label 2 and high risk as 0, while exported metadata is ordered `Low, Medium, High` and the frontend uses the leaf index against that array. This creates a low/high label mapping inconsistency. Fix and test the canonical mapping before relying on displayed predictions.

### 3. Model artifact mismatch
`ml/model.json` and `frontend/public/model.json` currently contain 5 trees and are byte-identical. The training script and `ml/EVALUATION.md` specify 40 trees. The documented 86.25% synthetic holdout accuracy must not be claimed as the verified accuracy of the current shipped 5-tree artifact.

### 4. Deployment/source parity
A previous local pull was blocked by a local modification to `frontend/src/services/authService.js`; a Hosting deployment then succeeded from the existing checkout. Newer source changes existed on GitHub. The current live site's source parity is unknown. Preserve local changes and verify the exact revision before any future release.

### 5. Historical bundle size
A previous local build produced a JavaScript bundle of roughly 1.2 MB with a Vite large-chunk warning. This is a historical measurement; capture a fresh build report after CI is repaired before planning optimizations.

## Firebase deployment state

- Hosting: a previous local deployment was reported successful on 2026-10-17; current source parity and live UI are unverified.
- Cloud Functions: source exists; deployment is blocked by the current Spark/no-Blaze constraint unless project constraints change.
- Firestore rules: source exists; current deployed rules have not been independently verified in this audit.
- Firestore indexes: source definitions exist; live deployment/index readiness has not been verified.
- Firebase web config: historically had a mismatched API key; verify current live configuration against the registered Web App without exposing secrets.

Hosting, Functions, rules and indexes are separate targets. Never infer their status from a successful frontend build or Hosting message.

## Required next phases

1. **Source synchronization and CI recovery:** preserve local changes, capture the exact failing test, reconcile the test with the approved security policy, then rerun rules tests, lint and build.
2. **No-billing demo readiness:** verify the existing admin and manually provision safe demo roles if needed; document blocked callable flows.
3. **ML correctness:** fix class encoding, synchronize artifact and training configuration, add parity tests and reevaluate the exact shipped model.
4. **Academic workflow:** verify structure, enrollment, assignments, attendance, marks, prediction, recommendation and analytics.
5. **Security acceptance:** test role boundaries and teacher assignment/enrollment scope.
6. **UI/UX polish:** loading/error/empty states, responsive/accessibility review, then bundle optimization.
7. **Authorized release verification:** build/deploy only with explicit approval and independently verify each Firebase target.
8. **Report/PPT/demo sign-off:** use only verified screenshots, metrics and feature claims.

See:
- [Repository Audit](REPOSITORY_AUDIT.md)
- [Bug Backlog](BUG_BACKLOG.md)
- [Phased Roadmap](PHASED_ROADMAP.md)
- [Acceptance Test Plan](ACCEPTANCE_TEST_PLAN.md)
- [Architecture and Product Decisions](DECISIONS.md)
- [Exam Demo Checklist](EXAM_DEMO_CHECKLIST.md)

## Development status rules

- **Implemented** means source exists.
- **Tested** means a relevant test ran and passed on a recorded revision.
- **Deployed** means the specific target was deployed successfully.
- **Verified** means the live/browser acceptance test passed.
- **Blocked** means a known constraint prevents the intended path.
- Never label the entire project complete while any critical acceptance gate is failing or unverified.
