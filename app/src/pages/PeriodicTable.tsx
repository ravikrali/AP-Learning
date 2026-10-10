import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { findLesson } from '../content'
import { CATEGORY_INFO, ELEMENTS, insights, prettyConfig, type Category, type Element } from '../content/elements'
import { RichText } from '../lib/RichText'
import { TopBar } from '../components/bits'
import { useApp } from '../lib/app'
import { track } from '../lib/track'

type ColorBy = 'category' | 'en' | 'state'
const COLOR_MODES: { id: ColorBy; label: string }[] = [
  { id: 'category', label: 'Families' },
  { id: 'en', label: 'Electronegativity' },
  { id: 'state', label: 'State' },
]
const CATEGORIES = Object.keys(CATEGORY_INFO) as Category[]
const STATE_LABEL = { solid: 'Solid', liquid: 'Liquid', gas: 'Gas' }
const plural = (c: Category) => (c === 'Noble gas' ? 'Noble gases' : `${c}s`)
// lessons that explain what the table shows (listed only when the course is installed)
const RELATED = ['chem-1.7', 'chem-1.5', 'chem-1.8', 'chem-1.1']

const EN_MIN = 0.7
const EN_MAX = 3.98
const enShade = (en: number) => Math.round(12 + ((en - EN_MIN) / (EN_MAX - EN_MIN)) * 70)

function cellStyle(e: Element, by: ColorBy): React.CSSProperties {
  const pos = { gridRow: e.row, gridColumn: e.col }
  if (by === 'en')
    return e.electronegativity === null
      ? pos
      : { ...pos, background: `color-mix(in srgb, var(--primary) ${enShade(e.electronegativity)}%, var(--surface))` }
  return pos
}

export function PeriodicTablePage() {
  const { db } = useApp()
  useEffect(() => track(db, 'periodic_table'), [db])
  const [sel, setSel] = useState<Element>(ELEMENTS[5]) // carbon
  const [by, setBy] = useState<ColorBy>('category')
  const [focus, setFocus] = useState<Category | null>(null)
  const [big, setBig] = useState(false)
  const [q, setQ] = useState('')

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return null
    return new Set(
      ELEMENTS.filter((e) => e.symbol.toLowerCase() === t || e.name.toLowerCase().includes(t) || String(e.z) === t).map((e) => e.z),
    )
  }, [q])

  function onSearch(v: string) {
    setQ(v)
    const t = v.trim().toLowerCase()
    if (!t) return
    const hit =
      ELEMENTS.find((e) => e.symbol.toLowerCase() === t) ?? ELEMENTS.find((e) => String(e.z) === t) ?? ELEMENTS.find((e) => e.name.toLowerCase().startsWith(t))
    if (hit) setSel(hit)
  }

  const dim = (e: Element) => (matches ? !matches.has(e.z) : by === 'category' && focus ? e.category !== focus : false)

  return (
    <div>
      <TopBar
        title="Periodic table"
        back="/more"
        right={
          <button className="btn secondary zoom-btn" aria-label={big ? 'Fit the table to the screen' : 'Make the table bigger'} aria-pressed={big} onClick={() => setBig((b) => !b)}>
            {big ? 'Fit' : 'Zoom'}
          </button>
        }
      />
      <input className="search-input" type="search" placeholder="Find an element" value={q} onChange={(e) => onSearch(e.target.value)} aria-label="Find an element" />

      <div className="seg" role="tablist" aria-label="Color the table by">
        {COLOR_MODES.map((m) => (
          <button key={m.id} role="tab" aria-selected={by === m.id} className={by === m.id ? 'on' : ''} onClick={() => setBy(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <div className={`pt-scroll ${big ? 'big' : ''}`}>
        <div className={`pt by-${by}`} role="grid" aria-label="Periodic table of the elements">
          {ELEMENTS.map((e) => (
            <button
              key={e.z}
              className={`pt-cell cat-${CATEGORY_INFO[e.category].key} st-${e.state} ${sel.z === e.z ? 'sel' : ''} ${dim(e) ? 'dim' : ''}`}
              style={cellStyle(e, by)}
              onClick={() => setSel(e)}
              aria-label={`${e.name}, atomic number ${e.z}`}
              aria-pressed={sel.z === e.z}
            >
              <span className="pt-z">{e.z}</span>
              <span className="pt-sym">{e.symbol}</span>
            </button>
          ))}
          <span className="pt-note" style={{ gridRow: 9, gridColumn: '1 / 4' }}>
            58–71
          </span>
          <span className="pt-note" style={{ gridRow: 10, gridColumn: '1 / 4' }}>
            90–103
          </span>
        </div>
      </div>

      {by === 'category' && (
        <div className="pt-legend">
          {CATEGORIES.map((c) => (
            <button key={c} className={`pt-chip cat-${CATEGORY_INFO[c].key} ${focus === c ? 'on' : ''}`} aria-pressed={focus === c} onClick={() => setFocus(focus === c ? null : c)}>
              <i /> {plural(c)}
            </button>
          ))}
        </div>
      )}
      {by === 'en' && (
        <p className="small muted pt-key">
          <span className="pt-ramp" aria-hidden /> Darker = pulls shared electrons harder. It rises across a period and up a group, toward fluorine. Blank = no value.
        </p>
      )}
      {by === 'state' && (
        <div className="pt-legend">
          {(['solid', 'liquid', 'gas'] as const).map((s) => (
            <span key={s} className={`pt-chip st-${s}`}>
              <i /> {STATE_LABEL[s]} at room temperature
            </span>
          ))}
        </div>
      )}

      <ElementCard e={sel} />
      <p className="tiny muted" style={{ textAlign: 'center', marginTop: 14 }}>
        Element data: PubChem (U.S. National Institutes of Health). Atomic masses are rounded as in the lessons.
      </p>
    </div>
  )
}

function ElementCard({ e }: { e: Element }) {
  const info = CATEGORY_INFO[e.category]
  const related = RELATED.map((id) => findLesson(id)).filter((r) => !!r)
  return (
    <div className="card el-card" aria-live="polite">
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className={`el-tile cat-${info.key}`}>
          <span className="el-z">{e.z}</span>
          <span className="el-sym">{e.symbol}</span>
          <span className="el-mass">{e.mass}</span>
        </div>
        <div className="grow">
          <h2 style={{ margin: 0 }}>{e.name}</h2>
          <div className="small muted">
            {e.category} · {e.superheavy ? 'expected to be a ' : ''}
            {STATE_LABEL[e.state].toLowerCase()} at room temperature
          </div>
          <div className="small muted">
            Period {e.period}
            {e.group ? ` · Group ${e.group}` : ' · f-block'}
          </div>
        </div>
      </div>

      <dl className="el-facts">
        <div>
          <dt>Electron configuration{e.superheavy ? ' (predicted)' : ''}</dt>
          <dd>{prettyConfig(e.config)}</dd>
        </div>
        {e.oxidation && (
          <div>
            <dt>Common oxidation states</dt>
            <dd>{e.oxidation.replace(/-/g, '−')}</dd>
          </div>
        )}
      </dl>

      <div className="el-insights">
        {insights(e).map((i) => (
          <div key={i.text} className="el-insight">
            <span aria-hidden>{i.icon}</span>
            <RichText text={i.text} />
          </div>
        ))}
        <div className="el-insight">
          <span aria-hidden>👪</span>
          <div>
            <b>{plural(e.category)}:</b> {info.blurb}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="el-links">
          <span className="small muted">Learn more:</span>
          {related.map((r) => (
            <Link key={r!.lesson.id} to={`/lesson/${r!.lesson.id}`} className="pill-link">
              {r!.lesson.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
