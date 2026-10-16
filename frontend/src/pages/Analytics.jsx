import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { ArrowLeft, BarChart3, Brain, Users, Sparkles, GraduationCap } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { db } from '../firebase'

export default function Analytics({ onBack }) {
  const [data, setData] = useState([])
  const [counts, setCounts] = useState({ students: 0, teachers: 0, predictions: 0 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all(['students', 'teachers', 'predictions'].map(name => getDocs(collection(db, name))))
      .then(([students, teachers, predictions]) => {
        const rows = predictions.docs.map(item => item.data())
        setCounts({ students: students.size, teachers: teachers.size, predictions: predictions.size })
        setData(['Low', 'Medium', 'High'].map(risk => ({ risk, count: rows.filter(item => item.riskLevel === risk).length })))
      })
      .catch(err => setError(err.message || 'Unable to load institute analytics.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="analytics-shell min-h-screen bg-slate-950 text-white">
      <nav className="analytics-nav">
        <div className="analytics-brand"><span><BarChart3 size={20} /></span><div><strong>Institute analytics</strong><small>INSIGHTS & PERFORMANCE</small></div></div>
        <button onClick={onBack} className="analytics-back"><ArrowLeft size={16} /> Dashboard home</button>
      </nav>
      <section className="analytics-content">
        <div className="analytics-welcome"><div><span className="analytics-eyebrow"><Sparkles size={13} /> DATA-LED OVERVIEW</span><h1>See the bigger picture.</h1><p>A high-level view of your institute records and the academic risk signals saved so far.</p></div><div className="analytics-mark"><GraduationCap size={26} /><span>EDUSMART / INSIGHTS</span></div></div>
        {error && <div role="alert" className="analytics-error">{error}</div>}
        <div className="analytics-stats">
          <Card icon={<Users size={19} />} label="Students" value={counts.students} detail="Student profiles" />
          <Card icon={<GraduationCap size={19} />} label="Teachers" value={counts.teachers} detail="Teaching team" />
          <Card icon={<Brain size={19} />} label="AI predictions" value={counts.predictions} detail="Saved risk insights" />
        </div>
        <article className="analytics-chart-card">
          <div className="analytics-chart-heading"><div className="analytics-chart-icon"><BarChart3 size={19} /></div><div><h2>Risk distribution</h2><p>Count of saved predictions by risk level</p></div><span className="analytics-chart-badge">MODEL OUTPUT</span></div>
          {loading ? <div className="analytics-chart-loading">Loading your institute data…</div> : <div className="analytics-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, right: 10, left: -16, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="#E3E8DF" vertical={false} /><XAxis dataKey="risk" axisLine={false} tickLine={false} tick={{ fill: '#6D7B73', fontSize: 12 }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6D7B73', fontSize: 11 }} /><Tooltip contentStyle={{ border: '1px solid rgba(26,49,44,.12)', borderRadius: 12, background: '#FFFCF5', color: '#1A312C', fontSize: 12 }} cursor={{ fill: 'rgba(137,215,183,.15)' }} /><Bar dataKey="count" name="Predictions" fill="#428475" radius={[7, 7, 0, 0]} maxBarSize={76} /></BarChart></ResponsiveContainer></div>}
          <div className="analytics-chart-note"><ShieldNote /> <span>Risk levels are model-generated indicators to support review, not definitive assessments of a student.</span></div>
        </article>
        <footer className="analytics-footer"><span>EduSmart AI</span><span>Clearer data. More thoughtful support.</span></footer>
      </section>
    </main>
  )
}
function Card({ icon, label, value, detail }) {
  return <article className="analytics-stat-card"><div className="analytics-stat-top"><span className="analytics-stat-icon">{icon}</span><span>{label}</span></div><strong>{value}</strong><p>{detail}</p></article>
}
function ShieldNote() { return <span className="analytics-note-icon"><Brain size={16} /></span> }
