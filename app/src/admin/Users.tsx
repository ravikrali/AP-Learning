import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { catalogCourse, PLANS, type PlanId } from '../../shared/catalog'

interface UserRow {
  sub: string
  email: string
  name: string | null
  country: string | null
  region: string | null
  created_at: string
  last_seen: string
  plan: PlanId | null
  status: string | null
  comp_plan: PlanId | null
  courses: string | null
  current_period_end: string | null
  cancel_at_period_end: number | null
}

const PAID = new Set(['active', 'trialing', 'past_due'])
const d = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : '')

export function UsersTab() {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<UserRow[] | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const load = (term = q) =>
    api<{ items: UserRow[] }>(`/api/admin/users?q=${encodeURIComponent(term)}`)
      .then((r) => setRows(r.items))
      .catch((e) => setMsg(e.message))
  useEffect(() => {
    void load('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function grant(u: UserRow, plan: PlanId | null) {
    setMsg(null)
    try {
      await api('/api/admin/users/plan', { body: { sub: u.sub, plan } })
      setMsg(plan ? `${u.email} now has ${PLANS[plan].name} (granted, no payment).` : `Granted plan removed for ${u.email}.`)
      void load()
    } catch (e) {
      setMsg((e as Error).message)
    }
  }

  return (
    <div className="stack">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          void load()
        }}
      >
        <input className="admin-input grow" placeholder="Search by email or name" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn secondary">Search</button>
      </form>
      {msg && <div className="card notice small">{msg}</div>}
      <p className="small muted" style={{ margin: 0 }}>
        Grant a plan to family, teachers or testers without payment. It sits on top of anything they pay for, and can be removed any time.
      </p>
      {!rows ? (
        <div className="card muted">Loading…</div>
      ) : (
        <div className="table-wrap card">
          <table className="data">
            <thead>
              <tr>
                <th>Student</th>
                <th>Where</th>
                <th>Joined</th>
                <th>Last seen</th>
                <th>Paid plan</th>
                <th>Courses</th>
                <th>Granted plan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const paid = u.plan && u.status && PAID.has(u.status) ? u.plan : 'free'
                const courses = (JSON.parse(u.courses ?? '[]') as string[]).map((c) => catalogCourse(c)?.short ?? c).join(', ')
                return (
                  <tr key={u.sub}>
                    <td>
                      <b>{u.name ?? '—'}</b>
                      <div className="small muted">{u.email}</div>
                    </td>
                    <td>{[u.region, u.country].filter(Boolean).join(', ') || '—'}</td>
                    <td>{d(u.created_at)}</td>
                    <td>{d(u.last_seen)}</td>
                    <td>
                      {PLANS[paid].name}
                      {u.status === 'past_due' && <div className="small">⚠️ payment failed</div>}
                      {paid !== 'free' && u.cancel_at_period_end ? <div className="small muted">ends {d(u.current_period_end)}</div> : null}
                    </td>
                    <td>{courses || '—'}</td>
                    <td>
                      <select className="admin-input" value={u.comp_plan ?? ''} onChange={(e) => grant(u, (e.target.value || null) as PlanId | null)}>
                        <option value="">None</option>
                        <option value="three">{PLANS.three.name}</option>
                        <option value="all">{PLANS.all.name}</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!rows.length && <p className="small muted">No students match.</p>}
        </div>
      )}
    </div>
  )
}
