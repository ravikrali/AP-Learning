// Admin → Audience: people who have not signed in yet (welcome-page visitors), where they come
// from, how far they get, the "tell me when it's ready" list, and students still on the free plan.

import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { catalogCourse } from '../../shared/catalog'
import { Columns, Ranked } from './charts'
import { Tile, countryName, int, lastDays } from './Dashboard'

interface Group {
  label: string | null
  visitors: number
  anonymous: number
  signed: number
}

interface Lead {
  email: string
  name: string | null
  course: string | null
  country: string | null
  channel: string | null
  source: string | null
  created_at: string
  signed_up: number
}

interface Audience {
  generatedAt: string
  visitors: {
    all_time: number
    d30: number | null
    d7: number | null
    anon30: number | null
    signed30: number | null
    returning30: number | null
    byDay: { day: string; visitors: number; signins: number; leads: number }[]
    byCountry: Group[]
    byRegion: { country: string; region: string; visitors: number }[]
    byChannel: Group[]
    bySource: Group[]
    byCampaign: Group[]
    byDevice: Group[]
    byLang: Group[]
    funnel: { event: string; visitors: number }[]
  }
  leads: { total: number; d30: number | null; items: Lead[] }
  free: { n: number; new30: number | null; wau: number | null; mau: number | null; minutes30: number | null; lessons30: number | null; byCountry: { country: string; n: number }[] }
}

const FUNNEL: { event: string; label: string }[] = [
  { event: 'view', label: 'Opened the welcome page' },
  { event: 'see_how', label: 'Scrolled to “How it works”' },
  { event: 'see_courses', label: 'Saw the course list' },
  { event: 'see_pricing', label: 'Saw the prices' },
  { event: 'see_final', label: 'Reached the end of the page' },
  { event: 'lead', label: 'Left an email' },
  { event: 'signin', label: 'Signed in' },
]

const langName = (() => {
  try {
    const names = new Intl.DisplayNames(undefined, { type: 'language' })
    return (c: string) => (c === '??' ? 'Unknown' : (names.of(c) ?? c))
  } catch {
    return (c: string) => c
  }
})()
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '–')
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** A ranked list where each row also says how many of those visitors went on to sign in. */
function Sources({ rows, name = (l) => l ?? 'None' }: { rows: Group[]; name?: (label: string | null) => string }) {
  if (!rows.length) return <p className="small muted">No visits yet.</p>
  return <Ranked format={int} rows={rows.map((r) => ({ label: name(r.label), value: r.visitors, note: r.signed ? `${r.signed} signed in (${pct(r.signed, r.visitors)})` : 'none signed in yet' }))} />
}

function csv(rows: Lead[]): string {
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const head = ['email', 'name', 'course', 'country', 'channel', 'source', 'date', 'has_account']
  return [head.join(','), ...rows.map((l) => [l.email, l.name, l.course ? (catalogCourse(l.course)?.title ?? l.course) : '', l.country, l.channel, l.source, l.created_at.slice(0, 10), l.signed_up ? 'yes' : 'no'].map(cell).join(','))].join('\r\n')
}

export function AudienceTab() {
  const [a, setA] = useState<Audience | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const load = () =>
    api<Audience>('/api/admin/audience')
      .then(setA)
      .catch((e) => setErr(e.message))
  useEffect(() => {
    void load()
  }, [])

  if (err) return <div className="card">Couldn't load the audience numbers: {err}</div>
  if (!a) return <div className="card muted">Loading the numbers…</div>
  const v = a.visitors
  const d30 = v.d30 ?? 0
  const anon30 = v.anon30 ?? 0
  const signed30 = v.signed30 ?? 0
  const funnel = new Map(v.funnel.map((f) => [f.event, f.visitors]))
  const views = funnel.get('view') ?? 0

  function download() {
    const url = URL.createObjectURL(new Blob([csv(a!.leads.items)], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `ap-learning-leads-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  async function copyEmails() {
    await navigator.clipboard.writeText(a!.leads.items.map((l) => l.email).join(', '))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="dash">
      <div className="row" style={{ alignItems: 'baseline' }}>
        <h2 className="grow" style={{ margin: 0 }}>Audience</h2>
        <span className="small muted">Updated {new Date(a.generatedAt).toLocaleTimeString()}</span>
        <button className="btn ghost" onClick={() => void load()}>
          ↻
        </button>
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        People who open the welcome page before signing in. Each browser gets a random ID: there is no name or email unless the visitor leaves one
        in the “Tell me when it’s ready” form. Browsers that ask not to be tracked, and bots, are not counted.
      </p>

      <div className="tiles">
        <Tile value={int(d30)} label="Visitors · 30 days" sub={`${int(v.d7 ?? 0)} in the last 7 days · ${int(v.all_time)} all time`} />
        <Tile value={int(anon30)} label="Not signed in · 30 days" sub={`${pct(anon30, d30)} of visitors`} />
        <Tile value={pct(signed30, d30)} label="Visitors who signed in" sub={`${int(signed30)} of ${int(d30)} in 30 days`} />
        <Tile value={int(a.leads.total)} label="Emails left" sub={`+${int(a.leads.d30 ?? 0)} in 30 days`} />
      </div>

      <section className="card">
        <h3>Visitors per day · last 60 days</h3>
        <Columns label="Welcome-page visitors per day" data={lastDays(v.byDay, 60, (r) => r?.visitors ?? 0)} format={int} />
        <h4>Of those, signed in that day</h4>
        <Columns label="Visitors who signed in, per day" data={lastDays(v.byDay, 60, (r) => r?.signins ?? 0)} format={int} height={110} />
      </section>

      <div className="dash-grid">
        <section className="card">
          <h3>What visitors do · last 30 days</h3>
          <Ranked format={int} rows={FUNNEL.map((f) => ({ label: f.label, value: funnel.get(f.event) ?? 0, note: f.event === 'view' ? undefined : `${pct(funnel.get(f.event) ?? 0, views)} of visitors` }))} />
          <p className="tiny muted">
            {int(v.returning30 ?? 0)} visitor{(v.returning30 ?? 0) === 1 ? '' : 's'} ({pct(v.returning30 ?? 0, d30)}) came back more than once. Each step counts a visitor once.
          </p>
        </section>

        <section className="card">
          <h3>Where they come from · last 90 days</h3>
          <h4>Channel</h4>
          <Sources rows={v.byChannel} />
          <h4>Site or link</h4>
          <Sources rows={v.bySource.slice(0, 12)} />
          {v.byCampaign.length > 0 && (
            <>
              <h4>Campaign</h4>
              <Sources rows={v.byCampaign} />
            </>
          )}
          <p className="tiny muted">
            Channel comes from the link tags (utm_source, utm_medium, utm_campaign) when a link has them, otherwise from the site that linked here.
            “Direct” means typed in, bookmarked, or opened from an app that hides where it came from.
          </p>
        </section>
      </div>

      <div className="dash-grid">
        <section className="card">
          <h3>Geography · last 90 days</h3>
          <h4>Visitors by country</h4>
          <Sources rows={v.byCountry.slice(0, 12)} name={(l) => countryName(l ?? '??')} />
          {v.byRegion.length > 0 && (
            <>
              <h4>Top regions (not signed in)</h4>
              <Ranked format={int} rows={v.byRegion.map((r) => ({ label: `${r.region}, ${r.country}`, value: r.visitors }))} />
            </>
          )}
          <p className="tiny muted">Country and region come from the network location of the first visit.</p>
        </section>

        <section className="card">
          <h3>Device and language · last 90 days</h3>
          <h4>Device</h4>
          <Sources rows={v.byDevice} name={(l) => cap(l ?? 'unknown')} />
          <h4>Browser language</h4>
          <Sources rows={v.byLang.slice(0, 8)} name={(l) => langName(l ?? '??')} />
        </section>
      </div>

      <section className="card">
        <div className="row">
          <h3 className="grow" style={{ margin: 0 }}>Emails left on the welcome page</h3>
          {a.leads.items.length > 0 && (
            <>
              <button className="btn secondary" onClick={() => void copyEmails()}>
                {copied ? 'Copied ✓' : 'Copy emails'}
              </button>
              <button className="btn secondary" onClick={download}>
                Download CSV
              </button>
            </>
          )}
        </div>
        {a.leads.items.length ? (
          <div className="table-wrap" style={{ marginTop: 10 }}>
            <table className="data">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Waiting for</th>
                  <th>Country</th>
                  <th>Came from</th>
                  <th>Date</th>
                  <th>Has an account</th>
                </tr>
              </thead>
              <tbody>
                {a.leads.items.map((l) => (
                  <tr key={l.email}>
                    <td>{l.email}</td>
                    <td>{l.name ?? ''}</td>
                    <td>{l.course ? (catalogCourse(l.course)?.title ?? l.course) : 'Any new course'}</td>
                    <td>{l.country ? countryName(l.country) : ''}</td>
                    <td>{[l.channel, l.source].filter(Boolean).join(' · ')}</td>
                    <td>{new Date(l.created_at).toLocaleDateString()}</td>
                    <td>{l.signed_up ? 'Yes' : 'Not yet'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="small muted">Nobody has left an email yet.</p>
        )}
      </section>

      <section className="card">
        <h3>Signed in but not subscribed (free plan)</h3>
        <div className="tiles small-tiles">
          <Tile value={int(a.free.n)} label="Students on the free plan" sub={`+${int(a.free.new30 ?? 0)} in 30 days`} />
          <Tile value={int(a.free.wau ?? 0)} label="Active in 7 days" />
          <Tile value={int(a.free.mau ?? 0)} label="Active in 30 days" />
          <Tile value={`${int(a.free.minutes30 ?? 0)} min`} label="Studied in 30 days" sub={`${int(a.free.lessons30 ?? 0)} lessons finished`} />
        </div>
        <h4>Free-plan students by country</h4>
        <Ranked format={int} rows={a.free.byCountry.map((r) => ({ label: countryName(r.country), value: r.n }))} />
      </section>
    </div>
  )
}
