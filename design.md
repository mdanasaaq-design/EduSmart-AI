# EduSmart AI — UI/UX Design

## 1. Design Goal
Create a clean academic-management interface that is easy to demonstrate in a college project evaluation.

## 2. Design Principles
- Simple over decorative.
- Consistent spacing and typography.
- Clear hierarchy.
- Responsive layout.
- Minimal form complexity.
- Strong visibility of important academic metrics.
- Consistent loading and error feedback.

## 3. Application Areas
### Authentication
A focused login screen with:
- email;
- password;
- login action;
- validation/error feedback.

### Admin Dashboard
Dashboard cards provide access to:
- Branches
- Programs
- Academic Years
- Classes & Sections
- Students & Enrollments
- Teachers
- Subjects
- Teacher Assignments
- Attendance & Marks
- Analytics

### Teacher Workspace
Focus on:
- assigned academic structure;
- attendance;
- marks;
- student performance;
- risk information.

### Student Workspace
Focus on:
- profile;
- attendance;
- marks;
- performance;
- risk prediction;
- risk factors;
- recommendations.

## 4. Reusable UI Patterns
Use reusable:
- cards;
- buttons;
- form controls;
- tables;
- modal/dialog patterns where appropriate;
- badges for status/risk;
- empty states;
- error messages;
- loading indicators.

## 5. Risk Presentation
Risk should be immediately understandable:
- risk level: Low / Medium / High;
- model confidence, only when it is the actual model output;
- measurable factors;
- recommendations.

Avoid presenting prediction as a guaranteed outcome. Use wording such as “predicted risk” or “prototype prediction.”

## 6. Analytics
Use Recharts for simple visual summaries, including risk distribution. Charts should support interpretation rather than become decorative elements.

## 7. Responsive Behavior
The interface should remain usable on laptop and common mobile widths, but desktop browser use is the primary demonstration environment.

## 8. Accessibility Basics
- Use labels for form controls.
- Maintain readable contrast.
- Use descriptive button text.
- Do not communicate important information by color alone.
- Preserve keyboard usability where practical.

## 9. Visual Consistency
Use the existing Tailwind-based design system and avoid introducing multiple unrelated visual styles. Icons should come from Lucide React where an icon is useful.

## 10. Demonstration Priority
The evaluator should be able to understand this sequence without explanation:
Manage institute → manage people → assign academics → enter academic records → generate prediction → inspect factors/recommendations → view analytics.
