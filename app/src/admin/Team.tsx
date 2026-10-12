// Admins tab: who can use the admin portal, with which role and privileges.
// Add a person (role and privileges are chosen right there), change them later, or remove them.
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import {
  ACTIONS,
  ASSIGNABLE_ROLES,
  can as holds,
  covers,
  describePrivs,
  privsOf,
  roleFor,
  ROLES,
  SECTIONS,
  type Action,
  type Privs,
  type RoleId,
  type Section,
} from '../../shared/roles'
import { useAdmin } from './context'

interface Member {
  email: string
  role: RoleId
  privs: Privs
  added_by: string
  added_at: string
  updated_by: string | null
  updated_at: string | null
  name: string | null
  last_seen: string | null
  owner: boolean
}

interface Assignment {
  role: RoleId
  privs: Privs
}

const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : '')

/** Tick or untick one privilege. Edit and delete need view; removing view removes the whole row. */
function toggle(privs: Privs, section: Section, action: Action): Privs {
  const had = new Set(privs[section] ?? [])
  if (had.has(action)) {
    had.delete(action)
    if (action === 'view') had.clear()
  } else {
    had.add(action)
    had.add('view')
  }
  const next = { ...privs }
  if (had.size) next[section] = ACTIONS.filter((a) => had.has(a))
  else delete next[section]
  return next
}

/** Role picker plus the section × view/edit/delete grid. `limit` = the privileges the person doing the assigning holds. */
function AssignmentEditor({ value, onChange, limit }: { value: Assignment; onChange: (a: Assignment) => void; limit: Privs }) {
  return (
    <>
      <label className="field">
        <span>Role</span>
        <select
          value={value.role}
          onChange={(e) => {
            const role = e.target.value as RoleId
            onChange(role === 'custom' ? { role, privs: value.privs } : { role, privs: privsOf(role) })
          }}
        >
          {ASSIGNABLE_ROLES.map((r) => (
            <option key={r} value={r} disabled={r !== 'custom' && !covers(limit, privsOf(r))}>
              {ROLES[r].name}
            </option>
          ))}
        </select>
      </label>
      <p className="small muted" style={{ margin: 0 }}>
        {ROLES[value.role].about}
      </p>
      <div className="field">
        <span>Privileges</span>
        <div className="table-wrap">
          <table className="data privs">
            <thead>
              <tr>
                <th>Section</th>
                {ACTIONS.map((a) => (
                  <th key={a}>{a}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((s) => (
                <tr key={s.id}>
                  <td>
                    <b>
                      {s.icon} {s.label}
                    </b>
                    <div className="small muted">{s.about}</div>
                  </td>
                  {ACTIONS.map((a) => (
                    <td key={a}>
                      {(s.actions as readonly Action[]).includes(a) ? (
                        <input
                          type="checkbox"
                          aria-label={`${s.label}: ${a}`}
                          checked={holds(value.privs, s.id, a)}
                          disabled={!holds(limit, s.id, a)}
                          onChange={() => {
                            const privs = toggle(value.privs, s.id, a)
                            onChange({ role: roleFor(value.role, privs), privs })
                          }}
                        />
                      ) : (
                        <span className="muted">–</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        Picking a role ticks its privileges. Change any tick to make a custom set. You can only give privileges that you have yourself.
      </p>
    </>
  )
}

const START: Assignment = { role: 'curator', privs: privsOf('curator') }

export function TeamTab() {
  const { user, access, can } = useAdmin()
  const [items, setItems] = useState<Member[] | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [draft, setDraft] = useState<Assignment>(() => (covers(access.privs, START.privs) ? START : { role: 'custom', privs: {} }))
  const [editing, setEditing] = useState<{ email: string; value: Assignment } | null>(null)
  const [busy, setBusy] = useState(false)
  const me = user.email.toLowerCase()
  const mayEdit = can('team', 'edit')
  const mayRemove = can('team', 'delete')

  const load = () =>
    api<{ items: Member[] }>('/api/admin/admins')
      .then((r) => setItems(r.items))
      .catch((e) => setMsg(e.message))
  useEffect(() => {
    void load()
  }, [])

  async function run(work: () => Promise<string>) {
    setMsg(null)
    setBusy(true)
    try {
      setMsg(await work())
      void load()
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const add = () =>
    run(async () => {
      const e = email.trim().toLowerCase()
      await api('/api/admin/admins', { body: { email: e, ...draft } })
      setEmail('')
      return `${e} added as ${ROLES[draft.role].name} ✓ They get access the next time they sign in to the portal.`
    })

  const save = () =>
    run(async () => {
      if (!editing) return ''
      await api('/api/admin/admins', { method: 'PUT', body: { email: editing.email, ...editing.value } })
      setEditing(null)
      return `${editing.email} is now ${ROLES[editing.value.role].name} ✓`
    })

  const remove = (m: Member) => {
    if (!confirm(`Remove ${m.email} from the admin portal?`)) return
    void run(async () => {
      await api(`/api/admin/admins?email=${encodeURIComponent(m.email)}`, { method: 'DELETE' })
      return `${m.email} removed ✓`
    })
  }

  // nobody can change the owner, themselves, or someone who holds more than they do
  const manageable = (m: Member) => !m.owner && m.email !== me && covers(access.privs, m.privs)

  return (
    <div className="stack">
      {msg && <div className="card notice small">{msg}</div>}

      <div className="section-title" style={{ marginTop: 0 }}>
        Portal users
      </div>
      {!items ? (
        <div className="card muted">Loading…</div>
      ) : (
        <div className="table-wrap card">
          <table className="data">
            <thead>
              <tr>
                <th>Person</th>
                <th>Role</th>
                <th>Privileges</th>
                <th>Added</th>
                <th>Last seen</th>
                {(mayEdit || mayRemove) && <th />}
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.email}>
                  <td>
                    <b>{m.name ?? '—'}</b>
                    {m.email === me && <span className="small muted"> (you)</span>}
                    <div className="small muted">{m.email}</div>
                  </td>
                  <td>
                    <span className="weight">{ROLES[m.role].name}</span>
                  </td>
                  <td className="small">{m.owner ? 'Full access to everything' : describePrivs(m.privs)}</td>
                  <td className="small">
                    {m.owner ? 'Owner' : day(m.added_at)}
                    {!m.owner && <div className="muted">by {m.added_by}</div>}
                    {m.updated_by && <div className="muted">changed {day(m.updated_at)} by {m.updated_by}</div>}
                  </td>
                  <td className="small">{day(m.last_seen) || 'Never'}</td>
                  {(mayEdit || mayRemove) && (
                    <td>
                      {manageable(m) && (
                        <div className="row" style={{ gap: 4 }}>
                          {mayEdit && (
                            <button className="btn ghost" onClick={() => setEditing({ email: m.email, value: { role: m.role, privs: m.privs } })}>
                              Edit
                            </button>
                          )}
                          {mayRemove && (
                            <button className="btn ghost" disabled={busy} onClick={() => remove(m)}>
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && mayEdit && (
        <div className="card stack">
          <b>Change role and privileges: {editing.email}</b>
          <AssignmentEditor value={editing.value} onChange={(value) => setEditing({ ...editing, value })} limit={access.privs} />
          <div className="row" style={{ gap: 10 }}>
            <button className="btn" disabled={busy || !Object.keys(editing.value.privs).length} onClick={save}>
              Save changes
            </button>
            <button className="btn secondary" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {mayEdit && !editing && (
        <>
          <div className="section-title">Add a user</div>
          <div className="card stack">
            <label className="field">
              <span>Their Google email</span>
              <input className="admin-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@gmail.com" />
            </label>
            <AssignmentEditor value={draft} onChange={setDraft} limit={access.privs} />
            <button className="btn" disabled={busy || !email.includes('@') || !Object.keys(draft.privs).length} onClick={add}>
              Add as {ROLES[draft.role].name}
            </button>
          </div>
        </>
      )}

      <div className="section-title">Roles</div>
      <div className="table-wrap card">
        <table className="data">
          <thead>
            <tr>
              <th>Role</th>
              <th>What it is for</th>
              <th>Privileges</th>
            </tr>
          </thead>
          <tbody>
            {(['super', ...ASSIGNABLE_ROLES] as RoleId[]).map((r) => (
              <tr key={r}>
                <td>
                  <b>{ROLES[r].name}</b>
                </td>
                <td className="small">{ROLES[r].about}</td>
                <td className="small">{r === 'custom' ? 'Any mix you tick' : r === 'super' || r === 'admin' ? 'Everything' : describePrivs(privsOf(r))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
