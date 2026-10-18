export function getStudentDeletionBlockReason(student, enrollments = []) {
  if (!student) return 'Select a student record before deleting.'
  if (enrollments.some((enrollment) => enrollment.studentId === student.id)) {
    return 'This student has enrollment history. Deletion is blocked to preserve academic records and enrollment references; set the student to Inactive to retain the history.'
  }
  if (typeof student.userId === 'string' && student.userId.trim()) {
    return 'This student is linked to Firebase Authentication. Deleting this record would leave a login without its profile; handle the Auth account and profile through the approved admin cleanup process first.'
  }
  return ''
}
