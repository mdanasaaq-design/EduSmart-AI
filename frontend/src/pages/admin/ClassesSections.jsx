import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { getClasses } from '../../services/classService'
import { getSections } from '../../services/sectionService'

export default function ClassesSections({ onBack }) {
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getClasses(), getSections()])
      .then(([classData, sectionData]) => { setClasses(classData); setSections(sectionData) })
      .catch((err) => setError(err.message || 'Unable to load academic structure.'))
  }, [])

  return <main className="min-h-screen bg-slate-950 text-white">
    <nav className="border-b border-slate-800 bg-slate-900/80 px-6 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between"><div><h1 className="text-lg font-bold">Classes & Sections</h1><p className="text-xs text-slate-500">Academic structure</p></div><button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm"><ArrowLeft size={16} /> Dashboard</button></div></nav>
    <section className="mx-auto max-w-7xl px-6 py-8"><div className="grid gap-6 lg:grid-cols-2"><Panel title="Classes" count={classes.length}>{classes.map((x) => <Item key={x.id} name={x.name} code={x.code} detail={`${x.programName} · ${x.academicYearName}`} />)}</Panel><Panel title="Sections" count={sections.length}>{sections.map((x) => <Item key={x.id} name={x.name} code={x.code} detail={x.className} />)}</Panel></div>{error && <p className="mt-6 text-red-300">{error}</p>}</section>
  </main>
}
function Panel({ title, count, children }) { return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="mb-5 font-semibold">{title} <span className="text-xs text-slate-500">({count})</span></h2><div className="space-y-3">{children.length ? children : <p className="text-sm text-slate-500">No records yet.</p>}</div></div> }
function Item({ name, code, detail }) { return <div className="rounded-xl border border-slate-800 p-4"><div className="flex items-center gap-2"><b>{name}</b><span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{code}</span></div><p className="mt-1 text-xs text-slate-500">{detail}</p></div> }
