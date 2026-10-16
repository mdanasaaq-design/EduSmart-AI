import { useEffect, useState } from 'react'
import { ArrowLeft, Brain, ClipboardCheck, GraduationCap, TrendingUp, BookOpen, Sparkles, ShieldCheck, Activity } from 'lucide-react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export default function RoleDashboard({ user, onBack }) {
  const [records, setRecords] = useState({ marks: [], attendance: [], predictions: [], recommendations: [] })
  const [student, setStudent] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !['student', 'teacher'].includes(user.role)) {
      setLoading(false)
      return
    }
    const load = async () => {
      setLoading(true)
      try {
        if (user.role === 'teacher') {
          const assignmentSnap = await getDocs(query(collection(db, 'teacherAssignments'), where('teacherUserId', '==', user.uid)))
          setAssignments(assignmentSnap.docs.map(x => ({ id: x.id, ...x.data() })))
          setError('')
          return
        }
        const studentSnap = await getDocs(query(collection(db, 'students'), where('userId', '==', user.uid)))
        if (studentSnap.empty) {
          setStudent(null)
          setRecords({ marks: [], attendance: [], predictions: [], recommendations: [] })
          setError('No student profile is linked to this account yet.')
          return
        }
        const studentDoc = studentSnap.docs[0]
        setStudent({ id: studentDoc.id, ...studentDoc.data() })
        const [marksSnap, attendanceSnap, predictionsSnap, recommendationsSnap] = await Promise.all([
          getDocs(query(collection(db, 'marks'), where('studentUserId', '==', user.uid))),
          getDocs(query(collection(db, 'attendance'), where('studentUserId', '==', user.uid))),
          getDocs(query(collection(db, 'predictions'), where('studentUserId', '==', user.uid))),
          getDocs(query(collection(db, 'recommendations'), where('studentUserId', '==', user.uid))),
        ])
        setRecords({
          marks: marksSnap.docs.map(x => x.data()),
          attendance: attendanceSnap.docs.map(x => x.data()),
          predictions: predictionsSnap.docs.map(x => x.data()),
          recommendations: recommendationsSnap.docs.map(x => x.data()),
        })
        setError('')
      } catch (e) {
        setError(e.message || 'Unable to load your academic dashboard.')
      } finally { setLoading(false) }
    }
    void load()
  }, [user])

  const avg = items => items.length ? (items.reduce((a, x) => a + Number(x.value || 0), 0) / items.length).toFixed(1) : '—'
  // Firestore query results have no guaranteed chronological order unless explicitly ordered.
  // Sort by the persisted timestamp so the dashboard consistently shows the newest insight.
  const latestPrediction = [...records.predictions].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0]
  const latestRecommendation = [...records.recommendations].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0]
  const isStudent = user?.role === 'student'
  const displayName = student?.name || user?.name || user?.email || 'there'

  return (
    <main className="role-shell min-h-screen bg-slate-950 text-white">
      <nav className="role-nav">
        <div className="role-brand"><span className="role-brand-icon"><GraduationCap size={21} /></span><span><strong>EduSmart<span> AI</span></strong><small>LEARNING, IN FOCUS</small></span></div>
        <button onClick={onBack} className="role-back"><ArrowLeft size={16} /> Dashboard home</button>
      </nav>
      <section className="role-content">
        <div className="role-welcome">
          <div><span className="role-eyebrow"><Sparkles size={14} /> YOUR LEARNING SPACE</span><h1>{isStudent ? 'Your progress, at a glance.' : 'Welcome to your teaching space.'}</h1><p>{isStudent ? 'Hello ' + displayName.split(' ')[0] + ', here’s a thoughtful overview of your academic journey.' : 'A clearer view of student performance and the next steps that matter.'}</p></div>
          <div className="role-date-card"><span>YOUR ROLE</span><strong>{isStudent ? 'Student' : 'Teacher'}</strong><span className="role-date-sub"><ShieldCheck size={14} /> Secure workspace</span></div>
        </div>
        {error && <div role="alert" className="role-alert">{error}</div>}
        {loading ? <div className="role-loading"><span className="role-loader" /> Preparing your academic overview…</div> : isStudent ? (
          <>
            <div className="role-stat-grid">
              <Stat label="Average marks" value={avg(records.marks) === '—' ? '—' : avg(records.marks) + '%'} icon={<GraduationCap size={19} />} note="Across recorded assessments" />
              <Stat label="Attendance" value={avg(records.attendance) === '—' ? '—' : avg(records.attendance) + '%'} icon={<ClipboardCheck size={19} />} note="Based on saved attendance records" />
              <Stat label="Assessments" value={records.marks.length} icon={<TrendingUp size={19} />} note="Marks recorded to date" />
            </div>
            <div className="role-section-label"><div><span>ACADEMIC SNAPSHOT</span><h2>Your learning overview</h2></div><span className="role-section-tag"><Activity size={14} /> Live from your records</span></div>
            <div className="role-detail-grid">
              <article className="role-card role-risk-card">
                <div className="role-card-heading"><span className="role-card-icon"><Brain size={19} /></span><div><h3>Latest AI risk insight</h3><p>Model-assisted academic indicator</p></div></div>
                <div className="role-risk-result"><span className="role-risk-label">CURRENT RISK LEVEL</span><strong className={'risk-' + String(latestPrediction?.riskLevel || 'none').toLowerCase()}>{latestPrediction?.riskLevel || 'Not available'}</strong></div>
                {latestPrediction ? <div className="role-facts"><Fact label="Model" value={latestPrediction.model || 'Random Forest'} /><Fact label="Confidence" value={latestPrediction.confidence == null ? '—' : latestPrediction.confidence + '%'} /><Fact label="Attendance used" value={latestPrediction.features?.attendance == null ? '—' : latestPrediction.features.attendance + '%'} /><Fact label="Average marks used" value={latestPrediction.features?.averageMarks == null ? '—' : latestPrediction.features.averageMarks + '%'} /></div> : <p className="role-empty-note">No prediction has been recorded yet. Your dashboard will show the latest insight when one is available.</p>}
                {latestRecommendation && <div className="role-recommendation"><span>RECOMMENDED NEXT STEP</span><p>{latestRecommendation.text}</p></div>}
              </article>
              <article className="role-card role-insight-card">
                <div className="role-card-heading"><span className="role-card-icon"><BookOpen size={19} /></span><div><h3>How to read your overview</h3><p>A useful snapshot, not a final judgment</p></div></div>
                <p className="role-insight-copy">Your figures reflect academic records currently saved for your account. Use them to notice progress, spot gaps early, and start a conversation with your teacher when you need support.</p>
                <div className="role-insight-callout"><ShieldCheck size={18} /><span>AI risk indicators are decision-support signals. They should be interpreted alongside your circumstances and guidance from your institute.</span></div>
                <div className="role-mini-stats"><div><span>Marks records</span><strong>{records.marks.length}</strong></div><div><span>Attendance records</span><strong>{records.attendance.length}</strong></div><div><span>Saved insights</span><strong>{records.predictions.length}</strong></div></div>
              </article>
            </div>
          </>
        ) : (
          <article className="role-card role-teacher-card"><span className="role-card-icon"><ClipboardCheck size={21} /></span><h2>Your teaching workspace</h2><p>Here are the classes and subjects assigned to your account. Use these assignments to confirm your teaching scope with the institute administrator.</p><div className="role-teacher-note"><ShieldCheck size={17} /> Only assignments linked to your signed-in account are shown.</div><div className="mt-5 space-y-3">{assignments.length ? assignments.map(item => <div key={item.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{item.subjectName || 'Subject'}</h3><p className="mt-1 text-sm text-slate-400">{item.className || 'Class'}{item.sectionName ? ' · ' + item.sectionName : ''}</p></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">Assigned</span></div></div>) : <p className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">No teaching assignments are linked to this account yet. Ask your administrator to add your Firebase Auth UID to your teacher profile and create an assignment.</p>}</div></article>
        )}
        <footer className="role-footer"><span>EduSmart AI</span><span>Thoughtfully designed for better learning outcomes.</span></footer>
      </section>
    </main>
  )
}

function Stat({ label, value, icon, note }) {
  return <article className="role-stat-card"><div className="role-stat-top"><span className="role-stat-icon">{icon}</span><span className="role-stat-label">{label}</span></div><strong className="role-stat-value">{value}</strong><p>{note}</p></article>
}
function Fact({ label, value }) { return <div className="role-fact"><span>{label}</span><strong>{value}</strong></div> }
