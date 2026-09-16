import { useState } from 'react'
import { BarChart3, Brain, Building2, CalendarDays, GraduationCap, LayoutDashboard, LogOut, School, ShieldCheck, Users } from 'lucide-react'
import Login from './pages/auth/Login'
import Branches from './pages/admin/Branches'
import Programs from './pages/admin/Programs'
import AcademicYears from './pages/admin/AcademicYears'
import { logoutUser } from './services/authService'

const adminModules = [
  { title: 'Branches', description: 'Manage institute branches and locations.', icon: Building2, page: 'branches' },
  { title: 'Programs', description: 'Manage school, junior college and degree programs.', icon: GraduationCap, page: 'programs' },
  { title: 'Academic Years', description: 'Set up academic years and sessions.', icon: CalendarDays, page: 'academic-years' },
  { title: 'Classes & Sections', description: 'Organize classes, sections and academic structure.', icon: LayoutDashboard },
  { title: 'Students', description: 'Add and manage student profiles and enrollments.', icon: Users },
  { title: 'Teachers', description: 'Manage teacher profiles and assignments.', icon: Users },
  { title: 'Subjects', description: 'Create subjects and connect them to classes.', icon: School },
  { title: 'Analytics', description: 'View attendance and academic performance insights.', icon: BarChart3 },
]

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)

  function handleLogin(authenticatedUser) { setUser(authenticatedUser); setPage('dashboard') }
  async function handleLogout() { await logoutUser(); setUser(null); setPage('home') }

  if (page === 'login') return <Login onLogin={handleLogin} onBack={() => setPage('home')} />
  if (page === 'branches') return <Branches onBack={() => setPage('dashboard')} />
  if (page === 'programs') return <Programs onBack={() => setPage('dashboard')} />
  if (page === 'academic-years') return <AcademicYears onBack={() => setPage('dashboard')} />
  if (page === 'dashboard') return <Dashboard user={user} onLogout={handleLogout} onNavigate={setPage} />
  return <LandingPage onSignIn={() => setPage('login')} onExplore={() => setPage('login')} />
}

function LandingPage({ onSignIn, onExplore }) {
  return <main className="min-h-screen bg-slate-950 text-white"><nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8"><Brand /><button onClick={onSignIn} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300">Sign In</button></nav><section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:px-8 lg:pt-24"><div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300"><Brain size={16} /> AI-powered academic insights</div><h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">Smarter institute management. <span className="text-emerald-400">Better student outcomes.</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">EduSmart AI brings academic management, attendance, assessments, performance analytics, and student risk prediction into one simple platform.</p><div className="mt-8 flex flex-wrap gap-4"><button onClick={onExplore} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">Explore Dashboard</button><a href="#features" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-500">View Features</a></div></div><div id="features" className="grid gap-4 sm:grid-cols-2"><FeatureCard icon={<Users />} title="Student Management" text="Profiles, enrollment, classes and academic structure." /><FeatureCard icon={<BarChart3 />} title="Performance Analytics" text="Track attendance, marks and academic trends." /><FeatureCard icon={<Brain />} title="AI Risk Prediction" text="Identify students who may need academic support." /><FeatureCard icon={<ShieldCheck />} title="Role-Based Access" text="Separate experiences for admins, teachers and students." /></div></section><footer className="border-t border-slate-800 bg-slate-900/50 px-6 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row"><p>EduSmart AI · College Mini Project</p><p>React · Tailwind CSS · Firebase · Scikit-learn</p></div></footer></main>
}

function Dashboard({ user, onLogout, onNavigate }) {
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'
  const isAdmin = user?.role === 'admin'
  return <main className="min-h-screen bg-slate-950 text-white"><nav className="border-b border-slate-800 bg-slate-900/80 px-6 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between"><Brand /><div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-medium">{user?.name || user?.email}</p><p className="text-xs text-emerald-400">{roleLabel}</p></div><button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"><LogOut size={16} /> Logout</button></div></div></nav><section className="mx-auto max-w-7xl px-6 py-8 lg:px-8"><div className="mb-8"><p className="text-sm font-medium text-emerald-400">{roleLabel} Dashboard</p><h1 className="mt-2 text-3xl font-bold">Welcome, {user?.name || 'User'}.</h1><p className="mt-2 text-slate-400">Manage your institute and monitor academic performance from one place.</p></div>{isAdmin ? <><div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard label="Students" value="0" icon={<Users />} /><StatCard label="Teachers" value="0" icon={<Users />} /><StatCard label="Programs" value="0" icon={<GraduationCap />} /><StatCard label="At Risk" value="0" icon={<Brain />} /></div><div className="mb-4"><h2 className="text-xl font-semibold">Administration</h2><p className="mt-1 text-sm text-slate-500">Set up the academic structure and manage institute data.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{adminModules.map((module) => <ModuleCard key={module.title} {...module} onClick={() => module.page && onNavigate(module.page)} />)}</div></> : <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8"><p className="text-slate-400">Your {roleLabel.toLowerCase()} dashboard will be available in the next module.</p></div>}</section></main>
}

function StatCard({ label, value, icon }) { return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">{icon}</div></div></div> }
function ModuleCard({ title, description, icon: Icon, onClick }) { return <button onClick={onClick} className={`group rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/40 ${!onClick ? 'cursor-default' : ''}`}><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 transition group-hover:bg-emerald-400 group-hover:text-slate-950"><Icon size={21} /></div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><p className="mt-4 text-xs font-medium text-emerald-400">{onClick ? 'Manage →' : 'Coming next'}</p></button> }
function Brand() { return <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950"><GraduationCap size={23} /></div><div><p className="text-lg font-bold tracking-tight">EduSmart AI</p><p className="text-xs text-slate-400">Institute Management System</p></div></div> }
function FeatureCard({ icon, title, text }) { return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-emerald-400/40"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">{icon}</div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div> }
export default App
