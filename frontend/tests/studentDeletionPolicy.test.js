import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getStudentDeletionBlockReason } from '../src/utils/studentDeletionPolicy.js'

test('student deletion is blocked when enrollment history exists', () => {
  const student = { id: 'student-1', userId: '' }
  const enrollments = [{ id: 'student-1__class-1__year-1', studentId: 'student-1', status: 'Withdrawn' }]

  assert.match(getStudentDeletionBlockReason(student, enrollments), /enrollment history/i)
})

test('student deletion is blocked when a Firebase Auth UID is linked', () => {
  const student = { id: 'student-2', userId: 'auth-uid-2' }

  assert.match(getStudentDeletionBlockReason(student, []), /Firebase Authentication/i)
})

test('an unlinked student with no enrollment history can be deleted', () => {
  const student = { id: 'student-3', userId: '' }

  assert.equal(getStudentDeletionBlockReason(student, []), '')
})

test('a missing student cannot be deleted', () => {
  assert.match(getStudentDeletionBlockReason(null, []), /Select a student/i)
})
