import { useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { ArrowLeft, ArrowUpRight, Building2, Mail, LockKeyhole, UserRound, MapPin, Phone, ShieldCheck, LoaderCircle } from 'lucide-react'
import { functions } from '../../firebase'
import { loginUser } from '../../services/authService'

const registerInstitutionAdmin = httpsCallable(functions, 'registerInstitutionAdmin')

export default function Signup({ onComplete, onBack, firebaseConfigured = true }) {
  const [form, setForm] = useState({
    collegeName: '', collegeAddress: '', phone: '', name: '', email: '',
    password: '', confirmPassword: '', setupCode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const change = (key) => (event) => setForm(current => ({ ...current, [key]: event.target.value }))
  async function submit(event) {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('The passwords do not match.')
    if (form.password.length < 8) return setError('Choose a password with at least 8 characters.')
    setLoading(true)
    try {
      await registerInstitutionAdmin({
        collegeName: form.collegeName.trim(),
        collegeAddress: form.collegeAddress.trim(),
        phone: form.phone.trim(),
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        setupCode: form.setupCode,
      })
      const user = await loginUser(form.email, form.password)
      onComplete(user)
    } catch (err) {
      const code = err?.code || ''
      if (code.includes('permission-denied')) setError('The institution setup code is invalid or not authorized.')
      else if (code.includes('failed-precondition')) setError(err.message || 'Institution setup is already complete. Sign in instead.')
      else if (code.includes('already-exists')) setError('An account already uses this email. Please sign in or reset its password.')
      else setError(err?.message || 'Could not complete institution setup. Confirm Firebase Functions are deployed and try again.')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, placeholder, Icon, props = {}) => (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-input-wrap"><Icon size={17} aria-hidden="true" /><input value={form[key]} onChange={change(key)} placeholder={placeholder} required {...props} /></div>
    </label>
  )

  return (
    <main className="auth-shell">
      <header className="auth-header">
        <button type="button" onClick={onBack} className="auth-brand"><img className="auth-brand-mark" src="/edusmart-mark.svg" alt="" /><span><strong>EduSmart<span> AI</span></strong><small>INSTITUTION SETUP</small></span></button>
        <button type="button" onClick={onBack} className="auth-back"><ArrowLeft size={15}/> Back to sign in</button>
      </header>
      <div className="auth-layout">
        <section className="auth-story">
          <div className="auth-story-copy"><span className="auth-eyebrow"><Building2 size={14}/> YOUR INSTITUTION, CONNECTED</span><h1>Start with a<br/><em>strong foundation.</em></h1><p>Set up your institution and create its first administrator account. After setup, the administrator can provision teacher and student access.</p></div>
          <div className="auth-assurance"><ShieldCheck size={17}/><span>One-time institution setup; subsequent sign-ups are closed.</span></div>
          <div className="auth-decoration auth-decoration-one"/><div className="auth-decoration auth-decoration-two"/>
        </section>
        <section className="auth-panel">
          <div className="auth-panel-inner">
            <span className="auth-panel-kicker">FIRST-TIME SETUP</span>
            <h2>Register your college.</h2>
            <p className="auth-intro">Create your institution profile and initial administrator login. Have the private setup code provided by the project owner ready.</p>
            {error && <div role="alert" className="auth-error">{error}</div>}
            {!firebaseConfigured && <div role="alert" className="auth-error">Firebase configuration is missing. Configure the six VITE_FIREBASE_* values and rebuild.</div>}
            <form onSubmit={submit} className="auth-form">
              <div className="auth-form-section"><Building2 size={16}/><strong>College details</strong></div>
              {field('collegeName','College / institution name','e.g. ABC Institute of Technology',Building2,{maxLength:160})}
              {field('collegeAddress','College address','Street, city, state',MapPin,{maxLength:500})}
              {field('phone','Institution phone (optional)','Contact number',Phone,{type:'tel',maxLength:30,required:false})}
              <div className="auth-form-section"><UserRound size={16}/><strong>Administrator account</strong></div>
              {field('name','Administrator full name','Your full name',UserRound,{autoComplete:'name',maxLength:100})}
              {field('email','Admin email address','you@college.edu',Mail,{type:'email',autoComplete:'email'})}
              {field('password','Create password','At least 8 characters',LockKeyhole,{type:'password',autoComplete:'new-password',minLength:8,maxLength:128})}
              {field('confirmPassword','Confirm password','Re-enter your password',LockKeyhole,{type:'password',autoComplete:'new-password',minLength:8,maxLength:128})}
              {field('setupCode','Private institution setup code','Enter setup code',ShieldCheck,{type:'password',autoComplete:'off'})}
              <button type="submit" disabled={loading || !firebaseConfigured} className="auth-submit">{loading ? <><LoaderCircle size={17} className="animate-spin"/> Setting up institution…</> : <>Create institution & admin <ArrowUpRight size={17}/></>}</button>
            </form>
            <p className="auth-footer-note">Already registered? <button type="button" className="auth-inline-action" onClick={onBack}>Sign in</button></p>
          </div>
        </section>
      </div>
      <footer className="auth-page-footer"><span>EduSmart AI</span><span>Institution onboarding</span></footer>
    </main>
  )
}
