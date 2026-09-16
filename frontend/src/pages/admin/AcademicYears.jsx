import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, Edit3, Plus, Trash2 } from 'lucide-react'
import { addAcademicYear, deleteAcademicYear, getAcademicYears, updateAcademicYear } from '../../services/academicYearService'

const initialForm = { name: '', startYear: '', endYear: '', status: 'Active' }

export default function AcademicYears({ onBack }) {
  const [years, setYears] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadYears() {
    setLoading(true)
    setError('')
    try { setYears(await getAcademicYears()) }
    catch (err) { setError(err.message || 'Unable to load academic years.') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadYears() }, [])

  function handleChange(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  function resetForm() { setForm(initialForm); setEditingId(null) }

  async function handleSubmit(event) {
    event.preventDefault()
    const start = Number(form.startYear)
    const end = Number(form.endYear)
    if (!form.name.trim() || !start || !end) { setError('Name, start year and end year are required.'); return }
    if (end <= start) { setError('End year must be greater than start year.'); return }
    setSaving(true); setError('')
    try {
      if (editingId) await updateAcademicYear(editingId, form)
      else await addAcademicYear(form)
      resetForm(); await loadYears()
    } catch (err) { setError(err.message || 'Unable to save academic year.') }
    finally { setSaving(false) }
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setForm({ name: item.name || '', startYear: item.startYear || '', endYear: item.endYear || '', status: item.status || 'Active' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this academic year?')) return
    setError('')
    try { await deleteAcademicYear(id); if (editingId === id) resetForm(); await loadYears() }
    catch (err) { setError(err.message || 'Unable to delete academic year.') }
  }

  return <main className="min-h-screen bg-slate-950 text-white">
    <nav className="border-b border-slate-800 bg-slate-900/80 px-6 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><ArrowLeft size={17} /> Back to Dashboard</button><div className="flex items-center gap-2 text-sm font-semibold"><CalendarDays size={19} className="text-emerald-400" /> Academic Years</div></div></nav>
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="mb-8"><p className="text-sm font-medium text-emerald-400">Administration</p><h1 className="mt-2 text-3xl font-bold">Academic Year Management</h1><p className="mt-2 text-slate-400">Define academic sessions and keep track of the active year.</p></div>
      {error && <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center gap-2"><Plus size={19} className="text-emerald-400" /><h2 className="text-lg font-semibold">{editingId ? 'Edit Academic Year' : 'Add Academic Year'}</h2></div>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-slate-400">Name<input name="name" value={form.name} onChange={handleChange} placeholder="e.g. 2026-27" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400" /></label>
          <label className="text-sm text-slate-400">Start Year<input name="startYear" type="number" min="2000" max="2100" value={form.startYear} onChange={handleChange} placeholder="2026" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400" /></label>
          <label className="text-sm text-slate-400">End Year<input name="endYear" type="number" min="2001" max="2101" value={form.endYear} onChange={handleChange} placeholder="2027" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400" /></label>
          <label className="text-sm text-slate-400">Status<select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400"><option>Active</option><option>Inactive</option></select></label>
          <div className="flex gap-3 md:col-span-2 lg:col-span-4"><button disabled={saving} className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update Academic Year' : 'Add Academic Year'}</button>{editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-700 px-5 py-2.5 font-semibold text-slate-300 hover:border-slate-500">Cancel</button>}</div>
        </form>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5"><h2 className="text-lg font-semibold">Academic Years</h2><p className="mt-1 text-sm text-slate-500">{years.length} academic year{years.length === 1 ? '' : 's'}</p></div>
        {loading ? <p className="py-10 text-center text-slate-500">Loading academic years...</p> : years.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center"><CalendarDays className="mx-auto mb-3 text-slate-600" size={32} /><p className="text-slate-400">No academic years added yet.</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-800 text-slate-500"><tr><th className="px-3 py-3 font-medium">Name</th><th className="px-3 py-3 font-medium">Start</th><th className="px-3 py-3 font-medium">End</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 text-right font-medium">Actions</th></tr></thead><tbody>{years.map((item) => <tr key={item.id} className="border-b border-slate-800/70 last:border-0"><td className="px-3 py-4 font-medium text-white">{item.name}</td><td className="px-3 py-4 text-slate-400">{item.startYear}</td><td className="px-3 py-4 text-slate-400">{item.endYear}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'Active' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>{item.status}</span></td><td className="px-3 py-4"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(item)} title="Edit" className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-300"><Edit3 size={16} /></button><button onClick={() => handleDelete(item.id)} title="Delete" className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:border-red-400 hover:text-red-300"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
      </div>
    </section>
  </main>
}
