import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import app, { auth, db, functions } from '../firebase'

const allowedRoles = ['admin', 'teacher', 'student']

export async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase()
  const credential = await signInWithEmailAndPassword(auth, cleanEmail, password)
  const profileRef = doc(db, 'users', credential.user.uid)

  try {
    let userSnapshot = await getDoc(profileRef)
    if (!userSnapshot.exists()) {
      // Admin custom claims are server-issued and survive accidental deletion of
      // Firestore documents. Allow only that already-verified administrator to
      // restore their own profile; never infer or accept a role from form input.
      const token = await credential.user.getIdTokenResult(true)
      if (token.claims.role === 'admin' && token.claims.institutionId === 'primary') {
        const restoreAdminProfile = httpsCallable(functions, 'restoreAdminProfile')
        await restoreAdminProfile({})
        userSnapshot = await getDoc(profileRef)
      }
    }
    if (!userSnapshot.exists()) {
      const projectId = app.options.projectId || 'unknown Firebase project'
      console.error('EduSmart profile lookup returned no document', {
        projectId,
        expectedPath: `users/${credential.user.uid}`,
        authEmail: credential.user.email,
      })
      throw new Error('Your account is authenticated, but its profile could not be found at the expected users/UID path in Firebase project ' + projectId + '. Ask your administrator to verify that this account UID matches the document ID.')
    }

    const profile = userSnapshot.data()
    if (!allowedRoles.includes(profile.role)) {
      await signOut(auth)
      throw new Error('Your user profile does not have a valid role. Contact the administrator.')
    }

    if (String(profile.email || '').trim().toLowerCase() !== String(credential.user.email || '').trim().toLowerCase()) {
      console.warn('EduSmart profile email differs from Firebase Authentication email.', {
        uid: credential.user.uid,
        profileEmail: profile.email || null,
        authEmail: credential.user.email || null,
      })
    }

    return {
      ...profile,
      uid: credential.user.uid,
      email: credential.user.email,
      name: profile.name || credential.user.displayName || '',
    }
  } catch (error) {
    if (auth.currentUser?.uid === credential.user.uid) await signOut(auth).catch(() => {})
    throw error
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
