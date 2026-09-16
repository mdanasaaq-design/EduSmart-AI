import { useEffect, useState } from 'react'
import { ArrowLeft, Edit3, GraduationCap, Plus, Trash2 } from 'lucide-react'
import { addProgram, deleteProgram, getPrograms, updateProgram } from '../../services/programService'
import { getBranches } from '../../services/branchService'

const initialForm = { name: '', code: '', type: 'Degree', branchId: '', branchName: '' }
const programTypes = ['School', 'Junior College', 'Degree', 'Engineering']

export default function Programs({ onBack }) {
  const [programs, setPrograms] = useState([])
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [programData, branchData] = await Promise.all([getPrograms(), getBranches()])
      setPrograms(programData)
      setBranches(branchData)
    } catch (err) {
      setError(err.message || 'Unable to load programs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  function handleChange(event) {
    const { name, value } = event.target
    if (name === 'branchId') {
      const branch = branches.find((item) => item.id === value)
      setForm((current) => ({ ...current, branchId: value, branchName: branch?.name || '' }))
      return
    }
    setForm((current) => ({ ...current, [name]: value }))
  }

  function resetForm() {
    setForm(initialForm)
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.code.trim() || !form.branchId) {
      setError('Program name, code and branch are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateProgram(editingId, form)
      else await addProgram(form)
      resetForm()
      await loadData()
    } catch (err) {
      setError(err.message || 'Unable to save program.')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(program) {
    setEditingId(program.id)
    setForm({
      name: program.name || '',
      code: program.code || '',
      type: program.type || 'Degree',
      branchId: program.branchId || '',
      branchName: program.branchName || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this program?')) return
    setError('')
    try {
      await deleteProgram(id)
      if (editingId === id) resetForm()
      await loadData()
    } catch (err) {
      setError(err.message || 'Unable to delete program.')
    }
  }

  return <main className="min-h-screen bg-slate-950 text-white">
    <nav className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><ArrowLeft size={17} /> Back to Dashboard</button>
        <div className="flex items-center gap-2 text-sm font-semibold"><GraduationCap size={19} className="text-emerald-400" /> Programs</div>
      </div>
    </nav>

    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="mb-8"><p className="text-sm font-medium text-emerald-400">Administration</p><h1 className="mt-2 text-3xl font-bold">Program Management</h1><p className="mt-2 text-slate-400">Create and manage the academic programs offered by each branch.</p></div>

      {error && <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center gap-2"><Plus size={19} className="text-emerald-400" /><h2 className="text-lg font-semibold">{editingId ? 'Edit Program' : 'Add Program'}</h2></div>
        {branches.length === 0 && !loading && <p className="mb-4 rounded-lg bg-amber-400/10 px-3 py-2 text-sm text-amber-300">Create a branch first before adding a program.</p>}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-slate-400">Program Name<input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Computer Science & AI" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400" /></label>
          <label className="text-sm text-slate-400">Program Code<input name="code" value={form.code} onChange={handleChange} placeholder="e.g. CSE-AIML" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400" /></label>
          <label className="text-sm text-slate-400">Program Type<select name="type" value={form.type} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400">{programTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="text-sm text-slate-400">Branch<select name="branchId" value={form.branchId} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400"><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>)}</select></label>
          <div className="flex gap-3 md:col-span-2 lg:col-span-4"><button disabled={saving || branches.length === 0} className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update Program' : 'Add Program'}</button>{editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-700 px-5 py-2.5 font-semibold text-slate-300 hover:border-slate-500">Cancel</button>}</div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Programs</h2><p className="mt-1 text-sm text-slate-500">{programs.length} program{programs.length === 1 ? '' : 's'}</p></div></div>
        {loading ? <p className="py-10 text-center text-slate-500">Loading programs...</p> : programs.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center"><GraduationCap className="mx-auto mb-3 text-slate-600" size={32} /><p className="text-slate-400">No programs added yet.</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-800 text-slate-500"><tr><th className="px-3 py-3 font-medium">Program</th><th className="px-3 py-3 font-medium">Code</th><th className="px-3 py-3 font-medium">Type</th><th className="px-3 py-3 font-medium">Branch</th><th className="px-3 py-3 text-right font-medium">Actions</th></tr></thead><tbody>{programs.map((program) => <tr key={program.id} className="border-b border-slate-800/70 last:border-0"><td className="px-3 py-4 font-medium text-white">{program.name}</td><td className="px-3 py-4 text-slate-400">{program.code}</td><td className="px-3 py-4 text-slate-400">{program.type}</td><td className="px-3 py-4 text-slate-400">{program.branchName || '—'}</td><td className="px-3 py-4"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(program)} title="Edit" className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-300"><Edit3 size={16} /></button><button onClick={() => handleDelete(program.id)} title="Delete" className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:border-red-400 hover:text-red-300"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
      </div>
    </section>
  </main>
}
