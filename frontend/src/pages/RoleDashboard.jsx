import { useEffect, useState } from 'react'
import { ArrowLeft, Brain, ClipboardCheck, GraduationCap, TrendingUp } from 'lucide-react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export default function RoleDashboard({ user, onBack }) {
  const [records, setRecords] = useState({ marks: [], attendance: [], predictions: [] })
  const [student, setStudent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'student') return

    const load = async () => {
      try {
        const studentSnap = await getDocs(
          query(collection(db, 'students'), where('userId', '==', user.uid))
        )

        if (studentSnap.empty) {
          setStudent(null)
          setRecords({ marks: [], attendance: [], predictions: [] })
          setError('No student profile is linked to this account yet.')
          return
        }

        const studentDoc = studentSnap.docs[0]
        const studentData = { id: studentDoc.id, ...studentDoc.data() }
        setStudent(studentData)

        const [marksSnap, attendanceSnap, predictionsSnap] = await Promise.all([
          getDocs(query(collection(db, 'marks'), where('studentId', '==', studentDoc.id))),
          getDocs(query(collection(db, 'attendance'), where('studentId', '==', studentDoc.id))),
          getDocs(query(collection(db, 'predictions'), where('studentId', '==', studentDoc.id))),
        ])

        setRecords({
          marks: marksSnap.docs.map(x => x.data()),
          attendance: attendanceSnap.docs.map(x => x.data()),
          predictions: predictionsSnap.docs.map(x => x.data()),
        })
        setError('')
      } catch (e) {
        setError(e.message)
      }
    }

    load()
  }, [user])

  const avg = items =>
    items.length
      ? (items.reduce((a, x) => a + Number(x.value || 0), 0) / items.length).toFixed(1)
      : '—'

  const latestPrediction = records.predictions.at(-1)
  const isStudent = user?.role === 'student'

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900 p-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="font-bold">{isStudent ? 'Student Dashboard' : 'Teacher Dashboard'}</h1>
            <p className="text-xs text-slate-500">{student?.name || user?.name || user?.email}</p>
          </div>
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2">
            <ArrowLeft size={16} />Back
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl p-6">
        {error && <p className="mb-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        {isStudent ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card label="Average Marks" value={`${avg(records.marks)}%`} icon={<GraduationCap />} />
              <Card label="Attendance" value={`${avg(records.attendance)}%`} icon={<ClipboardCheck />} />
              <Card label="Assessments" value={records.marks.length} icon={<TrendingUp />} />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Brain /><h2 className="font-semibold">Latest AI Risk</h2>
                </div>
                <p className="mt-5 text-4xl font-bold">{latestPrediction?.riskLevel || '—'}</p>
                {latestPrediction && (
                  <div className="mt-3 space-y-2 text-sm text-slate-400">
                    <p>Model: {latestPrediction.model || 'Random Forest'}</p>
                    <p>Confidence: {latestPrediction.confidence ?? '—'}%</p>
                    <p>Attendance: {latestPrediction.features?.attendance ?? '—'}%</p>
                    <p>Average marks: {latestPrediction.features?.averageMarks ?? '—'}%</p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ClipboardCheck /><h2 className="font-semibold">Academic Insight</h2>
                </div>
                <p className="mt-4 text-slate-400">
                  Your dashboard summarizes the academic records currently stored for your student account.
                  Risk prediction uses attendance, marks, recent trend and missed assessments.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-xl font-semibold">Teacher workspace</h2>
            <p className="mt-2 text-slate-400">
              Use Attendance & Marks to record student performance and generate AI risk predictions.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function Card({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3 text-emerald-400">
        {icon}<span className="text-sm text-slate-400">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  )
}
