import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RichText } from '../lib/RichText'
import { TopBar } from '../components/bits'
import { useApp } from '../lib/app'
import { track } from '../lib/track'
import { chiCrit, chiUpper, invNorm, invT, normalcdf, tCdf } from '../lib/stats'
import { STATS_SHEET as SHEET } from '../content/stats/formulas'

const fmt = (x: number, d = 4) => (Number.isFinite(x) ? Number(x.toFixed(d)).toString() : '—')
const num = (s: string) => (s.trim() === '' ? NaN : Number(s))

function Field({ label, value, onChange, width = 90 }: { label: string; value: string; onChange: (v: string) => void; width?: number }) {
  return (
    <label className="calc-field">
      <span className="small muted">{label}</span>
      <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={{ width }} aria-label={label} />
    </label>
  )
}

function NormalCalc() {
  const [mu, setMu] = useState('0')
  const [sigma, setSigma] = useState('1')
  const [lo, setLo] = useState('-1.96')
  const [hi, setHi] = useState('1.96')
  const [area, setArea] = useState('0.95')
  const m = num(mu)
  const s = num(sigma)
  const parseEnd = (v: string, inf: number) => (v.trim() === '' ? inf : num(v))
  const a = s > 0 ? normalcdf(parseEnd(lo, -Infinity), parseEnd(hi, Infinity), m, s) : NaN
  const p = num(area)
  const ok = s > 0 && p > 0 && p < 1
  return (
    <div className="card stack">
      <b>Normal distribution</b>
      <div className="row wrap">
        <Field label="Mean μ" value={mu} onChange={setMu} />
        <Field label="SD σ" value={sigma} onChange={setSigma} />
      </div>
      <div className="small muted">Area between two values (leave one blank for an open end)</div>
      <div className="row wrap">
        <Field label="Lower" value={lo} onChange={setLo} />
        <Field label="Upper" value={hi} onChange={setHi} />
        <span className="calc-out">
          Area = <b>{fmt(a)}</b>
        </span>
      </div>
      <div className="small muted">Value with a given area</div>
      <div className="row wrap">
        <Field label="Area" value={area} onChange={setArea} />
        <span className="calc-out small">
          to the left: <b>{ok ? fmt(invNorm(p, m, s)) : '—'}</b>
          <br />
          to the right: <b>{ok ? fmt(invNorm(1 - p, m, s)) : '—'}</b>
          <br />
          middle {ok ? fmt(p * 100, 2) : '—'}%: <b>{ok ? `${fmt(invNorm((1 - p) / 2, m, s))} to ${fmt(invNorm(1 - (1 - p) / 2, m, s))}` : '—'}</b>
        </span>
      </div>
    </div>
  )
}

function TCalc() {
  const [df, setDf] = useState('15')
  const [t, setT] = useState('2.131')
  const [conf, setConf] = useState('95')
  const d = num(df)
  const tv = num(t)
  const c = num(conf) / 100
  const okD = d > 0
  return (
    <div className="card stack">
      <b>t-distribution</b>
      <div className="row wrap">
        <Field label="Degrees of freedom" value={df} onChange={setDf} width={110} />
      </div>
      <div className="row wrap">
        <Field label="t" value={t} onChange={setT} />
        <span className="calc-out small">
          area to the left: <b>{okD ? fmt(tCdf(tv, d)) : '—'}</b>
          <br />
          area to the right: <b>{okD ? fmt(1 - tCdf(tv, d)) : '—'}</b>
          <br />
          two tails beyond ±|t|: <b>{okD ? fmt(2 * (1 - tCdf(Math.abs(tv), d))) : '—'}</b>
        </span>
      </div>
      <div className="row wrap">
        <Field label="Confidence %" value={conf} onChange={setConf} />
        <span className="calc-out">
          <i>t</i>
          <sup>*</sup> = <b>{okD && c > 0 && c < 1 ? fmt(invT(1 - (1 - c) / 2, d), 3) : '—'}</b>
        </span>
      </div>
    </div>
  )
}

function ChiCalc() {
  const [df, setDf] = useState('2')
  const [x, setX] = useState('5.99')
  const [p, setP] = useState('0.05')
  const d = num(df)
  const okD = Number.isInteger(d) && d > 0
  const pv = num(p)
  return (
    <div className="card stack">
      <b>Chi-square distribution</b>
      <div className="row wrap">
        <Field label="Degrees of freedom" value={df} onChange={setDf} width={110} />
      </div>
      <div className="row wrap">
        <Field label="χ²" value={x} onChange={setX} />
        <span className="calc-out">
          area to the right (p-value): <b>{okD && num(x) >= 0 ? fmt(chiUpper(num(x), d)) : '—'}</b>
        </span>
      </div>
      <div className="row wrap">
        <Field label="Upper-tail area" value={p} onChange={setP} width={110} />
        <span className="calc-out">
          critical value: <b>{okD && pv > 0 && pv < 1 ? fmt(chiCrit(pv, d), 2) : '—'}</b>
        </span>
      </div>
    </div>
  )
}

export function StatsTablesPage() {
  const { db } = useApp()
  useEffect(() => track(db, 'stats_tables'), [db])
  const [tab, setTab] = useState<'calc' | 'sheet'>('calc')
  return (
    <div>
      <TopBar title="Formulas & tables" back="/more" />
      <p className="small muted" style={{ marginTop: 0 }}>
        On the AP® Statistics exam you get a formula sheet and z, t and χ² tables, and you can use a graphing calculator. These calculators
        give the same numbers as the tables, with more digits.
      </p>
      <div className="seg" role="tablist" style={{ marginBottom: 12 }}>
        <button role="tab" aria-selected={tab === 'calc'} className={tab === 'calc' ? 'on' : ''} onClick={() => setTab('calc')}>
          Calculators
        </button>
        <button role="tab" aria-selected={tab === 'sheet'} className={tab === 'sheet' ? 'on' : ''} onClick={() => setTab('sheet')}>
          Formula sheet
        </button>
      </div>
      {tab === 'calc' ? (
        <div className="stack">
          <NormalCalc />
          <TCalc />
          <ChiCalc />
          <p className="tiny muted">
            Learn when to use each one in <Link to="/lesson/stats-2.13">Normal calculations</Link>, <Link to="/lesson/stats-4.2">t-distributions</Link> and{' '}
            <Link to="/lesson/stats-3.14">chi-square tests</Link>.
          </p>
        </div>
      ) : (
        <div className="stack">
          {SHEET.map((s) => (
            <div key={s.title} className="card">
              <b>{s.title}</b>
              <RichText text={s.body} />
            </div>
          ))}
          <p className="tiny muted">Written out from the formula sheet in College Board's AP® Statistics Course and Exam Description (effective Fall 2026).</p>
        </div>
      )}
    </div>
  )
}
