import { useCallback, useEffect, useState } from 'react'
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { ArrowLeft, ShieldCheck, Users, RefreshCw, Save } from 'lucide-react'
import { db } from '../../firebase'

const roles = [
  { value: 'admin', label: 'Institution Admin', description: 'Institute-wide management and settings' },
  { value: 'teacher', label: 'Teacher', description: 'Assigned classes, subjects and academic records' },
  { value: 'student', label: 'Student', description: 'Personal academic records and learning insights' },
]

export default function UserAccess({ user, onBack }) {
  const [accounts, setAccounts] = useState([])
  const [pendingRoles, setPendingRoles] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const snapshot = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
      const rows = snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
      setAccounts(rows)
      setPendingRoles(Object.fromEntries(rows.map(row => [row.id, row.role || 'student'])))
    } catch (e) {
      setError(e.message || 'Could not load user accounts. Confirm you are signed in as an institution admin.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const saveRole = async (account) => {
    const nextRole = pendingRoles[account.id]
    if (!roles.some(role => role.value === nextRole)) return setError('Choose a valid role.')
    if (account.id === user?.uid && nextRole !== 'admin') {
      return setError('You cannot remove your own administrator access from this screen.')
    }
    if (nextRole === account.role) return
    setSavingId(account.id)
    setError('')
    setNotice('')
    try {
      await updateDoc(doc(db, 'users', account.id), { role: nextRole, updatedAt: serverTimestamp() })
      setAccounts(current => current.map(row => row.id === account.id ? { ...row, role: nextRole } : row))
      setNotice(`Access updated for ${account.name || account.email || account.id}.`)
    } catch (e) {
      setError(e.message || 'Could not update the account role.')
      setPendingRoles(current => ({ ...current, [account.id]: account.role || 'student' }))
    } finally {
      setSavingId('')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-900/80 px-5 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300"><ShieldCheck size={21}/></span><div><h1 className="font-bold">User Access & Roles</h1><p className="text-xs text-slate-400">Institution administration</p></div></div>
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm"><ArrowLeft size={16}/> Dashboard</button>
        </div>
      </nav>
      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-9">
        <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <div className="flex items-start gap-3"><Users size={22} className="mt-1 shrink-0 text-emerald-300"/><div><h2 className="font-semibold">Assign institute access</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">Accounts must first exist in Firebase Authentication and have an EduSmart user profile. Select a role to grant the matching workspace. This screen changes the app role; it does not create an email/password account.</p></div></div>
        </div>
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
        <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Registered accounts</h2><p className="mt-1 text-sm text-slate-400">{accounts.length} account{accounts.length === 1 ? '' : 's'} found</p></div><button onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''}/> Refresh</button></div>
        {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">Loading registered accounts…</div> : accounts.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">No EduSmart profiles found yet. Create a student account first, then refresh this page.</div> : <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(220px,1fr)_auto] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid"><span>Account</span><span>Firebase UID</span><span>Assigned role</span><span>Action</span></div>
          {accounts.map(account => <div key={account.id} className="grid gap-3 border-b border-slate-800 p-4 last:border-0 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(220px,1fr)_auto] md:items-center md:gap-4 md:px-5">
            <div className="min-w-0"><p className="truncate font-semibold">{account.name || 'Unnamed user'}</p><p className="mt-1 truncate text-sm text-slate-400">{account.email || 'No email recorded'}</p>{account.id === user?.uid && <span className="mt-2 inline-block rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] font-medium text-emerald-300">Your account</span>}</div>
            <code className="break-all text-xs text-slate-500">{account.id}</code>
            <label className="block"><span className="mb-1 block text-xs text-slate-500 md:hidden">Role</span><select value={pendingRoles[account.id] || account.role} onChange={event => { setPendingRoles(current => ({ ...current, [account.id]: event.target.value })); setError(''); setNotice('') }} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-400">{roles.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}</select><span className="mt-1 block text-xs text-slate-500">{roles.find(role => role.value === (pendingRoles[account.id] || account.role))?.description}</span></label>
            <button onClick={() => void saveRole(account)} disabled={savingId === account.id || pendingRoles[account.id] === account.role || (account.id === user?.uid && pendingRoles[account.id] !== 'admin')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3 py-2.5 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"><Save size={15}/>{savingId === account.id ? 'Saving…' : 'Save role'}</button>
          </div>)}
        </div>}
        <p className="mt-5 text-xs leading-5 text-slate-500">Security note: only accounts already authorized as institution administrators should be able to access this page. Role changes take effect on the next sign-in. Assign teacher classes and subjects separately under Teacher Assignments.</p>
      </section>
    </main>
  )
}
