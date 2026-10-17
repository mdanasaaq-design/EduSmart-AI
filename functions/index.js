const { initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { FieldValue, getFirestore } = require('firebase-admin/firestore')
const { onCall, HttpsError } = require('firebase-functions/v2/https')

initializeApp()

const db = getFirestore()
const auth = getAuth()

exports.createManagedUser = onCall({ region: 'us-central1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in with your administrator account first.')
  }

  const callerSnapshot = await db.collection('users').doc(request.auth.uid).get()
  if (!callerSnapshot.exists || callerSnapshot.data().role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only an institution administrator can create accounts.')
  }

  const name = typeof request.data?.name === 'string' ? request.data.name.trim() : ''
  const email = typeof request.data?.email === 'string' ? request.data.email.trim().toLowerCase() : ''
  const role = request.data?.role

  if (name.length < 2 || name.length > 100) {
    throw new HttpsError('invalid-argument', 'Enter a name between 2 and 100 characters.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new HttpsError('invalid-argument', 'Enter a valid email address.')
  }
  if (!['teacher', 'student'].includes(role)) {
    throw new HttpsError('invalid-argument', 'Only teacher and student accounts can be created here.')
  }

  let createdUser
  try {
    createdUser = await auth.createUser({
      email,
      displayName: name,
      emailVerified: false,
      disabled: false,
    })

    await db.collection('users').doc(createdUser.uid).set({
      name,
      email,
      role,
      createdAt: FieldValue.serverTimestamp(),
      createdBy: request.auth.uid,
      status: 'active',
      needsPasswordSetup: true,
    })

    let passwordSetupLink = null
    try {
      passwordSetupLink = await auth.generatePasswordResetLink(email)
    } catch (error) {
      // The account and profile are already created. Do not delete them just
      // because the reset link could not be generated; the admin can retry the
      // password-reset flow from Firebase Authentication.
      console.error('Password setup link generation failed for newly created account:', error.code || error.message)
    }

    return {
      uid: createdUser.uid,
      email,
      name,
      role,
      passwordSetupLink,
      message: passwordSetupLink
        ? 'Account created. Share the one-time password setup link with the user.'
        : 'Account and profile created. Send a password reset email from the Firebase Authentication console.',
    }
  } catch (error) {
    if (createdUser?.uid) {
      await db.collection('users').doc(createdUser.uid).delete().catch(() => {})
      await auth.deleteUser(createdUser.uid).catch(() => {})
    }
    if (error instanceof HttpsError) throw error
    if (error.code === 'auth/email-already-exists') {
      throw new HttpsError('already-exists', 'An Authentication account already uses this email. Use account recovery or link the existing account instead.')
    }
    console.error('Managed account creation failed:', error.code || error.message)
    throw new HttpsError('internal', 'The account could not be created. Check the Firebase Functions logs for details.')
  }
})
