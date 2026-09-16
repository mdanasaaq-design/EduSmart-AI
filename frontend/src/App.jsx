import { BarChart3, GraduationCap, ShieldCheck, Users, Brain, ArrowRight } from 'lucide-react'

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
            <GraduationCap size={23} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">EduSmart AI</p>
            <p className="text-xs text-slate-400">Institute Management System</p>
          </div>
        </div>
        <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300">
          Sign In
        </button>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:px-8 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300">
            <Brain size={16} /> AI-powered academic insights
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Smarter institute management.{' '}
            <span className="text-emerald-400">Better student outcomes.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            EduSmart AI brings academic management, attendance, assessments, performance analytics, and student risk prediction into one simple platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
              Explore Dashboard <ArrowRight size={18} />
            </button>
            <button className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-500">
              View Features
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard icon={<Users />} title="Student Management" text="Profiles, enrollment, classes and academic structure." />
          <FeatureCard icon={<BarChart3 />} title="Performance Analytics" text="Track attendance, marks and academic trends." />
          <FeatureCard icon={<Brain />} title="AI Risk Prediction" text="Identify students who may need academic support." />
          <FeatureCard icon={<ShieldCheck />} title="Role-Based Access" text="Separate experiences for admins, teachers and students." />
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/50 px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>EduSmart AI · College Mini Project</p>
          <p>React · Tailwind CSS · Firebase · Scikit-learn</p>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-emerald-400/40">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">
        {icon}
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  )
}

export default App
