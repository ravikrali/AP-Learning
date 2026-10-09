import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { findLesson } from '../content'
import { catalogCourse, PLANS, type PlanId } from '../../shared/catalog'
import { addMonths, fillMonths, forecast, monthKey } from './forecast'
import { Columns, Line, Ranked, Split } from './charts'

interface Metrics {
  generatedAt: string
  users: { users: number; new7: number; new30: number; byDay: { day: string; n: number }[]; byCountry: { country: string; n: number }[] }
  plans: {
    byPlan: { plan: PlanId; paid: PlanId; n: number }[]
    byCountry: { country: string; plan: PlanId; n: number }[]
    changes: { month: string; from_plan: PlanId; to_plan: PlanId; n: number }[]
    paidRegions: { country: string; region: string; n: number }[]
  }
  revenue: { mrr: number; currency: string; byMonth: { month: string; amount: number; n: number }[] }
  engagement: {
    dau: number
    wau: number
    mau: number
    minutes30: number | null
    days30: number
    byDay: { day: string; users: number; minutes: number; lessons: number; attempts: number }[]
    events: { name: string; n: number }[]
  }
  topics: { lesson_id: string; course: string | null; users: number; seconds: number; attempts: number; ftc: number; wrong: number; tips: number }[]
  courses: { picks: { course: string; n: number }[]; interest: { course: string; n: number }[] }
}

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(undefined, { type: 'region' })
  } catch {
    return null
  }
})()
const countryName = (c: string) => (c && c !== '??' && c !== 'XX' ? (regionNames?.of(c) ?? c) : 'Unknown')
const usd = (cents: number) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`
const int = (n: number) => Math.round(n).toLocaleString()
const shortDay = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const shortMonth = (m: string) => `${new Date(m + '-15T12:00:00Z').toLocaleDateString(undefined, { month: 'short' })} ’${m.slice(2, 4)}`
const RANK: Record<PlanId, number> = { free: 0, three: 1, all: 2 }

const EVENT_LABEL: Record<string, string> = {
  video: 'YouTube video opened',
  tip: 'Quick tips opened',
  plan_create: 'Study plans made',
  plan_update: 'Study plans changed',
  plan_rebuild: 'Plans re-planned from today',
  calendar_link: 'Calendar subscriptions',
  calendar_download: 'Calendar files downloaded',
}

/** Every day in the last `n` days, with zeros where there was no data. */
function lastDays<T extends { day: string }>(rows: T[], n: number, pick: (r: T | undefined) => number) {
  const map = new Map(rows.map((r) => [r.day, r]))
  const out: { label: string; value: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10)
    out.push({ label: shortDay(d), value: pick(map.get(d)) })
  }
  return out
}

function Tile({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="tile">
      <b>{value}</b>
      <span>{label}</span>
      {sub && <small>{sub}</small>}
    </div>
  )
}

export function Dashboard() {
  const [m, setM] = useState<Metrics | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const load = () =>
    api<Metrics>('/api/admin/metrics')
      .then(setM)
      .catch((e) => setErr(e.message))
  useEffect(() => {
    void load()
  }, [])

  const derived = useMemo(() => {
    if (!m) return null
    const count = (plan: PlanId) => m.plans.byPlan.filter((r) => r.plan === plan).reduce((s, r) => s + r.n, 0)
    const paying = m.plans.byPlan.filter((r) => r.paid !== 'free').reduce((s, r) => s + r.n, 0)
    const comp = m.plans.byPlan.filter((r) => r.plan !== 'free' && r.paid === 'free').reduce((s, r) => s + r.n, 0)
    const current = monthKey(new Date())
    const history = fillMonths(m.revenue.byMonth, current).slice(-12)
    const f = forecast(m.revenue.byMonth, m.revenue.mrr)
    const revenueBars = [
      ...history.map((h) => ({ label: shortMonth(h.month), value: h.amount, ghost: false })),
      ...f.points.filter((p) => p.month > current).map((p) => ({ label: shortMonth(p.month), value: p.amount, ghost: true })),
    ]
    // subscriptions by country (anyone on a paid or granted plan)
    const subCountry = new Map<string, number>()
    for (const r of m.plans.byCountry) if (r.plan !== 'free') subCountry.set(r.country, (subCountry.get(r.country) ?? 0) + r.n)
    // plan changes per month
    const months = new Map<string, { started: number; upgraded: number; downgraded: number; ended: number }>()
    for (const c of m.plans.changes) {
      const row = months.get(c.month) ?? { started: 0, upgraded: 0, downgraded: 0, ended: 0 }
      if (c.from_plan === 'free') row.started += c.n
      else if (c.to_plan === 'free') row.ended += c.n
      else if (RANK[c.to_plan] > RANK[c.from_plan]) row.upgraded += c.n
      else row.downgraded += c.n
      months.set(c.month, row)
    }
    const topics = m.topics
      .filter((t) => t.attempts >= 5 && !t.lesson_id.startsWith('unit:'))
      .map((t) => {
        const ref = findLesson(t.lesson_id)
        return {
          ...t,
          title: ref?.lesson.title ?? t.lesson_id,
          ced: ref?.lesson.ced.join(', ') ?? '',
          expected: ref?.lesson.minutes ?? null,
          accuracy: t.ftc / t.attempts,
          avgMin: t.users ? t.seconds / 60 / t.users : 0,
        }
      })
    return {
      count,
      paying,
      comp,
      revenueBars,
      method: f.method,
      next: f.points.find((p) => p.month === addMonths(current, 1))?.amount ?? 0,
      subCountry: [...subCountry].sort((a, b) => b[1] - a[1]).slice(0, 12),
      months: [...months].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12),
      hardest: [...topics].sort((a, b) => a.accuracy - b.accuracy).slice(0, 12),
      slowest: topics.filter((t) => t.expected).sort((a, b) => b.avgMin / b.expected! - a.avgMin / a.expected!).slice(0, 8),
    }
  }, [m])

  if (err) return <div className="card">Couldn't load the dashboard: {err}</div>
  if (!m || !derived) return <div className="card muted">Loading the numbers…</div>
  const e = m.engagement
  const minutesPerActiveDay = e.days30 ? (e.minutes30 ?? 0) / e.days30 : 0

  return (
    <div className="dash">
      <div className="row" style={{ alignItems: 'baseline' }}>
        <h2 className="grow" style={{ margin: 0 }}>Dashboard</h2>
        <span className="small muted">Updated {new Date(m.generatedAt).toLocaleTimeString()}</span>
        <button className="btn ghost" onClick={() => void load()}>
          ↻
        </button>
      </div>

      <div className="tiles">
        <Tile value={int(m.users.users)} label="Students" sub={`+${int(m.users.new7 ?? 0)} this week · +${int(m.users.new30 ?? 0)} in 30 days`} />
        <Tile value={int(derived.paying)} label="Paying subscribers" sub={derived.comp ? `+${derived.comp} on granted plans` : undefined} />
        <Tile value={usd(m.revenue.mrr)} label="Monthly recurring revenue" sub={`Next month forecast ${usd(derived.next)}`} />
        <Tile value={int(e.wau)} label="Active this week" sub={`${int(e.dau)} today · ${int(e.mau)} in 30 days`} />
      </div>

      <section className="card">
        <h3>New sign-ups · last 90 days</h3>
        <Columns label="New sign-ups per day" data={lastDays(m.users.byDay, 90, (r) => r?.n ?? 0)} format={int} />
      </section>

      <div className="dash-grid">
        <section className="card">
          <h3>Subscriptions by plan</h3>
          <Split
            parts={(['free', 'three', 'all'] as PlanId[]).map((p) => ({ label: `${PLANS[p].name}${p === 'free' ? '' : ` ($${PLANS[p].price})`}`, value: derived.count(p) }))}
          />
          <h4>Plan changes by month</h4>
          {derived.months.length ? (
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>New paid</th>
                    <th>Upgrades</th>
                    <th>Downgrades</th>
                    <th>Back to free</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.months.map(([month, r]) => (
                    <tr key={month}>
                      <td>{shortMonth(month)}</td>
                      <td>{r.started}</td>
                      <td>{r.upgraded}</td>
                      <td>{r.downgraded}</td>
                      <td>{r.ended}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="small muted">No plan changes yet.</p>
          )}
        </section>

        <section className="card">
          <h3>Geography</h3>
          <h4>Subscribers by country</h4>
          <Ranked rows={derived.subCountry.map(([c, n]) => ({ label: countryName(c), value: n }))} format={int} />
          <h4>All students by country</h4>
          <Ranked rows={m.users.byCountry.slice(0, 12).map((r) => ({ label: countryName(r.country), value: r.n }))} format={int} />
          {m.plans.paidRegions.some((r) => r.region) && (
            <>
              <h4>Top subscriber regions</h4>
              <Ranked
                rows={m.plans.paidRegions.filter((r) => r.region).slice(0, 8).map((r) => ({ label: `${r.region}, ${r.country}`, value: r.n }))}
                format={int}
              />
            </>
          )}
          <p className="tiny muted">Country and region come from the network location at first sign-in.</p>
        </section>
      </div>

      <section className="card">
        <h3>Revenue · last 12 months and 6-month forecast</h3>
        <Columns label="Revenue per month" data={derived.revenueBars} format={usd} height={180} />
        <div className="legend">
          <span className="legend-item">
            <i className="s1" /> Paid invoices
          </span>
          <span className="legend-item">
            <i className="hatch" /> Forecast
          </span>
        </div>
        <p className="tiny muted">
          Forecast: {derived.method} Revenue is money actually collected (after discounts, before Stripe fees and refunds).
        </p>
      </section>

      <section className="card">
        <h3>Engagement · last 60 days</h3>
        <div className="tiles small-tiles">
          <Tile value={int(e.dau)} label="Active today" />
          <Tile value={int(e.wau)} label="Active in 7 days" />
          <Tile value={int(e.mau)} label="Active in 30 days" />
          <Tile value={`${minutesPerActiveDay.toFixed(0)} min`} label="Study time per active day" />
        </div>
        <h4>Active students per day</h4>
        <Line label="Active students per day" data={lastDays(e.byDay, 60, (r) => r?.users ?? 0)} format={int} />
        <h4>Minutes studied per day (all students)</h4>
        <Columns label="Minutes studied per day" data={lastDays(e.byDay, 60, (r) => r?.minutes ?? 0)} format={int} />
        <h4>Lessons finished per day</h4>
        <Columns label="Lessons finished per day" data={lastDays(e.byDay, 60, (r) => r?.lessons ?? 0)} format={int} height={120} />
        <h4>Feature use · last 30 days</h4>
        <Ranked rows={e.events.map((x) => ({ label: EVENT_LABEL[x.name] ?? x.name, value: x.n }))} format={int} />
      </section>

      <section className="card">
        <h3>Hardest topics</h3>
        <p className="small muted" style={{ marginTop: 0 }}>
          Lessons with at least 5 answers, sorted by how often questions are right on the first try. Low scores and lots of
          opened tips point to a lesson that may need a better explanation or a video.
        </p>
        <TopicTable rows={derived.hardest} />
        <h4>Taking much longer than planned</h4>
        <TopicTable rows={derived.slowest} />
      </section>

      <section className="card">
        <h3>Course demand</h3>
        <div className="dash-grid">
          <div>
            <h4>Picked courses</h4>
            <Ranked rows={m.courses.picks.map((r) => ({ label: catalogCourse(r.course)?.title ?? r.course, value: r.n }))} format={int} />
          </div>
          <div>
            <h4>"I want this" votes for coming courses</h4>
            <Ranked rows={m.courses.interest.map((r) => ({ label: catalogCourse(r.course)?.title ?? r.course, value: r.n }))} format={int} />
          </div>
        </div>
      </section>
    </div>
  )
}

function TopicTable({ rows }: { rows: { lesson_id: string; title: string; ced: string; users: number; attempts: number; accuracy: number; avgMin: number; expected: number | null; tips: number }[] }) {
  if (!rows.length) return <p className="small muted">Not enough answers yet.</p>
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Lesson</th>
            <th>Students</th>
            <th>Answers</th>
            <th>Right first try</th>
            <th>Avg time</th>
            <th>Tips opened</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.lesson_id}>
              <td>
                <b>{t.title}</b>
                {t.ced && <span className="muted"> · {t.ced}</span>}
              </td>
              <td>{t.users}</td>
              <td>{t.attempts}</td>
              <td>
                <span className={`acc ${t.accuracy < 0.5 ? 'low' : t.accuracy < 0.7 ? 'mid' : 'ok'}`}>{Math.round(t.accuracy * 100)}%</span>
              </td>
              <td>
                {t.avgMin.toFixed(0)} min{t.expected ? <span className="muted"> / {t.expected} planned</span> : null}
              </td>
              <td>{t.tips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
