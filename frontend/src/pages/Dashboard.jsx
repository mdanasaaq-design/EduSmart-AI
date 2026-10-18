import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { ArrowUpRight, BarChart3, Brain, Building2, CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, Link2, LogOut, School, ShieldCheck, Users } from 'lucide-react'
import { db } from '../firebase'
import Brand from '../components/Brand'

const modules = [
  { title: 'Branches', description: 'Manage institute locations and campuses.', icon: Building2, page: 'branches', category: 'INSTITUTE' },
  { title: 'Programs', description: 'Organize programs and qualifications.', icon: GraduationCap, page: 'programs', category: 'INSTITUTE' },
  { title: 'Academic Years', description: 'Keep sessions and academic calendars in sync.', icon: CalendarDays, page: 'academic-years', category: 'ACADEMICS' },
  { title: 'Classes & Sections', description: 'Build a clear structure for every cohort.', icon: LayoutDashboard, page: 'classes-sections', category: 'ACADEMICS' },
  { title: 'Students & Enrollments', description: 'Manage student records and class enrollment.', icon: Users, page: 'students', category: 'PEOPLE' },
  { title: 'Teachers', description: 'Maintain teacher profiles and details.', icon: Users, page: 'teachers', category: 'PEOPLE' },
  { title: 'Subjects', description: 'Keep subjects and course codes organized.', icon: School, page: 'subjects', category: 'ACADEMICS' },
  { title: 'Teacher Assignments', description: 'Connect teachers with classes and subjects.', icon: Link2, page: 'assignments', category: 'PEOPLE' },
  { title: 'User Access & Roles', description: 'Create teacher/student accounts and manage their workspace access.', icon: ShieldCheck, page: 'user-access', category: 'PEOPLE' },
  { title: 'Attendance & Marks', description: 'Record performance and generate risk insights.', icon: ClipboardCheck, page: 'records', category: 'INSIGHTS' },
  { title: 'Analytics', description: 'Explore institute metrics and risk patterns.', icon: BarChart3, page: 'analytics', category: 'INSIGHTS' },
]

export default function Dashboard({ user, onLogout, onNavigate }) {
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
        </> : <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2"><Module title={role === 'teacher' ? 'Teaching Workspace' : 'My Academic Workspace'} description={role === 'teacher' ? 'Review your assigned classes and subjects.' : 'View your own attendance, marks and academic insights.'} icon={ClipboardCheck} category="YOUR SPACE" onClick={() => onNavigate('role')} />{role === 'teacher' && <Module title="Attendance & Marks" description="Record attendance and marks for your assigned classes and generate a risk insight." icon={Brain} category="ACADEMIC RECORDS" onClick={() => onNavigate('records')} />}</div>}
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
