import { useState } from 'react'
import {
  LockKeyhole, Mail, LoaderCircle, ArrowLeft, ArrowUpRight,
  ShieldCheck, Sparkles, Brain, CheckCircle2, UserRound, KeyRound,
} from 'lucide-react'
import { loginUser, registerStudent, resetPassword } from '../../services/authService'

function Login({ onLogin, onBack }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setNotice('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const user = mode === 'register'
        ? await registerStudent({ name, email, password })
        : await loginUser(email, password)
      onLogin(user)
    } catch (err) {
      const code = err?.code
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password.')
      } else if (code === 'auth/email-already-in-use') {
        setError('An account already exists with this email. Sign in instead or reset your password.')
      } else if (code === 'auth/weak-password') {
        setError('Choose a password with at least 6 characters.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your connection and try again.')
      } else {
        setError(err?.message || 'Unable to continue. Please try again.')
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

  const registering = mode === 'register'

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
          <div className="auth-assurance"><ShieldCheck size={17} /><span>Role-based access for your institute team</span></div>
          <div className="auth-decoration auth-decoration-one" /><div className="auth-decoration auth-decoration-two" />
        </section>

        <section className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-mobile-mark"><img className="auth-brand-mark" src="/edusmart-mark.svg" alt="" aria-hidden="true" /></div>
            <span className="auth-panel-kicker">YOUR ACADEMIC WORKSPACE</span>
            <h2>{registering ? 'Create your account.' : 'Welcome back.'}</h2>
            <p className="auth-intro">
              {registering
                ? 'Create a student account to access your academic workspace.'
                : 'Sign in with your institute account to continue.'}
            </p>

            {error && <div role="alert" className="auth-error">{error}</div>}
            {notice && <div role="status" className="auth-success">{notice}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              {registering && (
                <div className="auth-field">
                  <label htmlFor="full-name">Full name</label>
                  <div className="auth-input-wrap"><UserRound size={17} aria-hidden="true" /><input id="full-name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} placeholder="Your full name" /></div>
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <div className="auth-input-wrap"><Mail size={17} aria-hidden="true" /><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@institute.edu" /></div>
              </div>
              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input id="password" type="password" autoComplete={registering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={registering ? 6 : undefined} placeholder={registering ? 'At least 6 characters' : 'Enter your password'} /></div>
              </div>
              {registering && (
                <div className="auth-field">
                  <label htmlFor="confirm-password">Confirm password</label>
                  <div className="auth-input-wrap"><KeyRound size={17} aria-hidden="true" /><input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} placeholder="Re-enter your password" /></div>
                </div>
              )}
              <button type="submit" disabled={loading} className="auth-submit">
                {loading
                  ? <><LoaderCircle size={17} className="animate-spin" /> Please wait…</>
                  : registering
                    ? <>Create student account <ArrowUpRight size={17} /></>
                    : <>Sign in securely <ArrowUpRight size={17} /></>}
              </button>
            </form>

            {!registering && (
              <button type="button" className="auth-inline-action" onClick={handlePasswordReset} disabled={loading}>
                Forgot your password?
              </button>
            )}
            <div className="auth-security-note"><ShieldCheck size={16} /><span>{registering ? 'New accounts are students. An administrator assigns staff roles.' : 'Your account permissions determine what you can access.'}</span></div>
            <p className="auth-footer-note">
              {registering ? 'Already have an account? ' : 'New to EduSmart AI? '}
              <button type="button" className="auth-inline-action" onClick={() => switchMode(registering ? 'login' : 'register')} disabled={loading}>
                {registering ? 'Sign in' : 'Create a student account'}
              </button>
            </p>
          </div>
        </section>
      </div>
      <footer className="auth-page-footer"><span>EduSmart AI</span><span>Thoughtfully designed for better learning outcomes.</span></footer>
    </main>
  )
}

export default Login
