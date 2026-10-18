import { lazy, Suspense, useState } from 'react'
import { firebaseConfigReady } from './firebaseConfig'
import { ArrowUpRight, BarChart3, Brain, CheckCircle2, School, ShieldCheck, Sparkles } from 'lucide-react'
import Brand from './components/Brand'

const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Branches = lazy(() => import('./pages/admin/Branches'))
const Programs = lazy(() => import('./pages/admin/Programs'))
const AcademicYears = lazy(() => import('./pages/admin/AcademicYears'))
const ClassesSections = lazy(() => import('./pages/admin/ClassesSections'))
const StudentsEnrollments = lazy(() => import('./pages/admin/StudentsEnrollments'))
const Assignments = lazy(() => import('./pages/admin/Assignments'))
const AdminManagement = lazy(() => import('./pages/admin/AdminManagement'))
const UserAccess = lazy(() => import('./pages/admin/UserAccess'))
const AcademicRecords = lazy(() => import('./pages/AcademicRecords'))
const Analytics = lazy(() => import('./pages/Analytics'))
const RoleDashboard = lazy(() => import('./pages/RoleDashboard'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function PageBoundary({ children }) {
  return (
    <Suspense fallback={<div role="status" className="grid min-h-screen place-items-center bg-[#FFF4E1] px-6 text-[#1A312C]">Loading EduSmart AI…</div>}>
      {children}
    </Suspense>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const login = (nextUser) => { setUser(nextUser); setPage('dashboard') }
  const logout = async () => { const { logoutUser } = await import('./services/authService'); await logoutUser(); setUser(null); setPage('home') }

  if (page === 'login') return <PageBoundary><Login onLogin={login} onBack={() => setPage('home')} onSignUp={() => setPage('signup')} firebaseConfigured={firebaseConfigReady} /></PageBoundary>
  if (page === 'signup') return <PageBoundary><Signup onComplete={login} onBack={() => setPage('login')} firebaseConfigured={firebaseConfigReady} /></PageBoundary>
  const adminOnlyPages = ['branches', 'programs', 'academic-years', 'classes-sections', 'students', 'assignments', 'teachers', 'subjects', 'user-access', 'analytics']
  if (adminOnlyPages.includes(page) && user?.role !== 'admin') {
    return <PageBoundary><RoleDashboard user={user} onBack={() => setPage('dashboard')} /></PageBoundary>
  }
  if (page === 'branches') return <PageBoundary><Branches onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'programs') return <PageBoundary><Programs onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'academic-years') return <PageBoundary><AcademicYears onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'classes-sections') return <PageBoundary><ClassesSections onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'students') return <PageBoundary><StudentsEnrollments onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'assignments') return <PageBoundary><Assignments onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'user-access') return <PageBoundary>{user?.role === 'admin' ? <UserAccess user={user} onBack={() => setPage('dashboard')} /> : <RoleDashboard user={user} onBack={() => setPage('dashboard')} />}</PageBoundary>
  if (['teachers', 'subjects'].includes(page)) return <PageBoundary><AdminManagement type={page} onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'records') return <PageBoundary><AcademicRecords user={user} onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'analytics') return <PageBoundary><Analytics onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'role') return <PageBoundary><RoleDashboard user={user} onBack={() => setPage('dashboard')} /></PageBoundary>
  if (page === 'dashboard') return <PageBoundary><Dashboard user={user} onLogout={logout} onNavigate={setPage} /></PageBoundary>
  return <Landing onSignIn={() => setPage('login')} onSignUp={() => setPage('signup')} firebaseConfigured={firebaseConfigReady} />
}

function Landing({ onSignIn, onSignUp, firebaseConfigured }) {
  return (
    <main className="landing-shell min-h-screen overflow-hidden">
      <nav className="landing-nav">
        <Brand />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-white/65 sm:inline">A clearer view of every learner</span>
          <button onClick={onSignUp} className="button-light">Create Admin</button>
          <button onClick={onSignIn} className="button-light">Sign In <ArrowUpRight size={16} /></button>
        </div>
      </nav>

      <section className="hero-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /><Sparkles size={15} /> THE SMARTER WAY TO SUPPORT STUDENTS</div>
          <h1>Better insight.<br /><span>Brighter outcomes.</span></h1>
          <p className="hero-description">One thoughtful workspace for your academic operations—from everyday attendance to the signals that help every student thrive.</p>
          {!firebaseConfigured && <p role="alert" className="mt-4 max-w-xl rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">Setup required: Firebase web configuration is missing. Add the six VITE_FIREBASE_* values to frontend/.env.local before signing in.</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onSignIn} className="button-primary">Explore your workspace <ArrowUpRight size={17} /></button>
            <div className="flex items-center gap-2 px-2 text-sm text-white/70"><ShieldCheck size={17} className="text-[#89D7B7]" /> Built around role-based access</div>
          </div>
          <div className="hero-proof">
            <div className="proof-item"><CheckCircle2 size={16} /><span>Academic records in one place</span></div>
            <div className="proof-item"><CheckCircle2 size={16} /><span>AI-assisted risk signals</span></div>
          </div>
        </div>

        <div className="hero-art" aria-label="Illustration of an academic analytics dashboard">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="preview-card">
            <div className="preview-top"><div><span className="preview-kicker">ACADEMIC OVERVIEW</span><h2>Good morning.</h2></div><div className="preview-avatar">ES</div></div>
            <div className="preview-metrics">
              <div className="preview-metric"><span>Attendance</span><strong>94.8%</strong><div className="metric-line"><i style={{ width: '94.8%' }} /></div></div>
              <div className="preview-metric"><span>On-track learners</span><strong>82%</strong><div className="metric-line"><i style={{ width: '82%' }} /></div></div>
            </div>
            <div className="preview-chart"><div className="chart-heading"><span>Learning progress</span><span>THIS TERM</span></div><div className="chart-bars">{[36, 52, 44, 68, 57, 78, 66, 90, 74, 96, 80, 100].map((height, index) => <i key={index} style={{ height: height + '%' }} />)}</div><div className="chart-labels"><span>Week 01</span><span>Week 06</span><span>Week 12</span></div></div>
            <div className="preview-footer"><span className="footer-pulse" /> Insights that make a difference <span className="footer-spark"><Sparkles size={15} /></span></div>
          </div>
          <div className="floating-note"><div className="note-icon"><Brain size={18} /></div><div><strong>Early insight</strong><span>Spot support needs sooner</span></div></div>
          <div className="floating-stamp"><span>DESIGNED FOR</span><strong>Every learner.</strong></div>
        </div>
      </section>

      <section className="landing-bottom">
        <div className="bottom-intro"><span>ONE CONNECTED WORKSPACE</span><p>Less admin noise.<br /><strong>More room to teach.</strong></p></div>
        <div className="feature-list">
          <div className="feature-item"><div className="feature-icon"><School size={19} /></div><div><strong>Academic operations</strong><span>Classes, subjects and enrollment</span></div></div>
          <div className="feature-item"><div className="feature-icon"><BarChart3 size={19} /></div><div><strong>Meaningful analytics</strong><span>Performance you can act on</span></div></div>
          <div className="feature-item"><div className="feature-icon"><Brain size={19} /></div><div><strong>AI-assisted insights</strong><span>Earlier signals, thoughtful support</span></div></div>
        </div>
      </section>
      <footer className="landing-footer"><Brand /><span>Thoughtfully designed for better learning outcomes.</span></footer>
    </main>
  )
}

export default App
