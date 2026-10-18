import { useEffect, useMemo, useState } from 'react'
import { addDoc, collection, doc, getDocs, query, serverTimestamp, where, writeBatch } from 'firebase/firestore'
import { ArrowLeft, Brain, Save, TrendingDown, TrendingUp } from 'lucide-react'
import { db } from '../firebase'
import { chunkArray } from '../utils/chunkArray'
import { predict, validateModel } from '../ml/modelInference'

function rows(snapshot) {
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
}
function uniqueRows(items) {
  return [...new Map(items.map(item => [item.id, item])).values()]
}
async function loadModel() {
  const response = await fetch('/model.json')
  if (!response.ok) throw new Error('Unable to load the Random Forest model.')
  const model = await response.json()
  if (!validateModel(model)) {
    throw new Error('The Random Forest model file is invalid or uses an unsupported class order.')
  }
  return model
}

export default function AcademicRecords({ user, onBack }) {
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [marks, setMarks] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [studentId, setStudentId] = useState('')
  const [enrollmentId, setEnrollmentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [att, setAtt] = useState('')
  const [mark, setMark] = useState('')
  const [model, setModel] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setMsg('')
      try {
        const modelPromise = loadModel()
        if (user?.role === 'admin') {
          const [studentSnap, subjectSnap, enrollmentSnap, markSnap, attendanceSnap, loadedModel] = await Promise.all([
            getDocs(collection(db, 'students')),
            getDocs(collection(db, 'subjects')),
            getDocs(collection(db, 'enrollments')),
            getDocs(collection(db, 'marks')),
            getDocs(collection(db, 'attendance')),
            modelPromise,
          ])
          if (cancelled) return
          setStudents(rows(studentSnap))
          setSubjects(rows(subjectSnap))
          setEnrollments(rows(enrollmentSnap))
          setMarks(rows(markSnap))
          setAttendance(rows(attendanceSnap))
          setAssignments([])
          setModel(loadedModel)
          return
        }

        if (user?.role !== 'teacher') throw new Error('Only administrators and teachers can record academic performance.')
        const assignmentSnap = await getDocs(query(collection(db, 'teacherAssignments'), where('teacherUserId', '==', user.uid)))
        const teacherAssignments = rows(assignmentSnap)
        const classIds = [...new Set(teacherAssignments.map(item => item.classId).filter(Boolean))]
        if (!classIds.length) {
          const loadedModel = await modelPromise
          if (cancelled) return
          setAssignments([])
          setStudents([])
          setSubjects([])
          setEnrollments([])
          setMarks([])
          setAttendance([])
          setModel(loadedModel)
          setMsg('No classes are assigned to your teacher account yet. Ask the administrator to assign a class and subject.')
          return
        }
        const classIdBatches = chunkArray(classIds, 30)
        const [studentSnaps, enrollmentSnaps, subjectSnap, loadedModel] = await Promise.all([
          Promise.all(classIdBatches.map(batch => getDocs(query(
            collection(db, 'students'), where('currentClassId', 'in', batch),
          )))),
          Promise.all(classIdBatches.map(batch => getDocs(query(
            collection(db, 'enrollments'), where('classId', 'in', batch),
          )))),
          getDocs(collection(db, 'subjects')),
          modelPromise,
        ])
        const recordResults = await Promise.all(teacherAssignments.map(async assignment => {
          const constraints = [where('classId', '==', assignment.classId), where('subjectId', '==', assignment.subjectId)]
          const [marksSnap, attendanceSnap] = await Promise.all([
            getDocs(query(collection(db, 'marks'), ...constraints)),
            getDocs(query(collection(db, 'attendance'), ...constraints)),
          ])
          return { marks: rows(marksSnap), attendance: rows(attendanceSnap) }
        }))
        if (cancelled) return
        setAssignments(teacherAssignments)
        setStudents(uniqueRows(studentSnaps.flatMap(snapshot => rows(snapshot))))
        setEnrollments(uniqueRows(enrollmentSnaps.flatMap(snapshot => rows(snapshot))))
        setSubjects(rows(subjectSnap))
        setMarks(uniqueRows(recordResults.flatMap(item => item.marks)))
        setAttendance(uniqueRows(recordResults.flatMap(item => item.attendance)))
        setModel(loadedModel)
      } catch (error) {
        if (!cancelled) setMsg(error.message || 'Unable to load academic records. Check role access and Firebase deployment.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [user?.uid, user?.role])

  const allowedSubjectIds = useMemo(() => new Set(assignments.map(item => item.subjectId)), [assignments])
  const visibleSubjects = user?.role === 'admin' ? subjects : subjects.filter(item => allowedSubjectIds.has(item.id))
  const student = students.find(item => item.id === studentId)
  const enrollment = enrollments.find(item => item.id === enrollmentId && item.studentId === studentId && item.status === 'Active')
  const studentMarks = useMemo(() => marks.filter(item => item.studentId === studentId), [marks, studentId])
  const studentAttendance = useMemo(() => attendance.filter(item => item.studentId === studentId), [attendance, studentId])
  const avgMarks = studentMarks.length
    ? (studentMarks.reduce((sum, item) => sum + Number(item.value || 0), 0) + (mark === '' ? 0 : Number(mark))) / (studentMarks.length + (mark !== '' ? 1 : 0))
    : Number(mark || 0)
  const avgAttendance = studentAttendance.length
    ? (studentAttendance.reduce((sum, item) => sum + Number(item.value || 0), 0) + (att === '' ? 0 : Number(att))) / (studentAttendance.length + (att !== '' ? 1 : 0))
    : Number(att || 0)
  const ordered = [...studentMarks].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
  const trend = ordered.length > 1 ? Number(ordered.at(-1).value) - Number(ordered[0].value) : 0
  const missed = Math.max(0, 5 - studentMarks.length)
  const hasAttendance = studentAttendance.length > 0 || att !== ''
  const hasMarks = studentMarks.length > 0 || mark !== ''
  const prediction = model && studentId && hasAttendance && hasMarks
    ? predict(model, [avgAttendance, avgMarks, trend, missed])
    : null

  const save = async (type, value) => {
    if (!student || !subjectId || !enrollment) return setMsg('Select an enrolled student, choose a subject, and select an active enrollment.')
    if (user?.role === 'teacher' && !assignments.some(item => item.classId === enrollment.classId && item.subjectId === subjectId)) {
      return setMsg('Your teacher account is not assigned to this class and subject.')
    }
    if (value === '') return setMsg('Enter a value before saving.')
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100) return setMsg('Enter a value between 0 and 100.')
    setSaving(true)
    setMsg('')
    try {
      const subject = visibleSubjects.find(item => item.id === subjectId)
      const record = {
        studentId,
        studentUserId: student.userId || '',
        studentName: student.name || '',
        classId: enrollment.classId || '',
        sectionId: enrollment.sectionId || '',
        academicYearId: enrollment.academicYearId || '',
        subjectId,
        subjectName: subject?.name || '',
        value: numericValue,
        type,
        recordedBy: user?.uid || '',
        createdAt: serverTimestamp(),
      }
      const ref = await addDoc(collection(db, type), record)
      const optimistic = { ...record, id: ref.id, createdAt: { seconds: Date.now() / 1000 } }
      if (type === 'marks') {
        setMarks(current => [...current, optimistic])
        setMark('')
      } else {
        setAttendance(current => [...current, optimistic])
        setAtt('')
      }
      setMsg(type === 'marks' ? 'Marks saved.' : 'Attendance saved.')
    } catch (error) {
      setMsg(error.message || 'Unable to save the academic record.')
    } finally {
      setSaving(false)
    }
  }

  const savePrediction = async () => {
    if (!prediction) return setMsg('Enter at least one attendance value and one marks value before generating a prediction.')
    if (!enrollment || !subjectId) return setMsg('Select an active enrollment and an assigned subject before saving the prediction.')
    if (user?.role === 'teacher' && !assignments.some(item => item.classId === enrollment.classId && item.subjectId === subjectId)) {
      return setMsg('Your teacher account is not assigned to this class and subject.')
    }
    setSaving(true)
    setMsg('')
    try {
      const recommendation = prediction.label === 'High'
        ? 'Improve attendance, review weak subjects and seek academic support.'
        : prediction.label === 'Medium'
          ? 'Monitor attendance and upcoming assessments closely.'
          : 'Current academic indicators are comparatively stable.'
      const common = {
        studentId,
        studentUserId: student?.userId || '',
        studentName: student?.name || '',
        classId: enrollment.classId || '',
        sectionId: enrollment.sectionId || '',
        academicYearId: enrollment.academicYearId || '',
        subjectId,
        createdAt: serverTimestamp(),
        generatedBy: user?.uid || '',
      }
      const batch = writeBatch(db)
      batch.set(doc(collection(db, 'predictions')), {
        ...common,
        riskLevel: prediction.label,
        confidence: prediction.confidence,
        features: {
          attendance: Number(avgAttendance.toFixed(2)),
          averageMarks: Number(avgMarks.toFixed(2)),
          recentTrend: Number(trend.toFixed(2)),
          missedAssessments: missed,
        },
        model: 'Random Forest',
      })
      batch.set(doc(collection(db, 'recommendations')), {
        ...common,
        riskLevel: prediction.label,
        text: recommendation,
      })
      await batch.commit()
      setMsg('AI prediction and recommendation saved.')
    } catch (error) {
      setMsg(error.message || 'Unable to save the prediction.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900 p-5">
        <div className="mx-auto flex max-w-7xl justify-between">
          <div><h1 className="font-bold">Attendance & Marks</h1><p className="text-xs text-slate-500">Academic records and trained Random Forest risk prediction</p></div>
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2"><ArrowLeft size={16}/>Dashboard</button>
        </div>
      </nav>
      <section className="mx-auto max-w-7xl p-6">
        {loading && <p role="status" className="mb-5 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">Loading student records, enrollments and the AI model…</p>}
        {msg && <p role={loading ? 'status' : 'alert'} className="mb-5 rounded-lg bg-slate-900 p-3 text-sm text-slate-300">{msg}</p>}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
            <h2 className="mb-5 font-semibold">Record student performance</h2>
            <select value={studentId} onChange={event => { setStudentId(event.target.value); setEnrollmentId(''); setAtt(''); setMark(''); setMsg('') }} className="mb-3 w-full rounded-lg bg-slate-950 p-3">
              <option value="">Select student</option>
              {students.map(item => <option key={item.id} value={item.id}>{item.name} · {item.admissionNumber || item.rollNo || ''}</option>)}
            </select>
            <select value={enrollmentId} onChange={event => setEnrollmentId(event.target.value)} disabled={!studentId} className="mb-3 w-full rounded-lg bg-slate-950 p-3">
              <option value="">Select active enrollment</option>
              {enrollments.filter(item => item.studentId === studentId && item.status === 'Active').map(item => <option key={item.id} value={item.id}>{item.className || 'Class'} · {item.sectionName || 'Section'} · {item.academicYearName || 'Academic year'}</option>)}
            </select>
            <select value={subjectId} onChange={event => setSubjectId(event.target.value)} className="mb-5 w-full rounded-lg bg-slate-950 p-3">
              <option value="">Select subject</option>
              {visibleSubjects.map(item => <option key={item.id} value={item.id}>{item.name} · {item.code || ''}</option>)}
            </select>
            <div className="grid gap-4 sm:grid-cols-2">
              <ValueCard title="Attendance %" value={att} setValue={setAtt} onSave={() => void save('attendance', att)} saving={saving} />
              <ValueCard title="Marks %" value={mark} setValue={setMark} onSave={() => void save('marks', mark)} saving={saving} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2 text-emerald-400"><Brain/><h2 className="font-semibold">AI Risk Prediction</h2></div>
            {studentId ? <>
              <p className="mt-5 text-center text-sm text-slate-400">{student?.name}</p>
              <p className="mt-2 text-center text-4xl font-bold">{prediction?.label || '—'}</p>
              {prediction && <>
                <p className="mt-2 text-center text-xs text-slate-500">Model vote share: {prediction.confidence}% (not calibrated probability)</p>
                <div className="mt-6 space-y-3 text-sm"><p>Attendance <b>{avgAttendance.toFixed(1)}%</b></p><p>Average marks <b>{avgMarks.toFixed(1)}%</b></p><p className="flex items-center gap-2">Recent trend <b>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</b>{trend > 0 ? <TrendingUp size={16}/> : trend < 0 ? <TrendingDown size={16}/> : null}</p><p>Missed assessments <b>{missed}</b></p></div>
                <p className="mt-5 text-sm text-slate-400">{prediction.label === 'High' ? 'Improve attendance, review weak subjects and seek academic support.' : prediction.label === 'Medium' ? 'Monitor attendance and upcoming assessments closely.' : 'Current academic indicators are comparatively stable.'}</p>
                <button onClick={() => void savePrediction()} disabled={saving} className="mt-5 w-full rounded-lg bg-emerald-500 py-2.5 font-semibold text-slate-950 disabled:opacity-50">{saving ? 'Saving…' : 'Save AI Prediction'}</button>
              </>}
            </> : <p className="mt-8 text-sm text-slate-500">Select a student to calculate risk.</p>}
          </div>
        </div>
        <p className="mt-5 text-xs text-slate-500">Predictions use a synthetic-data demo model and are advisory only. Records can be entered only for the role's permitted class/subject scope.</p>
      </section>
    </main>
  )
}

function ValueCard({ title, value, setValue, onSave, saving }) {
  return <div className="rounded-xl border border-slate-800 p-4"><p className="mb-2 text-sm text-slate-400">{title}</p><input aria-label={title} type="number" min="0" max="100" step="0.1" value={value} onChange={event => setValue(event.target.value)} className="mb-3 w-full rounded-lg bg-slate-950 p-3"/><button onClick={onSave} disabled={saving} className="inline-flex w-full justify-center gap-2 rounded-lg bg-emerald-500 p-2.5 font-semibold text-slate-950 disabled:opacity-50"><Save size={16}/>Save</button></div>
}
