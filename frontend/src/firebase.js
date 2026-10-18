// Firebase SDK initialization is kept separate from the public Web App config so
// the landing page does not eagerly download the Firebase SDK bundle.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { firebaseConfig, firebaseConfigReady } from './firebaseConfig'

export { firebaseConfigReady }

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app, 'us-central1')
export default app
