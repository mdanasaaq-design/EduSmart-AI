import { useState } from 'react'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore'
import { AlertTriangle, Database, RefreshCw, Trash2 } from 'lucide-react'
import { db } from '../firebase'

const DEMO = 'edusmart_demo_'
const teacherUid = 'edusmart_demo_auth_uid_not_real'
const branchId = DEMO + 'branch_main'
const programId = DEMO + 'program_cse_ai'
const yearId = DEMO + 'year_2026'
const classAId = DEMO + 'class_cse_ai_2a'
const classBId = DEMO + 'class_cse_ai_2b'
const sectionAId = DEMO + 'section_a'
const sectionBId = DEMO + 'section_b'
const teacherId = DEMO + 'teacher_01'

const classes = [
  { id: classAId, name: 'DEMO — CSE-AI Year 2A', code: 'DEMO-CSEAI-2A', programId, programName: 'DEMO — B.Tech Computer Science & AI', academicYearId: yearId, academicYearName: 'DEMO — 2026–2027', branchId, branchName: 'DEMO — Main Campus' },
  { id: classBId, name: 'DEMO — CSE-AI Year 2B', code: 'DEMO-CSEAI-2B', programId, programName: 'DEMO — B.Tech Computer Science & AI', academicYearId: yearId, academicYearName: 'DEMO — 2026–2027', branchId, branchName: 'DEMO — Main Campus' },
]
const sections = [
  { id: sectionAId, name: 'A', code: 'DEMO-A', classId: classAId, className: classes[0].name },
  { id: sectionBId, name: 'B', code: 'DEMO-B', classId: classBId, className: classes[1].name },
]
const subjects = [
  { id: DEMO + 'subject_web', name: 'DEMO — Web Technologies', code: 'DEMO-WT', credits: 3 },
  { id: DEMO + 'subject_dbms', name: 'DEMO — Database Systems', code: 'DEMO-DBMS', credits: 4 },
  { id: DEMO + 'subject_ai', name: 'DEMO — Artificial Intelligence', code: 'DEMO-AI', credits: 3 },
]
const studentSeeds = [
  { id: DEMO + 'student_01', name: 'DEMO — Aarya Sharma', admissionNumber: 'DEMO-2026-001', classIndex: 0, attendance: 96, marks: 89, trend: 8, missed: 0, risk: 'Low', confidence: 83 },
  { id: DEMO + 'student_02', name: 'DEMO — Vihaan Reddy', admissionNumber: 'DEMO-2026-002', classIndex: 0, attendance: 91, marks: 84, trend: 5, missed: 1, risk: 'Low', confidence: 78 },
  { id: DEMO + 'student_03', name: 'DEMO — Anaya Patel', admissionNumber: 'DEMO-2026-003', classIndex: 0, attendance: 82, marks: 72, trend: 1, missed: 2, risk: 'Medium', confidence: 71 },
  { id: DEMO + 'student_04', name: 'DEMO — Arjun Kumar', admissionNumber: 'DEMO-2026-004', classIndex: 1, attendance: 76, marks: 65, trend: -4, missed: 3, risk: 'Medium', confidence: 69 },
  { id: DEMO + 'student_05', name: 'DEMO — Diya Nair', admissionNumber: 'DEMO-2026-005', classIndex: 1, attendance: 61, marks: 48, trend: -12, missed: 6, risk: 'High', confidence: 88 },
]
const demoDate = new Date('2026-10-05T09:00:00.000Z')

function buildDemoDocuments() {
  const docs = [
    { collection: 'branches', id: branchId, data: { name: 'DEMO — Main Campus', code: 'DEMO-MAIN', location: 'Synthetic demo location' } },
    { collection: 'programs', id: programId, data: { name: 'DEMO — B.Tech Computer Science & AI', code: 'DEMO-CSEAI', type: 'Engineering', branchId, branchName: 'DEMO — Main Campus' } },
    { collection: 'academicYears', id: yearId, data: { name: 'DEMO — 2026–2027', startYear: 2026, endYear: 2027, status: 'Active' } },
    ...classes.map(item => ({ collection: 'classes', id: item.id, data: item })),
    ...sections.map(item => ({ collection: 'sections', id: item.id, data: item })),
    ...subjects.map(item => ({ collection: 'subjects', id: item.id, data: item })),
    { collection: 'teachers', id: teacherId, data: { name: 'DEMO — Kavya Rao', employeeId: 'DEMO-T-001', email: 'demo.teacher@example.com', phone: '0000000000', userId: teacherUid } },
  ]

  studentSeeds.forEach((student, index) => {
    const currentClass = classes[student.classIndex]
    const section = sections[student.classIndex]
    docs.push({
      collection: 'students',
      id: student.id,
      data: {
        name: student.name,
        admissionNumber: student.admissionNumber,
        email: `student${index + 1}@example.com`,
        phone: '0000000000',
        userId: '',
        gender: ['Female', 'Male', 'Female', 'Male', 'Female'][index],
        dateOfBirth: ['2007-04-12', '2007-09-23', '2007-02-18', '2007-11-07', '2007-06-30'][index],
        guardianName: 'DEMO — Parent/Guardian',
        status: 'Active',
        currentClassId: currentClass.id,
        currentSectionId: section.id,
        currentAcademicYearId: yearId,
        currentClassName: currentClass.name,
        currentSectionName: section.name,
        currentAcademicYearName: 'DEMO — 2026–2027',
      },
    })
    const enrollmentId = `${student.id}__${currentClass.id}__${yearId}`
    docs.push({
      collection: 'enrollments',
      id: enrollmentId,
      data: {
        studentId: student.id, studentUserId: '', studentName: student.name,
        admissionNumber: student.admissionNumber, academicYearId: yearId,
        academicYearName: 'DEMO — 2026–2027', classId: currentClass.id,
        className: currentClass.name, sectionId: section.id, sectionName: section.name,
        status: 'Active', createdAt: demoDate,
      },
    })

    subjects.forEach((subject, subjectIndex) => {
      const variation = (subjectIndex - 1) * 3
      const attendanceValue = Math.max(0, Math.min(100, student.attendance + variation))
      const markValue = Math.max(0, Math.min(100, student.marks + variation))
      const common = {
        studentId: student.id, studentUserId: '', studentName: student.name,
        classId: currentClass.id, sectionId: section.id, academicYearId: yearId,
        subjectId: subject.id, subjectName: subject.name, createdAt: new Date(demoDate.getTime() + subjectIndex * 86400000),
      }
      docs.push({
        collection: 'attendance',
        id: `${DEMO}attendance_${index + 1}_${subjectIndex + 1}`,
        data: { ...common, value: attendanceValue, type: 'attendance', recordedBy: 'demo-seed' },
      })
      docs.push({
        collection: 'marks',
        id: `${DEMO}marks_${index + 1}_${subjectIndex + 1}`,
        data: { ...common, value: markValue, type: 'marks', recordedBy: 'demo-seed' },
      })
      docs.push({
        collection: 'assessments',
        id: `${DEMO}assessment_${index + 1}_${subjectIndex + 1}`,
        data: { ...common, name: `DEMO — Assessment ${subjectIndex + 1}`, maxScore: 100, score: markValue, status: 'Completed' },
      })
    })

    const commonInsight = {
      studentId: student.id, studentUserId: '', studentName: student.name,
      classId: currentClass.id, sectionId: section.id, academicYearId: yearId,
      subjectId: subjects[1].id, createdAt: new Date(demoDate.getTime() + index * 3600000),
      generatedBy: 'demo-seed',
    }
    docs.push({
      collection: 'predictions',
      id: `${DEMO}prediction_${index + 1}`,
      data: {
        ...commonInsight, riskLevel: student.risk, confidence: student.confidence,
        features: { attendance: student.attendance, averageMarks: student.marks, recentTrend: student.trend, missedAssessments: student.missed },
        model: 'Random Forest', demoNote: 'Synthetic sample output; not a live model evaluation.',
      },
    })
    const text = student.risk === 'High'
      ? 'DEMO — Review attendance, identify learning barriers, and arrange a supportive academic check-in.'
      : student.risk === 'Medium'
        ? 'DEMO — Monitor attendance and upcoming assessments; offer help with topics needing practice.'
        : 'DEMO — Current sample indicators look steady; continue regular feedback and study habits.'
    docs.push({
      collection: 'recommendations',
      id: `${DEMO}recommendation_${index + 1}`,
      data: { ...commonInsight, riskLevel: student.risk, text, demoNote: 'Synthetic sample recommendation.' },
    })
  })

  classes.forEach((academicClass) => {
    subjects.forEach((subject) => {
      const assignmentId = `${teacherUid}__${subject.id}__${academicClass.id}`
      docs.push({
        collection: 'teacherAssignments',
        id: assignmentId,
        data: {
          teacherId, teacherUserId: teacherUid, teacherName: 'DEMO — Kavya Rao',
          subjectId: subject.id, subjectName: subject.name, classId: academicClass.id,
          className: academicClass.name, createdAt: demoDate,
        },
      })
    })
    docs.push({
      collection: 'teacherClassAccess',
      id: `${teacherUid}__${academicClass.id}`,
      data: { teacherUserId: teacherUid, teacherId, teacherName: 'DEMO — Kavya Rao', classId: academicClass.id, className: academicClass.name, updatedAt: demoDate },
    })
  })

  return docs.map(item => ({
    ...item,
    data: { ...item.data, demoData: true, demoLabel: 'Synthetic test data', createdAt: item.data.createdAt || demoDate, updatedAt: demoDate },
  }))
}

export default function DemoDataTools() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function seed() {
    if (!window.confirm('Add clearly labelled synthetic demo records to Firebase project edusmart-ai-c4692? Existing records will not be overwritten. No Authentication accounts or user profiles will be created.')) return
    setBusy(true)
    setMessage('')
    setError('')
    try {
      const docs = buildDemoDocuments()
      const existing = await Promise.all(docs.map(async item => {
        const snapshot = await getDoc(doc(db, item.collection, item.id))
        return snapshot.exists() ? { item, data: snapshot.data() } : null
      }))
      const conflict = existing.find(row => row && row.data.demoData !== true)
      if (conflict) throw new Error(`Safety stop: ${conflict.item.collection}/${conflict.item.id} already exists and is not tagged as demo data. No records were written.`)
      const batch = writeBatch(db)
      docs.forEach(item => batch.set(doc(db, item.collection, item.id), item.data))
      await batch.commit()
      setMessage(`Loaded ${docs.length} synthetic demo records across academic setup, students, attendance, marks, assignments and risk insights. Reload the dashboard to refresh its totals.`)
    } catch (e) {
      setError(e.message || 'Demo data could not be loaded. No success was confirmed.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm('Remove only EduSmart demo records tagged demoData=true from the connected Firebase project? Real records and Authentication accounts are not targeted.')) return
    setBusy(true)
    setMessage('')
    setError('')
    try {
      const docs = buildDemoDocuments()
      const existing = await Promise.all(docs.map(async item => {
        const ref = doc(db, item.collection, item.id)
        const snapshot = await getDoc(ref)
        return snapshot.exists() && snapshot.data().demoData === true ? ref : null
      }))
      const refs = existing.filter(Boolean)
      for (let start = 0; start < refs.length; start += 450) {
        const batch = writeBatch(db)
        refs.slice(start, start + 450).forEach(ref => batch.delete(ref))
        await batch.commit()
      }
      setMessage(`Removed ${refs.length} tagged demo records. Real records were left untouched.`)
    } catch (e) {
      setError(e.message || 'Demo cleanup could not be completed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-[#428475]/25 bg-white/80 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-[#89D7B7]/30 p-3 text-[#1A312C]"><Database size={21} /></span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-[#1A312C]">Demo data lab</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Populate the site with labelled synthetic records to test the academic workflows and analytics. This does not create login accounts, change security rules, or call AI services.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={seed} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#1A312C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#285047] disabled:opacity-50"><RefreshCw size={16} />{busy ? 'Working…' : 'Load demo data'}</button>
        <button type="button" onClick={remove} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={16} />Remove demo data</button>
      </div>
      <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500"><AlertTriangle size={14} className="mt-0.5 shrink-0" />Demo records are stored in your connected Firebase database and labelled. The teacher UID is deliberately fake, so teacher sign-in is not simulated.</p>
      {message && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
    </section>
  )
}
