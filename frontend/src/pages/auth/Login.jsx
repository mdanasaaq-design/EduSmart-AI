import { useState } from 'react'
import { GraduationCap, LockKeyhole, Mail, LoaderCircle, ArrowLeft } from 'lucide-react'
import { loginUser } from '../../services/authService'

function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await loginUser(email, password)
      onLogin(user)
    } catch (err) {
      const code = err?.code
      if (code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError(err?.message || 'Unable to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <section className="hidden bg-emerald-500 p-10 text-slate-950 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-emerald-400">
                <GraduationCap size={26} />
              </div>
              <h1 className="mt-10 text-4xl font-bold tracking-tight">Welcome to EduSmart AI</h1>
              <p className="mt-4 max-w-md leading-7 text-slate-800">
                Manage academics, attendance and assessments while using AI-powered insights to identify students who may need support.
              </p>
            </div>
            <p className="text-sm font-medium text-slate-800">College Mini Project · AI & ML</p>
          </section>

          <section className="p-8 sm:p-12">
            <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
              <ArrowLeft size={16} /> Back
            </button>

            <div className="mb-8">
              <p className="text-sm font-medium text-emerald-400">EduSmart AI</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Sign in</h2>
              <p className="mt-2 text-sm text-slate-400">Use your institute account to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400" />
                </div>
              </div>

              {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">{error}</div>}

              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><LoaderCircle size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Login
