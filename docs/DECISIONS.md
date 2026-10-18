# EduSmart AI — Architecture and Product Decisions

**Last reviewed:** 2026-10-18  
This document records constraints and decisions that future implementation work must preserve. Proposed decisions are labeled as recommendations until the owner confirms or implementation verifies them.

## DEC-001 — Keep the approved technology stack

**Status:** Existing project constraint  
**Decision:** Continue with React, Vite, Tailwind CSS, Recharts, Lucide React, Firebase Authentication, Firestore, Firebase Hosting, existing Cloud Functions source, and Python/Pandas/NumPy/scikit-learn for model training.  
**Do not add:** PostgreSQL, SQLAlchemy, custom JWT, unnecessary FastAPI, microservices, or unrelated paid infrastructure without explicit approval.  
**Reason:** Keep the academic project maintainable, demonstrable and aligned with the existing implementation.

## DEC-002 — Do not enable Firebase Blaze for this plan

**Status:** User constraint; binding  
**Decision:** Do not recommend, configure or perform a billing-plan upgrade as the default way to finish the demo.  
**Consequence:** Callable Cloud Functions required by first-admin registration, managed-user creation and admin-profile recovery cannot be assumed available. These features must be marked blocked unless a compatible no-billing solution is deliberately approved.  
**Near-term operating path:** Use the existing manually provisioned admin account and, for demo accounts, Firebase Console Auth users plus matching Firestore profiles. This is manual setup, not a claim that automated provisioning works.  
**Security constraint:** Do not let public clients assign admin/teacher roles or weaken Firestore rules to bypass the missing callable backend.

## DEC-003 — Keep privileged role provisioning trusted

**Status:** Existing security policy; preserve  
**Decision:** Admin and teacher roles must not be assigned by untrusted public form input. Account/profile creation must be performed by a trusted backend or by an authorized project owner through Firebase Console for manual demo setup.  
**Student self-registration:** Current product docs describe administrator-managed student accounts. A current emulator test expects a student to create their own profile, contradicting the rules and product policy. **Recommended resolution:** retain administrator-managed provisioning and update the stale test to expect denial. Do not change the security policy just to make CI pass.

## DEC-004 — Firestore Rules are the authorization boundary

**Status:** Existing project rule; preserve  
**Decision:** Hiding a menu item or routing a user to another dashboard does not replace Firestore authorization. Test the actual rules for all roles and sensitive collections.  
**Required validation:** Rules tests must cover profile role escalation, student record isolation, teacher assignment/enrollment boundaries, withdrawn enrollments, and unauthorized writes.

## DEC-005 — Distinguish manual setup from automated workflow

**Status:** Recommended documentation policy  
**Decision:** If an account is created manually in Firebase Console for the demo, report it as manually provisioned. Do not describe the callable Create Admin or managed-user workflows as verified unless they are deployed and tested.  
**Reason:** The current free-plan constraint makes this distinction essential for truthful reporting and viva answers.

## DEC-006 — Canonical ML class mapping must be explicit

**Status:** Required correction identified by audit  
**Decision:** Use one documented numeric mapping for Low, Medium and High, shared by data labels, model training, exported leaf indices, browser metadata, test vectors and evaluation report.  
**Current finding:** Source review indicates the existing encoding is consistent: poor-performance scores map to numeric class 2 / High risk, middle scores to class 1 / Medium, and strong-performance scores to class 0 / Low risk. Metadata order is Low, Medium, High. The earlier audit's reversed-label claim was incorrect; add deterministic tests and preserve the mapping unless evidence shows a defect.  
**Required outcome:** Python and browser inference must return the same human-readable label for deterministic test inputs.

## DEC-007 — The evaluated model must be the shipped model

**Status:** Required correction identified by audit  
**Decision:** Evaluation results must name the exact training configuration and exported artifact that is shipped to the browser.  
**Current issue (resolved in source):** The artifacts were regenerated to 40 trees and synchronized. CI must continue verifying reproducibility and equality.  
**Required outcome:** Keep `ml/model.json` and `frontend/public/model.json` synchronized and reproducible. The 86.25% metric is tied to the 40-tree synthetic holdout run and must never be presented as real-world validation.

## DEC-008 — Synthetic ML results are demonstration-only

**Status:** Existing project limitation; preserve  
**Decision:** The current dataset is synthetic and labels are generated from a hand-written formula. The documented 86.25% holdout accuracy measures agreement with synthetic labels, not real-world academic-risk accuracy.  
**Required wording:** Predictions are advisory; tree-vote share is not calibrated probability; recommendations are rule-based; model output must not be the sole basis for consequential decisions.  
**Future real-data evaluation:** Requires institutional approval, privacy protections, appropriate governance, independent label definition, leakage checks, subgroup evaluation and calibration review.

## DEC-009 — Source, tests, deployment and live acceptance are separate states

**Status:** Documentation rule  
**Decision:** Use separate statuses for implemented in source, automated tests passed, deployed to Firebase and verified in the browser.  
**Reason:** A successful frontend build does not prove Firebase Functions, rules or indexes are deployed; a successful Hosting deployment does not prove the live workflow is correct.

## DEC-010 — Preserve local work and user data

**Status:** Binding development rule  
**Decision:** Inspect local status and diffs before synchronizing. Do not use destructive reset/clean commands to resolve a pull conflict. Do not clear Firestore collections as a generic troubleshooting step. Inspect Auth users and Firestore profiles separately.

## DEC-011 — Keep the design direction

**Status:** Existing user-approved design constraint  
**Decision:** Use the palette `#1A312C`, `#428475`, `#89D7B7`, `#FFF4E1`; prioritize clear navigation, typography, status feedback, consistency and responsive behavior over decorative effects. Avoid introducing an unrelated visual language.

## DEC-012 — Scope stays appropriate to the mini-project

**Status:** Existing scope constraint  
**Out of scope unless explicitly approved:** parent portal, payments/fees, payroll, SMS/WhatsApp notifications, chat, mobile application, SaaS billing, microservices and production-scale ML infrastructure.

## How to change a decision

A decision changes only when the project owner explicitly changes the constraint or the audit provides new evidence. Update this document, the PRD/architecture where relevant, and the roadmap before implementation begins.
