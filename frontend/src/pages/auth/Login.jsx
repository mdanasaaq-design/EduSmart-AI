import { useState } from 'react'
import {
  LockKeyhole, Mail, LoaderCircle, ArrowLeft, ArrowUpRight,
  ShieldCheck, Sparkles, Brain, CheckCircle2,
} from 'lucide-react'
import { loginUser, resetPassword } from '../../services/authService'

function Login({ onLogin, onBack, firebaseConfigured = true }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)
    try {
      const user = await loginUser(email, password)
      onLogin(user)
    } catch (err) {
      const code = err?.code
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your connection and try again.')
      } else if (code === 'permission-denied' || code === 'firestore/permission-denied') {
        setError('Your account was verified, but EduSmart could not read your profile. Ask the administrator to check Firestore access.')
      } else {
        setError(err?.message || 'Unable to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordReset() {
    setError('')
    setNotice('')
    if (!email.trim()) {
      setError('Enter your email address first.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(email)
      setNotice('If an account exists for that email, a password-reset email has been sent.')
    } catch (err) {
      if (err?.code === 'auth/invalid-email') setError('Please enter a valid email address.')
      else if (err?.code === 'auth/too-many-requests') setError('Too many attempts. Please try again later.')
      else setError('Unable to send a reset email right now. Check the address and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <header className="auth-header">
        <button type="button" onClick={onBack} className="auth-brand" aria-label="Back to EduSmart home">
          <img className="auth-brand-mark" src="/edusmart-mark.svg" alt="" aria-hidden="true" />
          <span><strong>EduSmart<span> AI</span></strong><small>LEARNING, IN FOCUS</small></span>
        </button>
        <button type="button" onClick={onBack} className="auth-back"><ArrowLeft size={15} /> Back to home</button>
      </header>

      <div className="auth-layout">
        <section className="auth-story">
          <div className="auth-story-copy">
            <span className="auth-eyebrow"><Sparkles size={14} /> A BETTER VIEW OF LEARNING</span>
            <h1>Make room for<br /><em>better outcomes.</em></h1>
            <p>Bring academic operations and student insight together in one calm, considered workspace.</p>
          </div>
          <div className="auth-preview">
            <div className="auth-preview-heading"><span className="auth-preview-icon"><Brain size={18} /></span><div><strong>Student insight</strong><small>Support, at the right time</small></div><span className="auth-live-dot" /></div>
            <div className="auth-preview-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="auth-preview-foot"><span><CheckCircle2 size={14} /> Academic overview</span><span>EDUSMART / 01</span></div>
          </div>
          <div className="auth-assurance"><ShieldCheck size={17} /><span>One secure sign-in for your assigned workspace</span></div>
          <div className="auth-decoration auth-decoration-one" /><div className="auth-decoration auth-decoration-two" />
        </section>

        <section className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-mobile-mark"><img className="auth-brand-mark" src="/edusmart-mark.svg" alt="" aria-hidden="true" /></div>
            <span className="auth-panel-kicker">YOUR ACADEMIC WORKSPACE</span>
            <h2>Welcome to EduSmart AI.</h2>
            <p className="auth-intro">Sign in with the credentials provided by your institution. We'll open the workspace assigned to your account.</p>

            {!firebaseConfigured && <div role="alert" className="auth-error">Firebase is not configured yet. Add the six VITE_FIREBASE_* values to frontend/.env.local, then rebuild the site.</div>}
            {error && <div role="alert" className="auth-error">{error}</div>}
            {notice && <div role="status" className="auth-success">{notice}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <div className="auth-input-wrap"><Mail size={17} aria-hidden="true" /><input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@institute.edu" /></div>
              </div>
              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Enter your password" /></div>
              </div>
              <button type="submit" disabled={loading || !firebaseConfigured} className="auth-submit">
                {loading ? <><LoaderCircle size={17} className="animate-spin" /> Please wait…</> : <>Sign in securely <ArrowUpRight size={17} /></>}
              </button>
            </form>

            <button type="button" className="auth-inline-action" onClick={handlePasswordReset} disabled={loading || !firebaseConfigured}>Forgot your password?</button>
            <div className="auth-security-note"><ShieldCheck size={16} /><span>One sign-in page. Your verified account profile determines your access and dashboard.</span></div>
            <p className="auth-footer-note">Need access? Contact your institution administrator to have an account created.</p>
          </div>
        </section>
      </div>
      <footer className="auth-page-footer"><span>EduSmart AI</span><span>Thoughtfully designed for better learning outcomes.</span></footer>
    </main>
  )
}

export default Login
