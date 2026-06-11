'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/api'
import type { UserRole } from '@/types'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Search, ShieldOff, ShieldCheck } from 'lucide-react'

interface AdminUser {
  id: string; name: string; email: string; phone: string | null
  role: UserRole; isActive: boolean; isVerified: boolean; createdAt: string
}

const ROLE_TABS = ['ALL','BUYER','SELLER','AGENT','ADMIN'] as const
type RoleTab = typeof ROLE_TABS[number]

const ROLE_BADGE: Record<UserRole, string> = {
  BUYER:  'bg-slate-50   text-slate-500   border-slate-200',
  SELLER: 'bg-teal-50   text-teal-700   border-teal-200',
  AGENT:  'bg-brand-50  text-brand-700  border-brand-200',
  ADMIN:  'bg-purple-50 text-purple-700 border-purple-200',
}

export default function AdminUsersPage() {
  const [users,     setUsers]     = useState<AdminUser[]>([])
  const [loading,   setLoading]   = useState(false)
  const [roleTab,   setRoleTab]   = useState<RoleTab>('ALL')
  const [search,    setSearch]    = useState('')
  // Debounced copy of `search` — sent to the server so name/email matches are
  // found across ALL pages (the old client filter only saw the current page).
  const [query,     setQuery]     = useState('')
  const [page,      setPage]      = useState(0)
  const [total,     setTotal]     = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Debounce keystrokes → query, and jump back to page 0 for the new result set.
  useEffect(() => {
    const t = setTimeout(() => { setQuery(search.trim()); setPage(0) }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Data-fetch effect: loads users from the server when the role tab/page/query
  // changes. The synchronous setLoading is the intended loading indicator, not the
  // derived-state antipattern this rule targets.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const role = roleTab === 'ALL' ? undefined : roleTab
    adminApi.getUsers(page, role, query || undefined)
      .then(r => { setUsers(r.data.content); setTotal(r.data.totalElements); setTotalPages(r.data.totalPages) })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [roleTab, page, query])

  const [banTarget, setBanTarget] = useState<AdminUser | null>(null)

  async function toggleBan() {
    if (!banTarget) return
    const user = banTarget
    const action = user.isActive ? 'ban' : 'reinstate'
    try {
      await adminApi.banUser(user.id, user.isActive)
      setUsers(u => u.map(x => x.id === user.id ? { ...x, isActive: !user.isActive } : x))
      toast.success(`User ${action === 'ban' ? 'banned' : 'reinstated'} successfully`)
    } catch { toast.error(`Failed to ${action} user`) }
    finally { setBanTarget(null) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Users</h1>
          <p className="text-sm text-slate-400">{total.toLocaleString()} registered</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-400 bg-white w-full" />
        </div>
      </div>

      {/* Role tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {ROLE_TABS.map(tab => (
          <button key={tab} onClick={() => { setRoleTab(tab); setPage(0) }}
            className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize
              ${roleTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">No users found.</div>
        ) : (
          <>
            {/* Desktop table — hidden below md */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[2fr_1fr_80px_80px_80px] gap-4 px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wide">
                <span>User</span><span>Role</span><span>Verified</span><span>Status</span><span>Actions</span>
              </div>
              <div className="divide-y divide-slate-50">
                {users.map(u => (
                  <div key={u.id} className="grid grid-cols-[2fr_1fr_80px_80px_80px] gap-4 px-5 py-3.5 items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-medium shrink-0">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                      </div>
                    </div>
                    <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border w-fit ${ROLE_BADGE[u.role]}`}>
                      {u.role.toLowerCase()}
                    </span>
                    <span className={`text-xs font-medium ${u.isVerified ? 'text-green-600' : 'text-slate-400'}`}>
                      {u.isVerified ? '✓ Yes' : '—'}
                    </span>
                    <span className={`text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                      {u.isActive ? 'Active' : 'Banned'}
                    </span>
                    {u.role !== 'ADMIN' ? (
                      <button onClick={() => setBanTarget(u)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors
                          ${u.isActive
                            ? 'bg-red-50   text-red-600   border-red-200   hover:bg-red-100'
                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                        {u.isActive ? <><ShieldOff size={12} />Ban</> : <><ShieldCheck size={12} />Restore</>}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">Protected</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile card view — hidden on md+ */}
            <div className="md:hidden divide-y divide-slate-50">
              {users.map(u => (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-medium shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                    </div>
                    <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${ROLE_BADGE[u.role]}`}>
                      {u.role.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <span className={u.isVerified ? 'text-green-600' : 'text-slate-400'}>
                        {u.isVerified ? '✓ Verified' : 'Unverified'}
                      </span>
                      <span className={u.isActive ? 'text-green-600' : 'text-red-500'}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </div>
                    {u.role !== 'ADMIN' ? (
                      <button onClick={() => setBanTarget(u)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors
                          ${u.isActive
                            ? 'bg-red-50   text-red-600   border-red-200   hover:bg-red-100'
                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                        {u.isActive ? <><ShieldOff size={12} />Ban</> : <><ShieldCheck size={12} />Restore</>}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">Protected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">Showing {users.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40">← Prev</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40">Next →</button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={banTarget !== null}
        tone={banTarget?.isActive ? 'danger' : 'primary'}
        title={banTarget?.isActive ? `Ban ${banTarget.name}?` : `Reinstate ${banTarget?.name}?`}
        message={banTarget?.isActive
          ? 'They will no longer be able to sign in, post listings, or send inquiries.'
          : 'Their account will be reactivated and they can sign in again.'}
        confirmLabel={banTarget?.isActive ? 'Ban user' : 'Reinstate user'}
        onConfirm={toggleBan}
        onClose={() => setBanTarget(null)}
      />
    </div>
  )
}
