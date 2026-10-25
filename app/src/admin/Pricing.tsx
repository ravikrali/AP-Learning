// Pricing tab: plans and prices, free-course promotions, discount and affiliate codes, how each
// code and channel performs, and a log of every change. The rules are in shared/pricing.ts.

import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { refreshPricing } from '../lib/pricing'
import { useAdmin } from './context'
import { int } from './Dashboard'
import { CATALOG } from '../../shared/catalog'
import { APP_URL } from '../../shared/brand'
import { describeDiscount, FREE_PLAN, money, type CoursePromo, type DiscountCode, type Plan, type PlanId } from '../../shared/pricing'
import { BUILT } from '../content'

interface CodeStats {
  signups: number
  redemptions: number
  payingNow: number
  payers: number
  revenue: number
  commission: number
}
type CodeRow = DiscountCode & { createdBy: string; createdAt: string; stats: CodeStats }

interface PricingData {
  plans: Plan[]
  promos: (CoursePromo & { createdBy: string })[]
  codes: CodeRow[]
  holders: { plan: string; price_cents: number | null; billing_interval: string | null; n: number }[]
  granted: { plan: string; n: number }[]
  log: { at: string; by_email: string; what: string; detail: unknown }[]
}

type View = 'plans' | 'promos' | 'codes' | 'channels' | 'log'
const VIEWS: { id: View; label: string }[] = [
  { id: 'plans', label: 'Plans' },
  { id: 'promos', label: 'Free courses' },
  { id: 'codes', label: 'Codes' },
  { id: 'channels', label: 'Channels' },
  { id: 'log', label: 'History' },
]

// ---------- small helpers ----------

const dollars = (cents: number | null) => (cents === null ? '' : (cents / 100).toFixed(2))
const toCents = (s: string) => (s.trim() === '' ? null : Math.round(Number(s) * 100))
/** ISO time → the local date for an <input type="date">. */
const dateIn = (iso: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
/** A local date → ISO time at the start of that day, or of the next day for an end date (so the end date is included). */
const dateOut = (d: string, end = false) => {
  if (!d) return null
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day + (end ? 1 : 0)).toISOString()
}
/** The last day included, for showing an end time. */
const lastDay = (iso: string) => new Date(Date.parse(iso) - 1).toLocaleDateString()
const when = (iso: string) => new Date(iso).toLocaleDateString()
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '—')
const courseName = (id: string) => CATALOG.find((c) => c.id === id)?.short ?? id

function promoState(p: CoursePromo) {
  const t = new Date().toISOString()
  return t < p.starts ? 'Upcoming' : t >= p.ends ? 'Ended' : 'Running'
}

function codeState(c: DiscountCode) {
  const t = new Date().toISOString()
  if (!c.active) return 'Off'
  if (c.starts && t < c.starts) return 'Upcoming'
  if (c.ends && t >= c.ends) return 'Expired'
  return 'Active'
}

// ---------- the tab ----------

export function PricingTab() {
  const { can } = useAdmin()
  const [data, setData] = useState<PricingData | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [view, setView] = useState<View>('plans')
  const load = () =>
    api<PricingData>('/api/admin/pricing')
      .then(setData)
      .catch((e) => setMsg(e.message))
  useEffect(() => {
    void load()
  }, [])

  /** Run a change, then reload this tab and the live prices. */
  async function act(fn: () => Promise<unknown>, done: string) {
    setMsg(null)
    try {
      await fn()
      setMsg(done)
      await load()
      void refreshPricing().catch(() => undefined)
      return true
    } catch (e) {
      setMsg((e as Error).message)
      return false
    }
  }

  return (
    <div className="stack">
      <div className="seg" role="tablist" style={{ maxWidth: 620 }}>
        {VIEWS.map((v) => (
          <button key={v.id} className={view === v.id ? 'on' : ''} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </div>
      {msg && <div className="card notice small">{msg}</div>}
      {!data ? (
        <div className="card muted">Loading…</div>
      ) : view === 'plans' ? (
        <PlansView data={data} mayEdit={can('pricing', 'edit')} act={act} />
      ) : view === 'promos' ? (
        <PromosView data={data} mayEdit={can('pricing', 'edit')} mayDelete={can('pricing', 'delete')} act={act} />
      ) : view === 'codes' ? (
        <CodesView data={data} mayEdit={can('pricing', 'edit')} mayDelete={can('pricing', 'delete')} act={act} />
      ) : view === 'channels' ? (
        <ChannelsView data={data} />
      ) : (
        <LogView data={data} />
      )}
    </div>
  )
}

type Act = (fn: () => Promise<unknown>, done: string) => Promise<boolean>

// ---------- plans ----------

interface PlanDraft {
  isNew: boolean
  id: string
  name: string
  blurb: string
  courses: string
  monthly: string
  yearly: string
  trialDays: string
  sort: string
  active: boolean
}

const planDraft = (p: Plan | null, sort: number): PlanDraft =>
  p
    ? {
        isNew: false, id: p.id, name: p.name, blurb: p.blurb, courses: p.courses === null ? '' : String(p.courses),
        monthly: dollars(p.monthly), yearly: dollars(p.yearly), trialDays: String(p.trialDays), sort: String(p.sort), active: p.active,
      }
    : { isNew: true, id: '', name: '', blurb: '', courses: '2', monthly: '', yearly: '', trialDays: '0', sort: String(sort), active: true }

function PlansView({ data, mayEdit, act }: { data: PricingData; mayEdit: boolean; act: Act }) {
  const [draft, setDraft] = useState<PlanDraft | null>(null)
  const plans = [...data.plans].sort((a, b) => a.sort - b.sort)
  const paying = (id: PlanId) => data.holders.filter((h) => h.plan === id).reduce((s, h) => s + h.n, 0)
  const granted = (id: PlanId) => data.granted.find((g) => g.plan === id)?.n ?? 0
  const set = (patch: Partial<PlanDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d))
  const editing = draft && !draft.isNew ? data.plans.find((p) => p.id === draft.id) : null

  async function save() {
    if (!draft) return
    const body = {
      isNew: draft.isNew, id: draft.id.trim().toLowerCase(), name: draft.name, blurb: draft.blurb,
      courses: draft.courses.trim() === '' ? null : Number(draft.courses), monthly: toCents(draft.monthly) ?? 0, yearly: toCents(draft.yearly),
      trialDays: Number(draft.trialDays || 0), sort: Number(draft.sort || 0), active: draft.active,
    }
    if (await act(() => api('/api/admin/pricing/plan', { method: 'PUT', body }), `${body.name} saved ✓ The app shows it within a minute.`)) setDraft(null)
  }

  return (
    <>
      <p className="small muted" style={{ margin: 0 }}>
        A new price is for new subscribers: everyone already paying stays on the price they signed up at. The number of courses a
        plan includes applies to everyone on it. Retire a plan to stop offering it; people on it keep it.
      </p>
      <div className="table-wrap card">
        <table className="data">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Courses</th>
              <th>Monthly</th>
              <th>Yearly</th>
              <th>Trial</th>
              <th>Paying now</th>
              <th>Granted</th>
              <th>Status</th>
              {mayEdit && <th />}
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => {
              const prices = data.holders.filter((h) => h.plan === p.id && h.price_cents !== null && h.price_cents !== (h.billing_interval === 'year' ? p.yearly : p.monthly))
              return (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b> <span className="small muted">({p.id})</span>
                    <div className="small muted">{p.blurb}</div>
                  </td>
                  <td>{p.courses ?? 'All'}</td>
                  <td>{money(p.monthly)}</td>
                  <td>{p.yearly ? money(p.yearly) : '—'}</td>
                  <td>{p.trialDays ? `${p.trialDays} days` : '—'}</td>
                  <td>
                    {int(paying(p.id))}
                    {prices.length > 0 && (
                      <div className="small muted">
                        {prices.map((h) => `${h.n} at ${money(h.price_cents!)}/${h.billing_interval === 'year' ? 'yr' : 'mo'}`).join(', ')}
                      </div>
                    )}
                  </td>
                  <td>{int(granted(p.id))}</td>
                  <td>{p.active ? 'Offered' : 'Retired'}</td>
                  {mayEdit && (
                    <td>
                      <button className="btn ghost" onClick={() => setDraft(planDraft(p, p.sort))}>
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {mayEdit && !draft && (
        <button className="btn secondary" style={{ alignSelf: 'flex-start' }} onClick={() => setDraft(planDraft(null, plans.length))}>
          + Add a plan
        </button>
      )}
      {draft && (
        <div className="card stack">
          <b>{draft.isNew ? 'New plan' : `Edit ${editing?.name ?? draft.id}`}</b>
          <div className="form-grid">
            {draft.isNew && (
              <label className="field">
                <span>Id (short, lowercase; cannot change later)</span>
                <input className="admin-input" value={draft.id} onChange={(e) => set({ id: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })} placeholder="duo" />
              </label>
            )}
            <label className="field">
              <span>Name</span>
              <input className="admin-input" value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Duo" />
            </label>
            <label className="field">
              <span>Courses included (empty = every course)</span>
              <input className="admin-input" inputMode="numeric" value={draft.courses} onChange={(e) => set({ courses: e.target.value.replace(/\D/g, '') })} />
            </label>
            {draft.id !== FREE_PLAN && (
              <>
                <label className="field">
                  <span>Monthly price ($)</span>
                  <input className="admin-input" inputMode="decimal" value={draft.monthly} onChange={(e) => set({ monthly: e.target.value })} placeholder="5.99" />
                </label>
                <label className="field">
                  <span>Yearly price ($, empty = no yearly option)</span>
                  <input className="admin-input" inputMode="decimal" value={draft.yearly} onChange={(e) => set({ yearly: e.target.value })} placeholder="59.00" />
                </label>
                <label className="field">
                  <span>Free trial (days, first subscription only)</span>
                  <input className="admin-input" inputMode="numeric" value={draft.trialDays} onChange={(e) => set({ trialDays: e.target.value.replace(/\D/g, '') })} />
                </label>
              </>
            )}
            <label className="field">
              <span>Order on the plans page</span>
              <input className="admin-input" inputMode="numeric" value={draft.sort} onChange={(e) => set({ sort: e.target.value.replace(/[^\d-]/g, '') })} />
            </label>
          </div>
          <label className="field">
            <span>One line about it (shown in Stripe receipts)</span>
            <input className="admin-input" value={draft.blurb} maxLength={120} onChange={(e) => set({ blurb: e.target.value })} />
          </label>
          {draft.id !== FREE_PLAN && (
            <label className="row small" style={{ gap: 8 }}>
              <input type="checkbox" checked={draft.active} onChange={(e) => set({ active: e.target.checked })} /> Offered to new subscribers (untick to retire it)
            </label>
          )}
          {editing && paying(editing.id) > 0 && toCents(draft.monthly) !== editing.monthly && (
            <p className="small notice" style={{ margin: 0 }}>
              {int(paying(editing.id))} people pay for {editing.name} now. They keep their current price; the new price is for new subscribers.
            </p>
          )}
          {editing && editing.courses !== (draft.courses === '' ? null : Number(draft.courses)) && (paying(editing.id) > 0 || granted(editing.id) > 0) && (
            <p className="small notice" style={{ margin: 0 }}>
              The new number of courses applies to everyone on {editing.name} right away
              {(draft.courses !== '' && editing.courses === null) || (editing.courses !== null && draft.courses !== '' && Number(draft.courses) < editing.courses)
                ? '. People with more picks than the new limit keep them until they next change their courses.'
                : '.'}
            </p>
          )}
          <div className="row" style={{ gap: 10 }}>
            <button className="btn" onClick={save}>
              Save
            </button>
            <button className="btn secondary" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ---------- free-course promotions ----------

interface PromoDraft {
  id: number | null
  label: string
  courses: string[]
  starts: string
  ends: string
}

function PromosView({ data, mayEdit, mayDelete, act }: { data: PricingData; mayEdit: boolean; mayDelete: boolean; act: Act }) {
  const [draft, setDraft] = useState<PromoDraft | null>(null)
  const built = CATALOG.filter((c) => BUILT.has(c.id))
  const set = (patch: Partial<PromoDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d))

  async function save() {
    if (!draft) return
    const body = { id: draft.id ?? undefined, label: draft.label, courses: draft.courses, starts: dateOut(draft.starts), ends: dateOut(draft.ends, true) }
    if (await act(() => api('/api/admin/pricing/promo', { method: 'PUT', body }), `"${draft.label}" saved ✓`)) setDraft(null)
  }
  const endNow = (p: CoursePromo) =>
    act(
      () => api('/api/admin/pricing/promo', { method: 'PUT', body: { ...p, ends: new Date().toISOString(), starts: p.starts < new Date().toISOString() ? p.starts : new Date(Date.now() - 1000).toISOString() } }),
      `"${p.label}" ended ✓`,
    )
  const remove = (p: CoursePromo) => {
    if (confirm(`Remove "${p.label}"? It disappears from the list and the app.`))
      void act(() => api(`/api/admin/pricing/promo?id=${p.id}`, { method: 'DELETE' }), `"${p.label}" removed`)
  }

  return (
    <>
      <p className="small muted" style={{ margin: 0 }}>
        While a promotion runs, its courses open for every student without using one of their plan's slots. When it ends, the
        course closes again unless the student picked it or has a plan that includes it. Dates are in your time zone; the end date is
        the last free day.
      </p>
      <div className="table-wrap card">
        <table className="data">
          <thead>
            <tr>
              <th>Promotion</th>
              <th>Courses</th>
              <th>From</th>
              <th>Last day</th>
              <th>Status</th>
              {(mayEdit || mayDelete) && <th />}
            </tr>
          </thead>
          <tbody>
            {data.promos.map((p) => {
              const state = promoState(p)
              return (
                <tr key={p.id}>
                  <td>
                    <b>{p.label}</b>
                    <div className="small muted">by {p.createdBy}</div>
                  </td>
                  <td>{p.courses.map(courseName).join(', ')}</td>
                  <td>{when(p.starts)}</td>
                  <td>{lastDay(p.ends)}</td>
                  <td>{state}</td>
                  {(mayEdit || mayDelete) && (
                    <td>
                      <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                        {mayEdit && state !== 'Ended' && (
                          <button className="btn ghost" onClick={() => setDraft({ id: p.id, label: p.label, courses: p.courses, starts: dateIn(p.starts), ends: dateIn(new Date(Date.parse(p.ends) - 1).toISOString()) })}>
                            Edit
                          </button>
                        )}
                        {mayEdit && state === 'Running' && (
                          <button className="btn ghost" onClick={() => void endNow(p)}>
                            End now
                          </button>
                        )}
                        {mayDelete && (
                          <button className="btn ghost" onClick={() => remove(p)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        {!data.promos.length && <p className="small muted">No promotions yet.</p>}
      </div>
      {mayEdit && !draft && (
        <button className="btn secondary" style={{ alignSelf: 'flex-start' }} onClick={() => setDraft({ id: null, label: '', courses: [], starts: dateIn(new Date().toISOString()), ends: '' })}>
          + Make a course free for a while
        </button>
      )}
      {draft && (
        <div className="card stack">
          <b>{draft.id ? 'Edit promotion' : 'New free-course promotion'}</b>
          <label className="field">
            <span>Name students see</span>
            <input className="admin-input" value={draft.label} maxLength={80} onChange={(e) => set({ label: e.target.value })} placeholder="Statistics free through finals" />
          </label>
          <div className="field">
            <span>Courses</span>
            <div className="chips">
              {built.map((c) => {
                const on = draft.courses.includes(c.id)
                return (
                  <button key={c.id} type="button" className={`chip ${on ? 'on' : ''}`} onClick={() => set({ courses: on ? draft.courses.filter((x) => x !== c.id) : [...draft.courses, c.id] })}>
                    {c.emoji} {c.short} {on && '✓'}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>First free day</span>
              <input type="date" className="admin-input" value={draft.starts} onChange={(e) => set({ starts: e.target.value })} />
            </label>
            <label className="field">
              <span>Last free day</span>
              <input type="date" className="admin-input" value={draft.ends} min={draft.starts} onChange={(e) => set({ ends: e.target.value })} />
            </label>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn" onClick={save}>
              Save
            </button>
            <button className="btn secondary" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ---------- codes ----------

interface CodeDraft {
  isNew: boolean
  code: string
  kind: 'coupon' | 'affiliate'
  channel: string
  off: 'percent' | 'amount' | 'none'
  value: string
  duration: 'once' | 'repeating' | 'forever'
  months: string
  plans: PlanId[]
  starts: string
  ends: string
  maxUses: string
  commissionPct: string
  note: string
  active: boolean
}

const codeDraft = (c: DiscountCode | null, kind: CodeDraft['kind'] = 'coupon'): CodeDraft =>
  c
    ? {
        isNew: false, code: c.code, kind: c.kind, channel: c.channel ?? '', off: c.percentOff ? 'percent' : c.amountOff ? 'amount' : 'none',
        value: c.percentOff ? String(c.percentOff) : c.amountOff ? dollars(c.amountOff) : '', duration: c.duration, months: c.months ? String(c.months) : '',
        plans: c.plans, starts: dateIn(c.starts), ends: c.ends ? dateIn(new Date(Date.parse(c.ends) - 1).toISOString()) : '',
        maxUses: c.maxUses === null ? '' : String(c.maxUses), commissionPct: c.commissionPct === null ? '' : String(c.commissionPct), note: c.note ?? '', active: c.active,
      }
    : {
        isNew: true, code: '', kind, channel: '', off: kind === 'affiliate' ? 'none' : 'percent', value: '', duration: 'once', months: '3', plans: [], starts: '',
        ends: '', maxUses: '', commissionPct: '', note: '', active: true,
      }

function CodesView({ data, mayEdit, mayDelete, act }: { data: PricingData; mayEdit: boolean; mayDelete: boolean; act: Act }) {
  const [draft, setDraft] = useState<CodeDraft | null>(null)
  const [filter, setFilter] = useState<'all' | 'coupon' | 'affiliate'>('all')
  const [copied, setCopied] = useState<string | null>(null)
  const paid = data.plans.filter((p) => p.id !== FREE_PLAN)
  const set = (patch: Partial<CodeDraft>) => setDraft((d) => (d ? { ...d, ...patch } : d))
  const rows = data.codes.filter((c) => filter === 'all' || c.kind === filter)
  const link = (code: string) => `${import.meta.env.DEV ? window.location.origin : APP_URL}/?code=${encodeURIComponent(code)}`

  async function save() {
    if (!draft) return
    const body = {
      isNew: draft.isNew, code: draft.code, kind: draft.kind, channel: draft.channel,
      percentOff: draft.off === 'percent' ? Number(draft.value) : null, amountOff: draft.off === 'amount' ? toCents(draft.value) : null,
      duration: draft.duration, months: draft.duration === 'repeating' ? Number(draft.months) : null, plans: draft.plans,
      starts: dateOut(draft.starts), ends: dateOut(draft.ends, true), maxUses: draft.maxUses.trim() === '' ? null : Number(draft.maxUses),
      commissionPct: draft.commissionPct.trim() === '' ? null : Number(draft.commissionPct), note: draft.note, active: draft.active,
    }
    if (await act(() => api('/api/admin/pricing/code', { method: 'PUT', body }), `${draft.code.toUpperCase()} saved ✓`)) setDraft(null)
  }
  const remove = (c: CodeRow) => {
    const used = c.stats.signups || c.stats.redemptions || c.stats.payers
    if (confirm(used ? `${c.code} has sign-ups or payments, so it will be switched off (its reports stay). Go ahead?` : `Delete ${c.code}?`))
      void act(() => api(`/api/admin/pricing/code?code=${encodeURIComponent(c.code)}`, { method: 'DELETE' }), used ? `${c.code} switched off` : `${c.code} deleted`)
  }
  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(link(code))
      setCopied(code)
      window.setTimeout(() => setCopied(null), 1500)
    } catch {
      prompt('Copy this link', link(code))
    }
  }

  return (
    <>
      <p className="small muted" style={{ margin: 0 }}>
        <b>Coupons</b> give a discount to anyone with the code. <b>Affiliate codes</b> belong to a partner or channel: sign-ups through
        the code's link, and every payment those students make later, are credited to it, with or without a discount. A student types
        the code on the Plans page, or it is filled in for them when they arrive through the link. Changing a code's discount only
        affects people who use it from now on.
      </p>
      <div className="row" style={{ gap: 8 }}>
        <div className="seg" style={{ maxWidth: 360 }}>
          {(['all', 'coupon', 'affiliate'] as const).map((f) => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'coupon' ? 'Coupons' : 'Affiliates'}
            </button>
          ))}
        </div>
        {mayEdit && !draft && (
          <>
            <button className="btn secondary" onClick={() => setDraft(codeDraft(null, 'coupon'))}>
              + Coupon
            </button>
            <button className="btn secondary" onClick={() => setDraft(codeDraft(null, 'affiliate'))}>
              + Affiliate code
            </button>
          </>
        )}
      </div>
      {draft && <CodeEditor draft={draft} set={set} paid={paid} onSave={save} onCancel={() => setDraft(null)} />}
      <div className="table-wrap card">
        <table className="data">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Valid</th>
              <th>Used</th>
              <th>Sign-ups</th>
              <th>Paying now</th>
              <th>Revenue</th>
              <th>Commission</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.code}>
                <td>
                  <b>{c.code}</b>
                  <div className="small muted">
                    {c.kind === 'affiliate' ? `Affiliate · ${c.channel}` : 'Coupon'}
                    {c.note ? ` · ${c.note}` : ''}
                  </div>
                </td>
                <td>
                  {describeDiscount(c)}
                  <div className="small muted">{c.plans.length ? c.plans.map((id) => data.plans.find((p) => p.id === id)?.name ?? id).join(', ') : 'Every paid plan'}</div>
                </td>
                <td className="small">
                  {c.starts ? `from ${when(c.starts)}` : ''}
                  {c.starts && c.ends ? <br /> : null}
                  {c.ends ? `until ${lastDay(c.ends)}` : !c.starts ? 'Always' : ''}
                </td>
                <td>
                  {int(c.stats.redemptions)}
                  {c.maxUses !== null && ` / ${int(c.maxUses)}`}
                </td>
                <td>{int(c.stats.signups)}</td>
                <td>{int(c.stats.payingNow)}</td>
                <td>{money(c.stats.revenue).replace('Free', '$0')}</td>
                <td>{c.commissionPct !== null ? `${money(c.stats.commission).replace('Free', '$0')} (${c.commissionPct}%)` : '—'}</td>
                <td>{c.maxUses !== null && c.stats.redemptions >= c.maxUses && c.active ? 'Used up' : codeState(c)}</td>
                <td>
                  <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                    <button className="btn ghost" onClick={() => void copy(c.code)} title={link(c.code)}>
                      {copied === c.code ? 'Copied ✓' : 'Copy link'}
                    </button>
                    {mayEdit && (
                      <button className="btn ghost" onClick={() => setDraft(codeDraft(c))}>
                        Edit
                      </button>
                    )}
                    {mayDelete && c.active && (
                      <button className="btn ghost" onClick={() => remove(c)}>
                        {c.stats.signups || c.stats.redemptions || c.stats.payers ? 'Switch off' : 'Delete'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="small muted">No codes yet.</p>}
      </div>
      <p className="tiny muted" style={{ margin: 0 }}>
        Revenue is what Stripe collected from students credited to the code (after discounts). Commission is that revenue × the
        code's commission %, for you to pay the partner; nothing is paid automatically.
      </p>
    </>
  )
}

function CodeEditor({ draft, set, paid, onSave, onCancel }: { draft: CodeDraft; set: (p: Partial<CodeDraft>) => void; paid: Plan[]; onSave: () => void; onCancel: () => void }) {
  const preview =
    draft.off === 'none'
      ? 'No discount (tracking only)'
      : describeDiscount({
          percentOff: draft.off === 'percent' ? Number(draft.value) || null : null,
          amountOff: draft.off === 'amount' ? toCents(draft.value) : null,
          duration: draft.duration,
          months: Number(draft.months) || null,
        })
  return (
    <div className="card stack">
      <b>{draft.isNew ? (draft.kind === 'affiliate' ? 'New affiliate code' : 'New coupon') : `Edit ${draft.code}`}</b>
      <div className="form-grid">
        <label className="field">
          <span>Code {draft.isNew ? '' : '(cannot change)'}</span>
          <input className="admin-input" value={draft.code} disabled={!draft.isNew} maxLength={30} onChange={(e) => set({ code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })} placeholder={draft.kind === 'affiliate' ? 'MSLEE' : 'FALL20'} />
        </label>
        <label className="field">
          <span>Type</span>
          <select className="admin-input" value={draft.kind} onChange={(e) => set({ kind: e.target.value as CodeDraft['kind'] })}>
            <option value="coupon">Coupon</option>
            <option value="affiliate">Affiliate (partner or channel)</option>
          </select>
        </label>
        <label className="field">
          <span>Partner or channel{draft.kind === 'coupon' ? ' (optional)' : ''}</span>
          <input className="admin-input" value={draft.channel} maxLength={60} onChange={(e) => set({ channel: e.target.value })} placeholder="TikTok, Ms Lee (teacher), newsletter…" />
        </label>
        <label className="field">
          <span>Discount</span>
          <select className="admin-input" value={draft.off} onChange={(e) => set({ off: e.target.value as CodeDraft['off'] })}>
            <option value="percent">Percent off</option>
            <option value="amount">Dollars off</option>
            {draft.kind === 'affiliate' && <option value="none">No discount (tracking only)</option>}
          </select>
        </label>
        {draft.off !== 'none' && (
          <>
            <label className="field">
              <span>{draft.off === 'percent' ? 'Percent (1–100)' : 'Dollars off'}</span>
              <input className="admin-input" inputMode="decimal" value={draft.value} onChange={(e) => set({ value: e.target.value })} placeholder={draft.off === 'percent' ? '20' : '2.00'} />
            </label>
            <label className="field">
              <span>For</span>
              <select className="admin-input" value={draft.duration} onChange={(e) => set({ duration: e.target.value as CodeDraft['duration'] })}>
                <option value="once">The first payment</option>
                <option value="repeating">A number of months</option>
                <option value="forever">Every payment</option>
              </select>
            </label>
            {draft.duration === 'repeating' && (
              <label className="field">
                <span>Months</span>
                <input className="admin-input" inputMode="numeric" value={draft.months} onChange={(e) => set({ months: e.target.value.replace(/\D/g, '') })} />
              </label>
            )}
          </>
        )}
        <label className="field">
          <span>Starts (empty = now)</span>
          <input type="date" className="admin-input" value={draft.starts} onChange={(e) => set({ starts: e.target.value })} />
        </label>
        <label className="field">
          <span>Last day (empty = no end)</span>
          <input type="date" className="admin-input" value={draft.ends} min={draft.starts || undefined} onChange={(e) => set({ ends: e.target.value })} />
        </label>
        <label className="field">
          <span>Max people (empty = no limit)</span>
          <input className="admin-input" inputMode="numeric" value={draft.maxUses} onChange={(e) => set({ maxUses: e.target.value.replace(/\D/g, '') })} />
        </label>
        {draft.kind === 'affiliate' && (
          <label className="field">
            <span>Commission % (optional)</span>
            <input className="admin-input" inputMode="decimal" value={draft.commissionPct} onChange={(e) => set({ commissionPct: e.target.value })} placeholder="20" />
          </label>
        )}
      </div>
      <div className="field">
        <span>Works with</span>
        <div className="chips">
          <button type="button" className={`chip ${draft.plans.length === 0 ? 'on' : ''}`} onClick={() => set({ plans: [] })}>
            Every paid plan {draft.plans.length === 0 && '✓'}
          </button>
          {paid.map((p) => {
            const on = draft.plans.includes(p.id)
            return (
              <button key={p.id} type="button" className={`chip ${on ? 'on' : ''}`} onClick={() => set({ plans: on ? draft.plans.filter((x) => x !== p.id) : [...draft.plans, p.id] })}>
                {p.name} {on && '✓'}
              </button>
            )
          })}
        </div>
      </div>
      <label className="field">
        <span>Note (only admins see it)</span>
        <input className="admin-input" value={draft.note} maxLength={200} onChange={(e) => set({ note: e.target.value })} />
      </label>
      <label className="row small" style={{ gap: 8 }}>
        <input type="checkbox" checked={draft.active} onChange={(e) => set({ active: e.target.checked })} /> Active
      </label>
      <p className="small" style={{ margin: 0 }}>
        Students get: <b>{preview}</b>
      </p>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn" onClick={onSave}>
          Save
        </button>
        <button className="btn secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

// ---------- channels ----------

function ChannelsView({ data }: { data: PricingData }) {
  const rows = useMemo(() => {
    const m = new Map<string, { channel: string; codes: string[] } & CodeStats>()
    for (const c of data.codes) {
      const key = c.channel || (c.kind === 'coupon' ? '(coupons with no channel)' : '(no channel)')
      const r = m.get(key) ?? { channel: key, codes: [], signups: 0, redemptions: 0, payingNow: 0, payers: 0, revenue: 0, commission: 0 }
      r.codes.push(c.code)
      for (const k of ['signups', 'redemptions', 'payingNow', 'payers', 'revenue', 'commission'] as const) r[k] += c.stats[k]
      m.set(key, r)
    }
    return [...m.values()].sort((a, b) => b.revenue - a.revenue || b.signups - a.signups)
  }, [data.codes])
  const total = rows.reduce((s, r) => s + r.revenue, 0)
  return (
    <>
      <p className="small muted" style={{ margin: 0 }}>
        Every code grouped by its partner or channel. Conversion = students who ever paid ÷ sign-ups through the channel's links
        (students who only typed the code at checkout count as paying but not as sign-ups). For channels without a code, see
        Dashboard → sign-ups by campaign tag (utm_source).
      </p>
      <div className="table-wrap card">
        <table className="data">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Codes</th>
              <th>Sign-ups</th>
              <th>Used at checkout</th>
              <th>Ever paid</th>
              <th>Conversion</th>
              <th>Paying now</th>
              <th>Revenue</th>
              <th>Share</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.channel}>
                <td>
                  <b>{r.channel}</b>
                </td>
                <td className="small">{r.codes.join(', ')}</td>
                <td>{int(r.signups)}</td>
                <td>{int(r.redemptions)}</td>
                <td>{int(r.payers)}</td>
                <td>{pct(r.payers, r.signups)}</td>
                <td>{int(r.payingNow)}</td>
                <td>{money(r.revenue).replace('Free', '$0')}</td>
                <td>{pct(r.revenue, total)}</td>
                <td>{r.commission ? money(r.commission) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="small muted">Make an affiliate code per partner or channel to see them here.</p>}
      </div>
    </>
  )
}

// ---------- history ----------

function LogView({ data }: { data: PricingData }) {
  return (
    <div className="table-wrap card">
      <table className="data">
        <thead>
          <tr>
            <th>When</th>
            <th>Who</th>
            <th>What</th>
          </tr>
        </thead>
        <tbody>
          {data.log.map((l, i) => (
            <tr key={i}>
              <td className="small">{new Date(l.at).toLocaleString()}</td>
              <td className="small">{l.by_email}</td>
              <td>
                {l.what}
                <details className="small muted">
                  <summary>Details</summary>
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(l.detail, null, 1)}</pre>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!data.log.length && <p className="small muted">No changes yet.</p>}
    </div>
  )
}
