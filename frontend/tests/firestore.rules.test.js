import { after, before, beforeEach, test } from 'node:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const projectId = 'demo-edusmart-ai'
let testEnv

before(async () => {
  const rules = readFileSync(resolve(process.cwd(), '../firebase/firestore.rules'), 'utf8')
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  })
})

beforeEach(async () => {
  await testEnv.clearFirestore()
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()
    await setDoc(doc(db, 'users', 'admin-1'), { role: 'admin', name: 'Admin' })
    await setDoc(doc(db, 'users', 'student-1'), { role: 'student', name: 'Student' })
    await setDoc(doc(db, 'users', 'student-2'), { role: 'student', name: 'Other student' })
    await setDoc(doc(db, 'marks', 'mark-student-1'), {
      studentUserId: 'student-1',
      score: 82,
    })
    await setDoc(doc(db, 'marks', 'mark-student-2'), {
      studentUserId: 'student-2',
      score: 91,
    })
  })
})

after(async () => {
  await testEnv?.cleanup()
})

test('a signed-in user cannot create their own role-bearing profile', async () => {
  const db = testEnv.authenticatedContext('attacker').firestore()
  await assertFails(setDoc(doc(db, 'users', 'attacker'), { role: 'admin' }))
})

test('an administrator can provision a user profile', async () => {
  const db = testEnv.authenticatedContext('admin-1').firestore()
  await assertSucceeds(setDoc(doc(db, 'users', 'teacher-1'), {
    role: 'teacher',
    name: 'Teacher',
  }))
})

test('a user cannot promote their own account to another role', async () => {
  const db = testEnv.authenticatedContext('student-1').firestore()
  await assertFails(updateDoc(doc(db, 'users', 'student-1'), { role: 'admin' }))
})

test('a student can read their own academic record', async () => {
  const db = testEnv.authenticatedContext('student-1').firestore()
  await assertSucceeds(getDoc(doc(db, 'marks', 'mark-student-1')))
})

test('a student cannot read another student academic record', async () => {
  const db = testEnv.authenticatedContext('student-1').firestore()
  await assertFails(getDoc(doc(db, 'marks', 'mark-student-2')))
})

test('a student cannot create or modify academic marks', async () => {
  const db = testEnv.authenticatedContext('student-1').firestore()
  await assertFails(setDoc(doc(db, 'marks', 'new-mark'), {
    studentUserId: 'student-1',
    score: 100,
  }))
  await assertFails(updateDoc(doc(db, 'marks', 'mark-student-1'), { score: 100 }))
})
