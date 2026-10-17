const { initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { FieldValue, getFirestore } = require('firebase-admin/firestore')
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')

const adminSetupCode = defineSecret('ADMIN_SETUP_CODE')

initializeApp()

const db = getFirestore()
const auth = getAuth()


exports.registerInstitutionAdmin = onCall({ region: 'us-central1', secrets: [adminSetupCode] }, async (request) => {
  const setupCode = typeof request.data?.setupCode === 'string' ? request.data.setupCode : ''
  if (!setupCode || setupCode !== adminSetupCode.value()) {
    throw new HttpsError('permission-denied', 'The institution setup code is invalid.')
  }

  const name = typeof request.data?.name === 'string' ? request.data.name.trim() : ''
  const email = typeof request.data?.email === 'string' ? request.data.email.trim().toLowerCase() : ''
  const password = typeof request.data?.password === 'string' ? request.data.password : ''
  const collegeName = typeof request.data?.collegeName === 'string' ? request.data.collegeName.trim() : ''
  const collegeAddress = typeof request.data?.collegeAddress === 'string' ? request.data.collegeAddress.trim() : ''
  const phone = typeof request.data?.phone === 'string' ? request.data.phone.trim() : ''

  if (name.length < 2 || name.length > 100 || collegeName.length < 2 || collegeName.length > 160) {
    throw new HttpsError('invalid-argument', 'Enter a valid administrator name and institution name.')
  }
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254) {
    throw new HttpsError('invalid-argument', 'Enter a valid email address.')
  }
  if (password.length < 8 || password.length > 128) {
    throw new HttpsError('invalid-argument', 'Password must contain between 8 and 128 characters.')
  }
  if (collegeAddress.length > 500 || phone.length > 30) {
    throw new HttpsError('invalid-argument', 'Institution address or phone number is too long.')
  }

  const setupRef = db.collection('institutions').doc('primary')
  let createdUser
  try {
    await db.runTransaction(async (transaction) => {
      const setupSnapshot = await transaction.get(setupRef)
      if (setupSnapshot.exists && setupSnapshot.data()?.setupCompleted === true) {
        throw new HttpsError('failed-precondition', 'Institution setup is already complete. Ask the existing administrator to create accounts.')
      }
      const admins = await db.collection('users').where('role', '==', 'admin').limit(1).get()
      if (!admins.empty) {
        throw new HttpsError('failed-precondition', 'An administrator already exists. Sign in instead of creating another institution administrator.')
      }
    })

    createdUser = await auth.createUser({ email, password, displayName: name, emailVerified: false, disabled: false })
    await db.runTransaction(async (transaction) => {
      const setupSnapshot = await transaction.get(setupRef)
      if (setupSnapshot.exists && setupSnapshot.data()?.setupCompleted === true) {
        throw new HttpsError('failed-precondition', 'Institution setup was completed by another request.')
      }
      const adminSnapshot = await db.collection('users').where('role', '==', 'admin').limit(1).get()
      if (!adminSnapshot.empty) {
        throw new HttpsError('failed-precondition', 'An administrator already exists. Sign in instead.')
      }
      transaction.set(db.collection('users').doc(createdUser.uid), {
        name, email, role: 'admin', createdAt: FieldValue.serverTimestamp(),
        status: 'active', institutionId: 'primary',
      })
      transaction.set(setupRef, {
        name: collegeName, address: collegeAddress, phone,
        email, adminUid: createdUser.uid, setupCompleted: true,
        createdAt: FieldValue.serverTimestamp(),
      })
    })
    return { uid: createdUser.uid, email, name, role: 'admin', institutionId: 'primary' }
  } catch (error) {
    if (createdUser?.uid) await auth.deleteUser(createdUser.uid).catch(() => {})
    if (error instanceof HttpsError) throw error
    if (error.code === 'auth/email-already-exists') throw new HttpsError('already-exists', 'An Authentication account already uses this email. Sign in or use password recovery.')
    console.error('Institution administrator setup failed:', error.code || error.message)
    throw new HttpsError('internal', 'Institution setup failed. Check Firebase Functions logs.')
  }
})

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
