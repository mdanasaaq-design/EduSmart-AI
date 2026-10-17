import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const allowedRoles = ['admin', 'teacher', 'student']

export async function registerStudent({ name, email, password }) {
  const cleanName = name.trim()
  const cleanEmail = email.trim()
  if (!cleanName) throw new Error('Please enter your full name.')

  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password)

  try {
    await updateProfile(credential.user, { displayName: cleanName })
    await setDoc(doc(db, 'users', credential.user.uid), {
      name: cleanName,
      email: credential.user.email,
      role: 'student',
      createdAt: serverTimestamp(),
    })
    return {
      uid: credential.user.uid,
      email: credential.user.email,
      name: cleanName,
      role: 'student',
    }
  } catch (error) {
    // Avoid leaving an unprofiled account when setup fails. If cleanup is
    // blocked, sign out and show a safe message instead of exposing internals.
    try {
      await deleteUser(credential.user)
    } catch {
      await signOut(auth).catch(() => {})
    }
    throw new Error('We could not finish setting up your account. Please try again. If the problem continues, contact your institute administrator.', { cause: error })
  }
}

export async function loginUser(email, password, expectedRole) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
  const userSnapshot = await getDoc(doc(db, 'users', credential.user.uid))

  if (!userSnapshot.exists()) {
    await signOut(auth)
    throw new Error('Your account is authenticated, but no EduSmart AI user profile exists yet.')
  }

  const profile = userSnapshot.data()
  if (!allowedRoles.includes(profile.role)) {
    await signOut(auth)
    throw new Error('Your user profile does not have a valid role. Contact the administrator.')
  }

  if (expectedRole && profile.role !== expectedRole) {
    await signOut(auth)
    const roleNames = { admin: 'Institution Admin', teacher: 'Teacher', student: 'Student' }
    throw new Error(`This account is registered as ${roleNames[profile.role] || profile.role}. Select the matching login option or contact your institute administrator.`)
  }

  return {
    ...profile,
    uid: credential.user.uid,
    email: credential.user.email,
    name: profile.name || credential.user.displayName || '',
  }
}

export async function resetPassword(email) {
  const cleanEmail = email.trim()
  if (!cleanEmail) throw new Error('Enter your email address first.')
  await sendPasswordResetEmail(auth, cleanEmail)
}

export async function logoutUser() {
  await signOut(auth)
}
