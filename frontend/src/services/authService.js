import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
  const userSnapshot = await getDoc(doc(db, 'users', credential.user.uid))

  if (!userSnapshot.exists()) {
    await signOut(auth)
    throw new Error('Your account is authenticated, but no EduSmart AI user profile exists yet.')
  }

  const profile = userSnapshot.data()
  const allowedRoles = ['admin', 'teacher', 'student']

  if (!allowedRoles.includes(profile.role)) {
    await signOut(auth)
    throw new Error('Your user profile does not have a valid role. Contact the administrator.')
  }

  return {
    uid: credential.user.uid,
    email: credential.user.email,
    ...profile,
  }
}

export async function logoutUser() {
  await signOut(auth)
}
