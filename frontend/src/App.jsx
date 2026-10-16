import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db, firebaseConfigReady } from './firebase'
import { ArrowUpRight, BarChart3, Brain, Building2, CalendarDays, CheckCircle2, ClipboardCheck, GraduationCap, LayoutDashboard, Link2, LogOut, School, ShieldCheck, Sparkles, Users } from 'lucide-react'
import Login from './pages/auth/Login'
import Branches from './pages/admin/Branches'
import Programs from './pages/admin/Programs'
import AcademicYears from './pages/admin/AcademicYears'
import ClassesSections from './pages/admin/ClassesSections'
import StudentsEnrollments from './pages/admin/StudentsEnrollments'
import Assignments from './pages/admin/Assignments'
import AdminManagement from './pages/admin/AdminManagement'
import AcademicRecords from './pages/AcademicRecords'
import Analytics from './pages/Analytics'
import RoleDashboard from './pages/RoleDashboard'
import { logoutUser } from './services/authService'

const modules = [
  { title: 'Branches', description: 'Manage institute locations and campuses.', icon: Building2, page: 'branches', category: 'INSTITUTE' },
  { title: 'Programs', description: 'Organize programs and qualifications.', icon: GraduationCap, page: 'programs', category: 'INSTITUTE' },
  { title: 'Academic Years', description: 'Keep sessions and academic calendars in sync.', icon: CalendarDays, page: 'academic-years', category: 'ACADEMICS' },
  { title: 'Classes & Sections', description: 'Build a clear structure for every cohort.', icon: LayoutDashboard, page: 'classes-sections', category: 'ACADEMICS' },
  { title: 'Students & Enrollments', description: 'Manage student records and class enrollment.', icon: Users, page: 'students', category: 'PEOPLE' },
  { title: 'Teachers', description: 'Maintain teacher profiles and details.', icon: Users, page: 'teachers', category: 'PEOPLE' },
  { title: 'Subjects', description: 'Keep subjects and course codes organized.', icon: School, page: 'subjects', category: 'ACADEMICS' },
  { title: 'Teacher Assignments', description: 'Connect teachers with classes and subjects.', icon: Link2, page: 'assignments', category: 'PEOPLE' },
  { title: 'Attendance & Marks', description: 'Record performance and generate risk insights.', icon: ClipboardCheck, page: 'records', category: 'INSIGHTS' },
  { title: 'Analytics', description: 'Explore institute metrics and risk patterns.', icon: BarChart3, page: 'analytics', category: 'INSIGHTS' },
]

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const login = (nextUser) => { setUser(nextUser); setPage('dashboard') }
  const logout = async () => { await logoutUser(); setUser(null); setPage('home') }

  if (page === 'login') return <Login onLogin={login} onBack={() => setPage('home')} firebaseConfigured={firebaseConfigReady} />
  if (page === 'branches') return <Branches onBack={() => setPage('dashboard')} />
  if (page === 'programs') return <Programs onBack={() => setPage('dashboard')} />
  if (page === 'academic-years') return <AcademicYears onBack={() => setPage('dashboard')} />
  if (page === 'classes-sections') return <ClassesSections onBack={() => setPage('dashboard')} />
  if (page === 'students') return <StudentsEnrollments onBack={() => setPage('dashboard')} />
  if (page === 'assignments') return <Assignments onBack={() => setPage('dashboard')} />
  if (['teachers', 'subjects'].includes(page)) return <AdminManagement type={page} onBack={() => setPage('dashboard')} />
  if (page === 'records') return <AcademicRecords user={user} onBack={() => setPage('dashboard')} />
  if (page === 'analytics') return <Analytics onBack={() => setPage('dashboard')} />
  if (page === 'role') return <RoleDashboard user={user} onBack={() => setPage('dashboard')} />
  if (page === 'dashboard') return <Dashboard user={user} onLogout={logout} onNavigate={setPage} />
  return <Landing onSignIn={() => setPage('login')} firebaseConfigured={firebaseConfigReady} />
}

function Landing({ onSignIn, firebaseConfigured }) {
  return (
    <main className="landing-shell min-h-screen overflow-hidden">
      <nav className="landing-nav">
        <Brand />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-white/65 sm:inline">A clearer view of every learner</span>
          <button onClick={onSignIn} className="button-light">Sign in <ArrowUpRight size={16} /></button>
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

function Dashboard({ user, onLogout, onNavigate }) {
  const role = user?.role || 'user'
  const admin = role === 'admin'
  const [stats, setStats] = useState({ students: null, teachers: null, programs: null, predictions: null })
  const [statsError, setStatsError] = useState('')
  const grouped = ['INSTITUTE', 'ACADEMICS', 'PEOPLE', 'INSIGHTS'].map((category) => ({ category, items: modules.filter((module) => module.category === category) }))

  useEffect(() => {
    if (!admin) return
    let cancelled = false
    Promise.all(['students', 'teachers', 'programs', 'predictions'].map((name) => getDocs(collection(db, name))))
      .then(([students, teachers, programs, predictions]) => {
        if (cancelled) return
        setStats({ students: students.size, teachers: teachers.size, programs: programs.size, predictions: predictions.size })
        setStatsError('')
      })
      .catch(() => {
        if (!cancelled) setStatsError('Institute totals could not be loaded. Check administrator access to Firestore.')
      })
    return () => { cancelled = true }
  }, [admin])
  return (
    <main className="app-shell min-h-screen">
      <nav className="app-topbar"><div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 lg:px-9"><Brand /><div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-[#1A312C]">{user?.name || user?.email}</p><p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[.15em] text-[#428475]">{role}</p></div><div className="user-avatar">{(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}</div><button onClick={onLogout} className="button-outline"><LogOut size={15} /> <span className="hidden sm:inline">Sign out</span></button></div></div></nav>
      <section className="mx-auto max-w-[1400px] px-5 py-8 lg:px-9 lg:py-11">
        <div className="dashboard-welcome">
          <div><div className="dashboard-kicker"><span className="eyebrow-dot" /> YOUR ACADEMIC WORKSPACE</div><h1>Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1><p>{admin ? 'Your institute, at a glance. Choose an area to get started.' : 'Your academic workspace is ready when you are.'}</p></div>
          <div className="welcome-mark"><GraduationCap size={32} /><span>EDUSMART / 01</span></div>
        </div>
        {admin ? <>
          <div className="dashboard-stats"><Stat label="Students" value={stats.students ?? '—'} detail="Student records" icon={Users} /><Stat label="Teachers" value={stats.teachers ?? '—'} detail="Teaching team" icon={School} /><Stat label="Programs" value={stats.programs ?? '—'} detail="Academic programs" icon={GraduationCap} /><Stat label="AI predictions" value={stats.predictions ?? '—'} detail="Risk insights" icon={Brain} /></div>
          {statsError && <p role="status" className="mt-3 text-sm text-amber-800">{statsError}</p>}
          <div className="section-heading"><div><span>YOUR TOOLKIT</span><h2>Everything in its place.</h2></div><p>Choose a workspace to manage your institute.</p></div>
          <div className="dashboard-groups">{grouped.map((group) => <section className="module-group" key={group.category}><div className="group-heading"><span>{group.category}</span><i /></div><div className="module-grid">{group.items.map((module) => <Module key={module.title} {...module} onClick={() => onNavigate(module.page)} />)}</div></section>)}</div>
        </> : <div className="mt-8 max-w-lg"><Module title="Academic Workspace" description="Open your role-specific academic dashboard." icon={ClipboardCheck} category="YOUR SPACE" onClick={() => onNavigate('role')} /></div>}
      </section>
      <footer className="dashboard-footer"><span>EduSmart AI</span><span>Every learner deserves the chance to thrive.</span></footer>
    </main>
  )
}

function Stat({ label, value, detail, icon: Icon }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div><ArrowUpRight size={16} className="stat-arrow" /></div>
}

function Module({ title, description, icon: Icon, category, onClick }) {
  return <button onClick={onClick} className="module-card"><div className="module-card-top"><div className="module-icon"><Icon size={20} /></div><ArrowUpRight size={17} className="module-arrow" /></div><span className="module-category">{category}</span><h3>{title}</h3><p>{description}</p><span className="module-open">Open workspace <span>→</span></span></button>
}

function Brand() {
  return <div className="brand-lockup"><img className="brand-symbol" src="/edusmart-mark.svg" alt="" aria-hidden="true" /><div><p className="brand-name">EduSmart<span> AI</span></p><p className="brand-caption">LEARNING, IN FOCUS</p></div></div>
}

export default App
