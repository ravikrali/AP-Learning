// Small SVG/HTML charts for the admin dashboard (no chart library).
// One axis per chart, thin marks with rounded data ends, hover tooltips on every mark.

import { useRef, useState, type ReactNode } from 'react'

export interface Bar {
  label: string
  value: number
  /** drawn hatched: a forecast, not a measurement */
  ghost?: boolean
}

function niceMax(v: number) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  const f = v / p
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p
}

function Tip({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div className="viz-tip" style={{ left: x, top: y }}>
      {children}
    </div>
  )
}

/** Vertical bars over time. */
export function Columns({ data, format = String, height = 160, label }: { data: Bar[]; format?: (n: number) => string; height?: number; label: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const W = 600
  const H = height
  const top = 8
  const bottom = 22
  const max = niceMax(Math.max(...data.map((d) => d.value), 0))
  const n = Math.max(data.length, 1)
  const slot = W / n
  const bw = Math.max(2, Math.min(28, slot - 2))
  const y = (v: number) => top + (H - top - bottom) * (1 - v / max)
  const every = Math.ceil(n / 8)
  return (
    <div className="viz" ref={box} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="none" className="viz-svg">
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--series-1-soft)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--series-1)" strokeWidth="2" />
          </pattern>
        </defs>
        {[0.5, 1].map((f) => (
          <line key={f} x1={0} x2={W} y1={y(max * f)} y2={y(max * f)} className="viz-grid" />
        ))}
        {data.map((d, i) => {
          const x = i * slot + (slot - bw) / 2
          const h = Math.max(0, H - bottom - y(d.value))
          const r = Math.min(4, bw / 2, h)
          const yy = H - bottom - h
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)}>
              <rect x={i * slot} y={0} width={slot} height={H} fill="transparent" />
              {h > 0 && (
                <path
                  d={`M${x},${H - bottom} V${yy + r} Q${x},${yy} ${x + r},${yy} H${x + bw - r} Q${x + bw},${yy} ${x + bw},${yy + r} V${H - bottom} Z`}
                  fill={d.ghost ? 'url(#hatch)' : 'var(--series-1)'}
                  opacity={hover === null || hover === i ? 1 : 0.55}
                />
              )}
            </g>
          )
        })}
        <line x1={0} x2={W} y1={H - bottom} y2={H - bottom} className="viz-axis" />
        {data.map((d, i) =>
          i % every === 0 ? (
            <text key={d.label} x={i * slot + slot / 2} y={H - 6} textAnchor="middle" className="viz-label">
              {d.label}
            </text>
          ) : null,
        )}
      </svg>
      <div className="viz-max">{format(max)}</div>
      {hover !== null && box.current && (
        <Tip x={((hover + 0.5) / n) * box.current.clientWidth} y={0}>
          <b>{data[hover].label}</b>
          <span>
            {format(data[hover].value)}
            {data[hover].ghost ? ' (forecast)' : ''}
          </span>
        </Tip>
      )}
    </div>
  )
}

/** Line over time with a hover crosshair. */
export function Line({ data, format = String, height = 150, label }: { data: Bar[]; format?: (n: number) => string; height?: number; label: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const W = 600
  const H = height
  const top = 10
  const bottom = 22
  const max = niceMax(Math.max(...data.map((d) => d.value), 0))
  const n = data.length
  const x = (i: number) => (n <= 1 ? W / 2 : 6 + (i * (W - 12)) / (n - 1))
  const y = (v: number) => top + (H - top - bottom) * (1 - v / max)
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ')
  const every = Math.ceil(n / 7)
  function move(e: React.MouseEvent) {
    const r = box.current!.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    setHover(Math.max(0, Math.min(n - 1, Math.round(((px - 6) / (W - 12)) * (n - 1)))))
  }
  return (
    <div className="viz" ref={box} onMouseMove={move} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="none" className="viz-svg">
        {[0.5, 1].map((f) => (
          <line key={f} x1={0} x2={W} y1={y(max * f)} y2={y(max * f)} className="viz-grid" />
        ))}
        <line x1={0} x2={W} y1={H - bottom} y2={H - bottom} className="viz-axis" />
        {n > 0 && <path d={path} fill="none" stroke="var(--series-1)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />}
        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={top} y2={H - bottom} className="viz-cross" vectorEffect="non-scaling-stroke" />
        )}
        {data.map((d, i) =>
          i % every === 0 ? (
            <text key={d.label} x={x(i)} y={H - 6} textAnchor="middle" className="viz-label">
              {d.label}
            </text>
          ) : null,
        )}
      </svg>
      {hover !== null && n > 0 && (
        <span
          className="viz-dot"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover].value) / H) * 100}%` }}
        />
      )}
      <div className="viz-max">{format(max)}</div>
      {hover !== null && box.current && (
        <Tip x={(x(hover) / W) * box.current.clientWidth} y={0}>
          <b>{data[hover].label}</b>
          <span>{format(data[hover].value)}</span>
        </Tip>
      )}
    </div>
  )
}

/** Ranked horizontal bars (countries, topics, courses). */
export function Ranked({ rows, format = String }: { rows: { label: ReactNode; value: number; note?: ReactNode }[]; format?: (n: number) => string }) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  if (!rows.length) return <p className="small muted">No data yet.</p>
  return (
    <div className="ranked">
      {rows.map((r, i) => (
        <div key={i} className="ranked-row" title={`${format(r.value)}`}>
          <span className="ranked-label">{r.label}</span>
          <span className="ranked-track">
            <span className="ranked-bar" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="ranked-value">{format(r.value)}</span>
          {r.note && <span className="ranked-note">{r.note}</span>}
        </div>
      ))}
    </div>
  )
}

/** One 100% bar split into parts (up to 3), with a legend and direct labels. */
export function Split({ parts }: { parts: { label: string; value: number }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  const [hover, setHover] = useState<number | null>(null)
  return (
    <div>
      <div className="split" onMouseLeave={() => setHover(null)}>
        {parts.map((p, i) =>
          p.value > 0 ? (
            <span
              key={p.label}
              className={`split-part s${i + 1}`}
              style={{ flexGrow: p.value, opacity: hover === null || hover === i ? 1 : 0.55 }}
              onMouseEnter={() => setHover(i)}
              title={`${p.label}: ${p.value}`}
            />
          ) : null,
        )}
        {total === 0 && <span className="split-part empty" style={{ flexGrow: 1 }} />}
      </div>
      <div className="legend">
        {parts.map((p, i) => (
          <span key={p.label} className="legend-item">
            <i className={`s${i + 1}`} />
            {p.label} <b>{p.value}</b>
            <span className="muted">{total ? ` · ${Math.round((p.value / total) * 100)}%` : ''}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
