import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import app, { auth, db, functions } from '../firebase'

const allowedRoles = ['admin', 'teacher', 'student']

async function resolveAuthenticatedProfile(authUser) {
  const profileRef = doc(db, 'users', authUser.uid)
  let userSnapshot = await getDoc(profileRef)

  if (!userSnapshot.exists()) {
    // Admin custom claims are server-issued and survive accidental deletion of
    // Firestore documents. Recover only that already-verified administrator.
    const token = await authUser.getIdTokenResult(true)
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
      expectedPath: `users/${authUser.uid}`,
      authEmail: authUser.email,
    })
    throw new Error('Your account is authenticated, but its profile could not be found at the expected users/UID path in Firebase project ' + projectId + '. Ask your administrator to verify that this account UID matches the document ID.')
  }

  const profile = userSnapshot.data()
  if (!allowedRoles.includes(profile.role)) {
    throw new Error('Your user profile does not have a valid role. Contact the administrator.')
  }

  if (String(profile.email || '').trim().toLowerCase() !== String(authUser.email || '').trim().toLowerCase()) {
    console.warn('EduSmart profile email differs from Firebase Authentication email.', {
      uid: authUser.uid,
      profileEmail: profile.email || null,
      authEmail: authUser.email || null,
    })
  }

  return {
    ...profile,
    uid: authUser.uid,
    email: authUser.email,
    name: profile.name || authUser.displayName || '',
  }
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
  try {
    return await resolveAuthenticatedProfile(credential.user)
  } catch (error) {
    if (auth.currentUser?.uid === credential.user.uid) await signOut(auth).catch(() => {})
    throw error
  }
}

/**
 * Restore the trusted Firestore profile for Firebase's already-persisted session.
 * The stored local session hint only decides whether to load this module; it is
 * never used to grant access or determine a role.
 */
export function subscribeToAuthState(onUser, onError) {
  let sequence = 0
  return onAuthStateChanged(auth, async (authUser) => {
    const currentSequence = ++sequence
    if (!authUser) {
      onUser(null)
      return
    }

    try {
      const profile = await resolveAuthenticatedProfile(authUser)
      if (currentSequence === sequence) onUser(profile)
    } catch (error) {
      if (currentSequence !== sequence) return
      onError?.(error)
      onUser(null)
      if (auth.currentUser?.uid === authUser.uid) await signOut(auth).catch(() => {})
    }
  })
}

export async function resetPassword(email) {
  const cleanEmail = email.trim()
  if (!cleanEmail) throw new Error('Enter your email address first.')
  await sendPasswordResetEmail(auth, cleanEmail)
}

export async function logoutUser() {
  await signOut(auth)
}
