import { useCallback, useEffect, useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { ArrowLeft, ShieldCheck, Users, RefreshCw, Save, Copy, UserPlus, Link2 } from 'lucide-react'
import { db, functions } from '../../firebase'

const roles = [
  { value: 'teacher', label: 'Teacher', description: 'Assigned classes, subjects and academic records' },
  { value: 'student', label: 'Student', description: 'Personal academic records and learning insights' },
]

const createManagedUser = httpsCallable(functions, 'createManagedUser')

export default function UserAccess({ user, onBack }) {
  const [accounts, setAccounts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newRole, setNewRole] = useState('teacher')
  const [setupLink, setSetupLink] = useState('')
  const [createdAccount, setCreatedAccount] = useState(null)
  const [pendingRoles, setPendingRoles] = useState({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
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

  const createAccount = async (event) => {
    event.preventDefault()
    setCreating(true)
    setError('')
    setNotice('')
    setSetupLink('')
    setCreatedAccount(null)
    try {
      const result = await createManagedUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: newRole,
      })
      const account = result.data
      setCreatedAccount(account)
      setSetupLink(account.passwordSetupLink || '')
      setName('')
      setEmail('')
      setNotice(account.message || 'Account created successfully.')
      await load()
    } catch (e) {
      const code = e?.code || ''
      if (code.includes('already-exists')) {
        setError('An Authentication account already uses this email. Do not create a duplicate; use password recovery or ask the administrator to link the existing account.')
      } else if (code.includes('permission-denied')) {
        setError('Only an authorized institution administrator can create accounts.')
      } else {
        setError(e?.message || 'Could not create the account. Check that Firebase Functions have been deployed.')
      }
    } finally {
      setCreating(false)
    }
  }

  const copySetupLink = async () => {
    if (!setupLink) return
    try {
      await navigator.clipboard.writeText(setupLink)
      setNotice('Password setup link copied. Share it privately with the intended account holder.')
    } catch {
      setError('Could not copy automatically. Select and copy the password setup link manually.')
    }
  }

  const saveRole = async (account) => {
    const nextRole = pendingRoles[account.id]
    if (!roles.some(role => role.value === nextRole)) return setError('Choose a valid role.')
    if (account.id === user?.uid && nextRole !== 'admin') return setError('You cannot remove your own administrator access from this screen.')
    if (nextRole === account.role) return
    setSavingId(account.id)
    setError('')
    setNotice('')
    try {
      await updateDoc(doc(db, 'users', account.id), { role: nextRole, updatedAt: serverTimestamp() })
      setAccounts(current => current.map(row => row.id === account.id ? { ...row, role: nextRole } : row))
      setNotice('Access updated for ' + (account.name || account.email || account.id) + '. Changes apply to the next sign-in.')
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
          <div className="flex items-start gap-3"><Users size={22} className="mt-1 shrink-0 text-emerald-300"/><div><h2 className="font-semibold">Institution-managed accounts</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">Create teacher and student accounts here. EduSmart provisions the Firebase Authentication account and matching Firestore profile together. The user receives a password setup link and signs in through the same shared login page. Admin accounts are not created from this form.</p></div></div>
        </div>
        {error && <p role="alert" className="mb-4 break-words rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
        <div className="mb-6 grid gap-5 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
          <form onSubmit={createAccount} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center gap-2"><UserPlus size={19} className="text-emerald-300"/><h2 className="font-semibold">Create a login account</h2></div>
            <label className="block"><span className="mb-1 block text-xs text-slate-400">Full name</span><input value={name} onChange={event => setName(event.target.value)} required minLength={2} maxLength={100} autoComplete="name" placeholder="Teacher or student full name" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"/></label>
            <label className="mt-3 block"><span className="mb-1 block text-xs text-slate-400">Email address</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" placeholder="person@institute.edu" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"/></label>
            <label className="mt-3 block"><span className="mb-1 block text-xs text-slate-400">Workspace</span><select value={newRole} onChange={event => setNewRole(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"><option value="teacher">Teacher</option><option value="student">Student</option></select></label>
            <button disabled={creating} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-50">{creating ? 'Creating account…' : <><UserPlus size={16}/> Create account and setup link</>}</button>
            <p className="mt-3 text-xs leading-5 text-slate-500">The user chooses their own password through a Firebase password setup link. Never send passwords in plain text.</p>
          </form>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-3 flex items-center gap-2"><Link2 size={19} className="text-emerald-300"/><h2 className="font-semibold">Password setup</h2></div>
            {createdAccount ? <div className="space-y-3"><div className="rounded-xl border border-slate-700 bg-slate-950 p-4"><p className="font-medium">{createdAccount.name}</p><p className="mt-1 text-sm text-slate-400">{createdAccount.email} · {createdAccount.role}</p><p className="mt-2 break-all text-xs text-slate-500">UID: {createdAccount.uid}</p></div>{setupLink ? <><p className="text-sm text-slate-300">Share this one-time password setup link privately with the account holder.</p><textarea readOnly value={setupLink} rows={4} className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-emerald-200"/><button type="button" onClick={() => void copySetupLink()} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950"><Copy size={15}/> Copy setup link</button></> : <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-100">The account and profile were created, but a setup link could not be generated. In Firebase Authentication, select this user and send a password reset email.</p>}</div> : <div className="flex min-h-48 flex-col items-center justify-center text-center"><ShieldCheck size={28} className="mb-3 text-slate-600"/><p className="text-sm text-slate-400">After creating an account, its password setup link will appear here.</p></div>}
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Registered accounts</h2><p className="mt-1 text-sm text-slate-400">{accounts.length} profile{accounts.length === 1 ? '' : 's'} found</p></div><button onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''}/> Refresh</button></div>
        {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">Loading registered accounts…</div> : accounts.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">No EduSmart profiles found yet.</div> : <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(220px,1fr)_auto] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid"><span>Account</span><span>Firebase UID</span><span>Assigned role</span><span>Action</span></div>
          {accounts.map(account => <div key={account.id} className="grid gap-3 border-b border-slate-800 p-4 last:border-0 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(220px,1fr)_auto] md:items-center md:gap-4 md:px-5">
            <div className="min-w-0"><p className="truncate font-semibold">{account.name || 'Unnamed user'}</p><p className="mt-1 truncate text-sm text-slate-400">{account.email || 'No email recorded'}</p>{account.id === user?.uid && <span className="mt-2 inline-block rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] font-medium text-emerald-300">Your account</span>}</div>
            <code className="break-all text-xs text-slate-500">{account.id}</code>
            <label className="block"><span className="mb-1 block text-xs text-slate-500 md:hidden">Role</span><select value={pendingRoles[account.id] || account.role} onChange={event => { setPendingRoles(current => ({ ...current, [account.id]: event.target.value })); setError(''); setNotice('') }} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-400">{roles.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}</select><span className="mt-1 block text-xs text-slate-500">{roles.find(role => role.value === (pendingRoles[account.id] || account.role))?.description}</span></label>
            <button onClick={() => void saveRole(account)} disabled={savingId === account.id || pendingRoles[account.id] === account.role || (account.id === user?.uid && pendingRoles[account.id] !== 'admin')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3 py-2.5 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"><Save size={15}/>{savingId === account.id ? 'Saving…' : 'Save role'}</button>
          </div>)}
        </div>}
        <p className="mt-5 text-xs leading-5 text-slate-500">Security note: account creation is enforced by a server-side function that checks your existing admin profile. Only teacher and student accounts can be created here. Assign teacher classes and subjects separately under Teacher Assignments.</p>
      </section>
    </main>
  )
}
