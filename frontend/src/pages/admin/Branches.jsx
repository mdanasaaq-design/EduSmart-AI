import { useEffect, useState } from 'react'
import { ArrowLeft, Building2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { addBranch, deleteBranch, getBranches, updateBranch } from '../../services/branchService'

const emptyForm = { name: '', code: '', location: '' }

export default function Branches({ onBack }) {
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadBranches() {
    setLoading(true)
    try {
      setBranches(await getBranches())
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to load branches.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBranches() }, [])

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
    setError('')
  }

  function openEdit(branch) {
    setEditingId(branch.id)
    setForm({ name: branch.name || '', code: branch.code || '', location: branch.location || '' })
    setShowForm(true)
    setError('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.code.trim() || !form.location.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateBranch(editingId, form)
      else await addBranch(form)
      await loadBranches()
      closeForm()
    } catch (err) {
      setError(err.message || 'Unable to save branch.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this branch?')) return
    try {
      await deleteBranch(id)
      setBranches((current) => current.filter((branch) => branch.id !== id))
    } catch (err) {
      setError(err.message || 'Unable to delete branch.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Back to Dashboard</button>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-medium text-emerald-400">Administration</p><h1 className="mt-1 text-3xl font-bold">Branches</h1><p className="mt-2 text-slate-400">Manage institute branches and their locations.</p></div>
          <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400"><Plus size={18} /> Add Branch</button>
        </div>

        {error && <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">{editingId ? 'Edit Branch' : 'Add Branch'}</h2><button type="button" onClick={closeForm} className="text-slate-400 hover:text-white"><X size={20} /></button></div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Branch Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="Main Campus" />
              <Field label="Branch Code" value={form.code} onChange={(value) => setForm({ ...form, code: value })} placeholder="MAIN" />
              <Field label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} placeholder="Hyderabad" />
            </div>
            <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={closeForm} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:border-slate-500">Cancel</button><button disabled={saving} className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update Branch' : 'Save Branch'}</button></div>
          </form>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {loading ? <div className="p-10 text-center text-slate-500">Loading branches...</div> : branches.length === 0 ? <div className="p-12 text-center"><Building2 className="mx-auto text-slate-600" size={38} /><h2 className="mt-4 font-semibold">No branches yet</h2><p className="mt-2 text-sm text-slate-500">Add your first institute branch to get started.</p></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-800 text-xs uppercase text-slate-500"><tr><th className="px-6 py-4">Branch</th><th className="px-6 py-4">Code</th><th className="px-6 py-4">Location</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody>{branches.map((branch) => <tr key={branch.id} className="border-b border-slate-800 last:border-0"><td className="px-6 py-4 font-medium">{branch.name}</td><td className="px-6 py-4"><span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-emerald-300">{branch.code}</span></td><td className="px-6 py-4 text-slate-400">{branch.location}</td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(branch)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-emerald-300"><Pencil size={16} /></button><button onClick={() => handleDelete(branch.id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-300"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
        </div>
      </section>
    </main>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return <label className="block"><span className="mb-2 block text-sm text-slate-300">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-emerald-400" /></label>
}
