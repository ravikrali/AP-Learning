// Dashboard → Business: free-to-paid conversion, monthly churn, sign-ups by campaign tag, and
// ad spend (typed in here) so the cost of a sign-up can be worked out.
import { useMemo, useState } from 'react'
import { api } from '../lib/api'
import { churnByMonth, conversion, costPerSignup, NO_SOURCE, type MonthCount } from '../../shared/business'
import { Columns } from './charts'
import { monthKey } from './forecast'
import { useAdmin } from './context'

export interface BusinessData {
  /** students with at least one paid invoice, ever */
  everPaid: number
  cohorts: { month: string; signups: number; paid: number }[]
  payers: MonthCount[]
  retained: MonthCount[]
  utm: { month: string; source: string | null; campaign: string | null; n: number }[]
  spend: { month: string; source: string; amount: number }[]
}

const pct = (x: number | null) => (x === null ? '–' : `${(x * 100).toFixed(x > 0 && x < 0.1 ? 1 : 0)}%`)
const usd = (cents: number) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const monthName = (m: string) => new Date(`${m}-15T12:00:00Z`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
const shortMonth = (m: string) => `${new Date(`${m}-15T12:00:00Z`).toLocaleDateString(undefined, { month: 'short' })} ’${m.slice(2, 4)}`

export function Business({ data, students, reload }: { data: BusinessData; students: number; reload: () => void }) {
  const { can } = useAdmin()
  const current = monthKey(new Date())
  const [month, setMonth] = useState(current)
  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const d = useMemo(() => {
    const churn = churnByMonth(data.payers, data.retained, current)
    const full = churn.filter((c) => !c.partial)
    // sign-ups per month and source, with what was spent on that source that month
    const bySource = new Map<string, { month: string; source: string; signups: number; campaigns: Set<string>; spend: number }>()
    const row = (m: string, s: string) => {
      const k = `${m}|${s}`
      let r = bySource.get(k)
      if (!r) bySource.set(k, (r = { month: m, source: s, signups: 0, campaigns: new Set(), spend: 0 }))
      return r
    }
    for (const u of data.utm) {
      const r = row(u.month, u.source ?? NO_SOURCE)
      r.signups += u.n
      if (u.campaign) r.campaigns.add(u.campaign)
    }
    for (const s of data.spend) row(s.month, s.source).spend = s.amount
    const months = [...new Set([...bySource.values()].map((r) => r.month))].sort().reverse()
    return {
      churn,
      lastFull: full[full.length - 1] ?? null,
      months,
      rows: [...bySource.values()].sort((a, b) => b.month.localeCompare(a.month) || b.spend - a.spend || b.signups - a.signups),
      sources: [...new Set(data.utm.map((u) => u.source).filter((s): s is string => !!s))].sort(),
    }
  }, [data, current])

  const [shownMonth, setShownMonth] = useState<string | null>(null)
  const viewMonth = shownMonth ?? d.months[0] ?? current
  const monthRows = d.rows.filter((r) => r.month === viewMonth)
  // cost per sign-up only counts the sign-ups that came from the sources money was spent on
  const paidRows = monthRows.filter((r) => r.spend > 0)
  const monthSpend = paidRows.reduce((s, r) => s + r.spend, 0)
  const monthSignups = paidRows.reduce((s, r) => s + r.signups, 0)

  async function save() {
    setMsg(null)
    setBusy(true)
    try {
      await api('/api/admin/spend', { body: { month, source: source.trim(), amount: Number(amount) } })
      setMsg(`Saved ${usd(Math.round(Number(amount) * 100))} for ${source.trim()} in ${monthName(month)} ✓`)
      setAmount('')
      setShownMonth(month)
      reload()
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card">
      <h3>Business</h3>
      <div className="tiles small-tiles">
        <div className="tile">
          <b>{pct(conversion(students, data.everPaid))}</b>
          <span>Free-to-paid conversion</span>
          <small>
            {data.everPaid} of {students} students have paid at least once
          </small>
        </div>
        <div className="tile">
          <b>{d.lastFull ? pct(d.lastFull.rate) : '–'}</b>
          <span>Churn last full month</span>
          <small>{d.lastFull ? `${d.lastFull.lost} of ${d.lastFull.start} subscribers left in ${monthName(d.lastFull.month)}` : 'No paid month to compare yet'}</small>
        </div>
        <div className="tile">
          <b>{costPerSignup(monthSpend, monthSignups) === null ? '–' : usd(costPerSignup(monthSpend, monthSignups)!)}</b>
          <span>Ad cost per sign-up</span>
          <small>
            {usd(monthSpend)} spent, {monthSignups} sign-up{monthSignups === 1 ? '' : 's'} from those ads in {monthName(viewMonth)}
          </small>
        </div>
      </div>

      <h4>Monthly churn</h4>
      {d.churn.length ? (
        <>
          <Columns
            label="Share of last month's subscribers who did not pay again, per month"
            data={d.churn.map((c) => ({ label: shortMonth(c.month), value: Math.round((c.rate ?? 0) * 1000) / 10, ghost: c.partial }))}
            format={(n) => `${n}%`}
            height={150}
          />
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Paying the month before</th>
                  <th>Did not pay again</th>
                  <th>Churn</th>
                </tr>
              </thead>
              <tbody>
                {[...d.churn].reverse().map((c) => (
                  <tr key={c.month}>
                    <td>
                      {monthName(c.month)}
                      {c.partial && <span className="muted"> (so far)</span>}
                    </td>
                    <td>{c.start}</td>
                    <td>{c.lost}</td>
                    <td>
                      <span className={`acc ${(c.rate ?? 0) > 0.2 ? 'low' : (c.rate ?? 0) > 0.1 ? 'mid' : 'ok'}`}>{pct(c.rate)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="small muted">Churn appears here one month after the first paid invoice.</p>
      )}
      <p className="tiny muted">
        Churn for a month = subscribers who paid the month before and did not pay in that month. AP® Exams are in May, so expect June and
        July to stand out. The current month is hatched: subscribers who renew later this month still count as gone for now.
      </p>

      <h4>Free-to-paid conversion by sign-up month</h4>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Signed up in</th>
              <th>Sign-ups</th>
              <th>Paid since</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            {[...data.cohorts].reverse().map((c) => (
              <tr key={c.month}>
                <td>{monthName(c.month)}</td>
                <td>{c.signups}</td>
                <td>{c.paid}</td>
                <td>{pct(conversion(c.signups, c.paid))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tiny muted">“Paid” means at least one paid invoice. Plans granted by an admin do not count.</p>

      <h4>Sign-ups by campaign tag, with ad spend</h4>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <label className="small">
          Month{' '}
          <select className="admin-input" value={viewMonth} onChange={(e) => setShownMonth(e.target.value)}>
            {(d.months.includes(viewMonth) ? d.months : [viewMonth, ...d.months]).map((m) => (
              <option key={m} value={m}>
                {monthName(m)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {monthRows.length ? (
        <div className="table-wrap" style={{ marginTop: 8 }}>
          <table className="data">
            <thead>
              <tr>
                <th>Source (utm_source)</th>
                <th>Campaigns</th>
                <th>Sign-ups</th>
                <th>Ad spend</th>
                <th>Cost per sign-up</th>
              </tr>
            </thead>
            <tbody>
              {monthRows.map((r) => {
                const cps = costPerSignup(r.spend, r.signups)
                return (
                  <tr key={r.source}>
                    <td>{r.source === NO_SOURCE ? 'No tag (direct, search, shared links)' : r.source}</td>
                    <td className="small">{[...r.campaigns].join(', ')}</td>
                    <td>{r.signups}</td>
                    <td>{r.spend ? usd(r.spend) : ''}</td>
                    <td>{r.spend ? (cps === null ? 'No sign-ups yet' : usd(cps)) : ''}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="small muted">No sign-ups or spend recorded for {monthName(viewMonth)}.</p>
      )}
      <p className="tiny muted">
        The tag is read from the link a new student arrived on, for example <code>?utm_source=tiktok&amp;utm_campaign=fall</code>. Students who
        signed up before this was added show under “No tag”.
      </p>

      {can('dashboard', 'edit') && (
        <>
          <h4>Enter ad spend</h4>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <label className="small">
              Month
              <br />
              <input className="admin-input" type="month" value={month} max={current} onChange={(e) => setMonth(e.target.value)} />
            </label>
            <label className="small">
              Source (the utm_source on the ad link)
              <br />
              <input className="admin-input" list="spend-sources" value={source} maxLength={80} onChange={(e) => setSource(e.target.value)} placeholder="tiktok" />
              <datalist id="spend-sources">
                {d.sources.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </label>
            <label className="small">
              Spent (US dollars)
              <br />
              <input className="admin-input" type="number" min={0} step="0.01" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </label>
            <button className="btn" disabled={busy || !month || !source.trim() || amount === ''} onClick={() => void save()}>
              Save
            </button>
          </div>
          <p className="tiny muted">One amount per month and source. Saving again replaces it; saving 0 removes it.</p>
          {msg && <p className="small">{msg}</p>}
        </>
      )}
    </section>
  )
}
