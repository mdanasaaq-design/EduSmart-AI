import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const allowedRoles = ['admin', 'teacher', 'student']

export async function registerStudent({ name, email, password, invitationCode = '' }) {
  const cleanName = name.trim()
  const cleanEmail = email.trim().toLowerCase()
  if (!cleanName) throw new Error('Please enter your full name.')

  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password)

  try {
    await updateProfile(credential.user, { displayName: cleanName })
    let role = 'student'
    const cleanInvitationCode = invitationCode.trim()
    let invitationRef = null

    if (cleanInvitationCode) {
      invitationRef = doc(db, 'roleInvitations', cleanInvitationCode)
      const invitationSnapshot = await getDoc(invitationRef)
      if (!invitationSnapshot.exists()) {
        throw new Error('That institution invitation code is invalid or has already been used.')
      }
      const invitation = invitationSnapshot.data()
      if (String(invitation.email || '').toLowerCase() !== String(credential.user.email || '').toLowerCase()) {
        throw new Error('This invitation belongs to a different email address. Register using the invited email.')
      }
      if (!['teacher', 'student'].includes(invitation.role) || invitation.status !== 'pending') {
        throw new Error('This invitation is not valid for account registration. Contact your institution administrator.')
      }
      role = invitation.role
    }

    const profile = {
      name: cleanName,
      email: credential.user.email,
      role,
      createdAt: serverTimestamp(),
    }
    if (cleanInvitationCode) profile.invitationId = cleanInvitationCode
    await setDoc(doc(db, 'users', credential.user.uid), profile)
    if (invitationRef) await deleteDoc(invitationRef).catch(() => {})
    return {
      uid: credential.user.uid,
      email: credential.user.email,
      name: cleanName,
      role,
    }
  } catch (error) {
    // Avoid leaving an unprofiled account when setup fails. If cleanup is
    // blocked, sign out and show a safe message instead of exposing internals.
    try {
      await deleteUser(credential.user)
    } catch {
      await signOut(auth).catch(() => {})
    }
    if (error instanceof Error && !error.code) throw error
    throw new Error('We could not finish setting up your account. Please try again. If the problem continues, contact your institute administrator.', { cause: error })
  }
}

export async function loginUser(email, password, expectedRole) {
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
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
