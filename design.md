# EduSmart AI — UI/UX Design

## 1. Design objective

Provide a professional, consistent academic-management interface that can be understood and demonstrated quickly. Prioritize clarity, trustworthy status feedback, readable academic data, and predictable role-based navigation over decorative effects.

## 2. Visual system

The approved palette is:

- Deep forest: `#1A312C`
- Teal: `#428475`
- Mint: `#89D7B7`
- Warm ivory: `#FFF4E1`

Use the palette consistently across primary surfaces, actions, emphasis, and text. Maintain accessible contrast and visible focus states. Use Lucide React icons consistently and avoid mixing unrelated visual styles.

## 3. Landing and authentication

### Landing navigation

The top-right navigation must show, in this order:

1. **Create Admin** — one-time institution and administrator setup.
2. **Sign In** — existing administrator, teacher, and student accounts use the shared sign-in page.

These are functional navigation actions, not decorative labels. After a deployment, verify both actions in a fresh/incognito browser session.

### Create Admin

The form should collect institution details and the first administrator's name, email, and password. Validate required fields, password confirmation, and clear errors. The backend callable must enforce one-time setup; the client must not assign the admin role itself. On success, sign in the created account and open the admin workspace.

### Sign In

Provide labeled email and password fields, clear validation and Firebase errors, password recovery where implemented, and a route back to the landing page. The workspace is determined by the trusted user profile role—not by a role dropdown on the public form.

### Managed users

Admin provisions teacher/student accounts from User Access & Roles. The public UI must not offer users a way to promote themselves or create additional administrator privileges.

## 4. Role workspaces

### Admin

- Branches and programs
- Academic years, classes and sections
- Students and enrollments
- Teachers and subjects
- Teacher assignments
- Attendance and marks
- Predictions, recommendations and analytics
- User Access & Roles

### Teacher

Focus on assigned academic work, permitted attendance/marks entry, and performance/risk information for students in valid assignments and enrollments.

### Student

Show the student's own linked profile, attendance, marks, risk indicators, prediction and recommendations. Never expose another student's records.

## 5. Reusable interaction patterns

Use consistent cards, buttons, form controls, tables, dialogs, status badges, loading indicators, empty states, and error messages. Forms should preserve entered values when safe and explain how to recover from failures.

## 6. Risk presentation

Use Low / Medium / High labels with measurable indicators and practical, rule-based recommendations. State clearly that these are prototype predictions. Do not imply a prediction guarantees an outcome or that model confidence is a calibrated probability.

## 7. Analytics

Charts should summarize persisted data and include meaningful labels. Empty datasets should produce a clear empty state rather than misleading zero-filled claims.

## 8. Responsive and accessible behavior

- Keep primary navigation usable on laptop and mobile widths.
- Associate labels with controls.
- Maintain readable contrast and keyboard focus.
- Do not convey status by color alone.
- Provide text feedback for loading, success and errors.

## 9. Demonstration sequence

Landing → Create Admin (first-time setup) → admin dashboard → create academic structure and managed users → assign teacher → record attendance/marks → generate prediction → review recommendation and analytics → sign in as linked student and confirm student-scoped data.
