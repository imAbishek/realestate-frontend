'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/api'
import type { UserRole } from '@/types'
import { Search, ShieldOff, ShieldCheck } from 'lucide-react'

interface AdminUser {
  id: string; name: string; email: string; phone: string | null
  role: UserRole; isActive: boolean; isVerified: boolean; createdAt: string
}

const ROLE_TABS = ['ALL','BUYER','SELLER','AGENT','ADMIN'] as const
type RoleTab = typeof ROLE_TABS[number]

const ROLE_BADGE: Record<UserRole, string> = {
  BUYER:  'bg-gray-50   text-gray-500   border-gray-200',
  SELLER: 'bg-teal-50   text-teal-700   border-teal-200',
  AGENT:  'bg-brand-50  text-brand-700  border-brand-200',
  ADMIN:  'bg-purple-50 text-purple-700 border-purple-200',
}

export default function AdminUsersPage() {
  const [users,     setUsers]     = useState<AdminUser[]>([])
  const [loading,   setLoading]   = useState(false)
  const [roleTab,   setRoleTab]   = useState<RoleTab>('ALL')
  const [search,    setSearch]    = useState('')
  const [page,      setPage]      = useState(0)
  const [total,     setTotal]     = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setLoading(true)
    const role = roleTab === 'ALL' ? undefined : roleTab
    adminApi.getUsers(page, role)
      .then(r => { setUsers(r.data.content); setTotal(r.data.totalElements); setTotalPages(r.data.totalPages) })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [roleTab, page])

  async function toggleBan(user: AdminUser) {
    const action = user.isActive ? 'ban' : 'reinstate'
    if (!confirm(`${action === 'ban' ? 'Ban' : 'Reinstate'} ${user.name}?`)) return
    try {
      await adminApi.banUser(user.id, user.isActive)
      setUsers(u => u.map(x => x.id === user.id ? { ...x, isActive: !user.isActive } : x))
      toast.success(`User ${action === 'ban' ? 'banned' : 'reinstated'} successfully`)
    } catch { toast.error(`Failed to ${action} user`) }
  }

  const filtered = users.filter(u => {
    const matchRole   = roleTab === 'ALL' || u.role === roleTab
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-400">{total.toLocaleString()} registered</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 bg-white w-64" />
        </div>
      </div>

      {/* Role tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {ROLE_TABS.map(tab => (
          <button key={tab} onClick={() => { setRoleTab(tab); setPage(0) }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize
              ${roleTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_80px_80px_80px] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wide">
          <span>User</span><span>Role</span><span>Verified</span><span>Status</span><span>Actions</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">No users found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(u => (
              <div key={u.id} className="grid grid-cols-[2fr_1fr_80px_80px_80px] gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors">

                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-medium shrink-0">
                    {u.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    {u.phone && <p className="text-xs text-gray-400">{u.phone}</p>}
                  </div>
                </div>

                {/* Role */}
                <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border w-fit ${ROLE_BADGE[u.role]}`}>
                  {u.role.toLowerCase()}
                </span>

                {/* Verified */}
                <span className={`text-xs font-medium ${u.isVerified ? 'text-green-600' : 'text-gray-400'}`}>
                  {u.isVerified ? '✓ Yes' : '—'}
                </span>

                {/* Status */}
                <span className={`text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                  {u.isActive ? 'Active' : 'Banned'}
                </span>

                {/* Ban toggle */}
                {u.role !== 'ADMIN' ? (
                  <button onClick={() => toggleBan(u)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors
                      ${u.isActive
                        ? 'bg-red-50   text-red-600   border-red-200   hover:bg-red-100'
                        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                    {u.isActive ? <><ShieldOff size={12} />Ban</> : <><ShieldCheck size={12} />Restore</>}
                  </button>
                ) : (
                  <span className="text-xs text-gray-300">Protected</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Showing {filtered.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">← Prev</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
