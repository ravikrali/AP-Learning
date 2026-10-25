// Sections used by more than one product: exam facts, free-response questions, reference tables.
import type { Frq } from '../../src/content/types'
import { CATEGORY_INFO, ELEMENTS, type Category } from '../../src/content/elements'
import { CONST } from '../../src/lib/chem'
import { chiCrit, invNorm, invT, normCdf } from '../../src/lib/stats'
import { STATS_SHEET } from '../../src/content/stats/formulas'
import { Callout, Inl, Pg, Rich, plain } from './common'

export const referenceTitle = (k: 'periodic-table' | 'stats-tables') => (k === 'periodic-table' ? 'Periodic Table, Constants and Equations' : 'Formulas and Tables')

export function ExamFacts({
  about,
  ap,
  ced,
  frqKinds,
}: {
  about: string
  ap: string
  ced: { version: string; units: { number: number; title: string; weight: string }[] }
  frqKinds: Record<string, string>
}) {
  return (
    <section className="front" id="exam-facts">
      <h1 className="front-h">About the {ap} Exam</h1>
      <p className="lead">
        <Inl t={about} />
      </p>
      <h3>What the exam covers</h3>
      <p>
        The College Board's Course and Exam Description (effective {ced.version}) divides the course into the units below. The weight is the share of the
        multiple-choice section that comes from each unit.
      </p>
      <table className="data">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Title</th>
            <th className="r">Exam weight</th>
          </tr>
        </thead>
        <tbody>
          {ced.units.map((u) => (
            <tr key={u.number}>
              <td>{u.number}</td>
              <td>{u.title}</td>
              <td className="r">{u.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Free-response question types</h3>
      <ul>
        {Object.values(frqKinds).map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>
      <Callout kind="exam" label="Exam Strategy" title="Study smarter, not longer">
        <p>
          Spend your time in proportion to the weights above, but never skip a unit: free-response questions often combine ideas from several units. Do every
          worked example yourself before reading the solution, and redo the questions you missed a week later.
        </p>
      </Callout>
    </section>
  )
}

export function FrqBlock({ frq, n, kinds, answerId, label = 'Question' }: { frq: Frq; n: number; kinds: Record<string, string>; answerId: string; label?: string }) {
  const points = frq.parts.reduce((s, p) => s + p.rubric.length, 0)
  return (
    <div className="frq" id={`frq-${frq.id}`}>
      <div className="frq-head">
        <span className="frq-n">
          {label} {n}
        </span>
        <span className="frq-title">{plain(frq.title)}</span>
        <span className="frq-pts">{points} points</span>
      </div>
      <div className="frq-meta">
        {kinds[frq.kind] ?? frq.kind} · Units {frq.units.join(', ')}
      </div>
      <Rich t={frq.intro} className="frq-intro" />
      {frq.parts.map((p) => (
        <div className="frq-part" key={p.label}>
          <span className="frq-label">{p.label}</span>
          <div>
            <Rich t={p.prompt} />
          </div>
        </div>
      ))}
      <p className="see">
        <a href={`#${answerId}`}>
          Scoring guide: page <Pg to={answerId} />
        </a>
      </p>
    </div>
  )
}

export function FrqAnswers({ frq, n, id, back, label = 'Question' }: { frq: Frq; n: number; id: string; back: string; label?: string }) {
  const points = frq.parts.reduce((s, p) => s + p.rubric.length, 0)
  return (
    <div className="frq-ans" id={id}>
      <div className="frq-head">
        <a className="frq-n" href={`#${back}`}>
          {label} {n}
        </a>
        <span className="frq-title">{plain(frq.title)}</span>
        <span className="frq-pts">{points} points</span>
      </div>
      {frq.parts.map((p) => (
        <div className="frq-ans-part" key={p.label}>
          <div className="frq-ans-label">
            Part {p.label.replace(/[()]/g, '')} <span className="muted">· {p.rubric.length} point{p.rubric.length > 1 ? 's' : ''}</span>
          </div>
          <div className="model">
            <div className="ex-sub">Model answer</div>
            <Rich t={p.answer} />
          </div>
          <ul className="rubric">
            {p.rubric.map((r, i) => (
              <li key={i}>
                <span className="box" /> <Inl t={r} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ---------- reference appendices ----------

export function Reference({ kind }: { kind: 'periodic-table' | 'stats-tables' }) {
  return kind === 'periodic-table' ? <ChemReference /> : <StatsReference />
}

const CAT_COLORS: Record<Category, string> = {
  'Alkali metal': '#fde2d2',
  'Alkaline earth metal': '#fdeec9',
  'Transition metal': '#e5e7fb',
  'Post-transition metal': '#dfeef9',
  Metalloid: '#dcf3ea',
  Nonmetal: '#e3f5d9',
  Halogen: '#f6e1f3',
  'Noble gas': '#ece3fb',
  Lanthanide: '#f9e4e4',
  Actinide: '#f3e8dc',
}

function ChemReference() {
  const cells = ELEMENTS.filter((e) => e.z <= 118)
  return (
    <>
      <h2 className="ref-h" id="ref-periodic">
        Periodic Table of the Elements
      </h2>
      <div className="ptable">
        {Array.from({ length: 18 }, (_, i) => (
          <div key={`g${i}`} className="pt-group" style={{ gridColumn: i + 1, gridRow: 1 }}>
            {i + 1}
          </div>
        ))}
        {cells.map((e) => (
          <div key={e.z} className="pt-cell" style={{ gridColumn: e.col, gridRow: e.row + 1, background: CAT_COLORS[e.category] }}>
            <span className="pt-z">{e.z}</span>
            <span className="pt-sym">{e.symbol}</span>
            <span className="pt-mass">{e.mass}</span>
          </div>
        ))}
        <div className="pt-gap" style={{ gridColumn: '1 / span 18', gridRow: 9 }} />
        <div className="pt-note" style={{ gridColumn: '1 / span 2', gridRow: 10 }}>
          *Lanthanides
        </div>
        <div className="pt-note" style={{ gridColumn: '1 / span 2', gridRow: 11 }}>
          †Actinides
        </div>
      </div>
      <div className="pt-legend">
        {(Object.keys(CAT_COLORS) as Category[]).map((c) => (
          <span key={c}>
            <i style={{ background: CAT_COLORS[c] }} />
            {c}
          </span>
        ))}
      </div>
      <p className="small muted">
        Each box shows the atomic number, symbol and average atomic mass. Masses in parentheses are the mass number of the most stable isotope. Element
        data: PubChem (U.S. National Library of Medicine, public domain).
      </p>
      <table className="data cats">
        <tbody>
          {(Object.keys(CATEGORY_INFO) as Category[]).map((c) => (
            <tr key={c}>
              <td>
                <i className="sw" style={{ background: CAT_COLORS[c] }} /> <b>{c}</b>
              </td>
              <td>
                <Inl t={CATEGORY_INFO[c].blurb} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="ref-h" id="ref-constants">
        Constants Used in This Book
      </h2>
      <table className="data">
        <tbody>
          {[
            ['Avogadro’s number', 'N_{A}', `${sci(CONST.NA)} mol^{-1}`],
            ['Planck’s constant', 'h', `${sci(CONST.h)} J·s`],
            ['Speed of light', 'c', `${sci(CONST.c)} m/s`],
            ['Gas constant', 'R', `${CONST.R_J} J/(mol·K) = ${CONST.R_Latm} L·atm/(mol·K)`],
            ['Faraday constant', 'F', `${CONST.F.toLocaleString('en-US')} C/mol e^{-}`],
            ['Water ionization constant (25 °C)', 'K_{w}', `${sci(CONST.Kw)}`],
            ['Temperature conversion', 'K', 'K = °C + 273.15'],
          ].map(([a, b, c]) => (
            <tr key={a}>
              <td>{a}</td>
              <td className="c">
                <Inl t={b} />
              </td>
              <td>
                <Inl t={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="ref-h" id="ref-equations">
        Key Equations
      </h2>
      <table className="data eqs">
        <tbody>
          {EQUATIONS.map(([topic, eqs]) => (
            <tr key={topic}>
              <td className="eq-topic">{topic}</td>
              <td>
                {eqs.map((e) => (
                  <div key={e}>
                    <Inl t={e} />
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const sci = (x: number) => {
  const [m, e] = x.toExponential(3).split('e')
  return `${Number(m)} × 10^{${e.replace('+', '')}}`
}

const EQUATIONS: [string, string[]][] = [
  ['Moles', ['n = m / M', 'number of particles = n × N_{A}']],
  ['Light and energy', ['c = λν', 'E = hν']],
  ['Gases', ['PV = nRT', 'P_{total} = P_{A} + P_{B} + P_{C} + …', 'P_{A} = X_{A} · P_{total}, where X_{A} = moles A / total moles', 'KE = ½mv^{2}']],
  ['Solutions and spectroscopy', ['Molarity, M = moles of solute / liters of solution', 'A = εbc (Beer–Lambert law)']],
  [
    'Kinetics',
    [
      'Zero order: [A]_{t} − [A]_{0} = −kt',
      'First order: ln[A]_{t} − ln[A]_{0} = −kt; t_{½} = 0.693 / k',
      'Second order: 1/[A]_{t} − 1/[A]_{0} = kt',
    ],
  ],
  ['Thermochemistry', ['q = mcΔT', 'ΔH°_{rxn} = ΣΔH°_{f}(products) − ΣΔH°_{f}(reactants)', 'ΔH°_{rxn} = Σ(bonds broken) − Σ(bonds formed)']],
  ['Equilibrium', ['K_{c} = [C]^{c}[D]^{d} / ([A]^{a}[B]^{b}) for aA + bB ⇌ cC + dD', 'K_{p} uses partial pressures in place of concentrations']],
  [
    'Acids and bases',
    ['pH = −log[H_{3}O^{+}]; pOH = −log[OH^{−}]', 'K_{w} = [H_{3}O^{+}][OH^{−}] = K_{a} × K_{b} = 1.0 × 10^{−14} at 25 °C', 'pH + pOH = 14.00 at 25 °C', 'pH = pK_{a} + log([A^{−}]/[HA])', 'pK_{a} = −log K_{a}'],
  ],
  [
    'Thermodynamics and electrochemistry',
    ['ΔS° = ΣS°(products) − ΣS°(reactants)', 'ΔG° = ΔH° − TΔS°', 'ΔG° = −RT ln K', 'ΔG° = −nFE°', 'I = q / t'],
  ],
]

function StatsReference() {
  const zRows = [] as number[]
  for (let z = -3.4; z <= 3.41; z += 0.1) zRows.push(Math.round(z * 10) / 10)
  const tail = [0.25, 0.2, 0.15, 0.1, 0.05, 0.025, 0.02, 0.01, 0.005, 0.0025, 0.001, 0.0005]
  const dfs = [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 50, 60, 80, 100, 1000]
  const conf = [0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.96, 0.98, 0.99, 0.995, 0.998, 0.999]
  // rows are |z| = 0.0 … 3.4; a column adds the second decimal place, moving z further from 0
  const mags = Array.from({ length: 35 }, (_, i) => i / 10)
  const zTables = [
    { rows: [...mags].reverse(), label: (m: number) => `−${m.toFixed(1)}`, value: (m: number, d: number) => normCdf(-(m + d)) },
    { rows: mags, label: (m: number) => m.toFixed(1), value: (m: number, d: number) => normCdf(m + d) },
  ]
  return (
    <>
      <h2 className="ref-h" id="ref-formulas">
        Formula Sheet
      </h2>
      <p className="small muted">The formulas provided with the AP® Statistics exam (CED effective Fall 2026), written out.</p>
      {STATS_SHEET.map((s) => (
        <div className="sheet" key={s.title}>
          <h4>{s.title}</h4>
          <Rich t={s.body} />
        </div>
      ))}

      <h2 className="ref-h page-break" id="ref-z">
        Table A · Standard Normal Probabilities
      </h2>
      <p className="small muted">Each entry is the area under the standard normal curve to the left of z.</p>
      <div className="ztables">
        {zTables.map((t, k) => (
          <table className="data ztab" key={k}>
            <thead>
              <tr>
                <th>z</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i}>.0{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((m) => (
                <tr key={m}>
                  <th>{t.label(m)}</th>
                  {Array.from({ length: 10 }, (_, i) => (
                    <td key={i}>{t.value(m, i / 100).toFixed(4)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>

      <h2 className="ref-h page-break" id="ref-t">
        Table B · t Distribution Critical Values
      </h2>
      <p className="small muted">Each entry is the value t* with the given upper-tail probability p (the area to its right).</p>
      <table className="data crit">
        <thead>
          <tr>
            <th>df \ p</th>
            {tail.map((p) => (
              <th key={p}>{String(p).replace(/^0/, '')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfs.map((df) => (
            <tr key={df}>
              <th>{df}</th>
              {tail.map((p) => (
                <td key={p}>{invT(1 - p, df).toFixed(3)}</td>
              ))}
            </tr>
          ))}
          <tr>
            <th>∞</th>
            {tail.map((p) => (
              <td key={p}>{invNorm(1 - p).toFixed(3)}</td>
            ))}
          </tr>
          <tr className="conf">
            <th>C</th>
            {conf.map((c) => (
              <td key={c}>{Math.round(c * 1000) / 10}%</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="small muted">Bottom row: the confidence level C that uses the critical value in that column.</p>

      <h2 className="ref-h page-break" id="ref-chi">
        Table C · χ² Critical Values
      </h2>
      <p className="small muted">Each entry is the value χ² with the given upper-tail probability p (the area to its right).</p>
      <table className="data crit">
        <thead>
          <tr>
            <th>df \ p</th>
            {tail.map((p) => (
              <th key={p}>{String(p).replace(/^0/, '')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array.from({ length: 30 }, (_, i) => i + 1), 40, 50, 60, 80, 100].map((df) => (
            <tr key={df}>
              <th>{df}</th>
              {tail.map((p) => (
                <td key={p}>{chiCrit(p, df).toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small muted">Table values are computed by the same functions the EzIQ app uses, which are tested against the tables in the CED, and then rounded.</p>
    </>
  )
}
