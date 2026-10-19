// Theme-aware SVG figures for AP Statistics lessons. Registered into the shared diagram table, so a
// lesson card refers to them by id ("diagram" field) exactly like the Chemistry figures.
// Curves are drawn from the same functions the test suite checks (lib/stats).
import type { CSSProperties, ReactNode } from 'react'
import { registerDiagrams } from '../diagrams'
import { binomPdf, fiveNumber, gammaP, logGamma, lsrl } from '../../lib/stats'
import { LONG_JUMP, RAIN, STUDY_HOURS, STUDY_SCORES, TEST_SCORES } from './data'

const ink: CSSProperties = { stroke: 'var(--text)', fill: 'none', strokeWidth: 2 }
const thin: CSSProperties = { stroke: 'var(--muted)', fill: 'none', strokeWidth: 1.2 }
const txt = (size = 13, color = 'var(--text)', weight = 600): CSSProperties => ({ fill: color, fontSize: size, fontWeight: weight, fontFamily: 'inherit' })
const fillP: CSSProperties = { fill: 'var(--primary)' }
const soft: CSSProperties = { fill: 'var(--primary-soft)', stroke: 'var(--primary)', strokeWidth: 1.5 }

function Fig({ children, caption, vb }: { children: ReactNode; caption?: string; vb: string }) {
  return (
    <figure className="diagram" style={{ margin: '12px 0' }}>
      <svg viewBox={vb} role="img" aria-label={caption}>
        {children}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

const normPdf = (z: number) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI)
const tPdf = (t: number, df: number) =>
  Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (t * t) / df))
const chiPdf = (x: number, k: number) => (x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - logGamma(k / 2)))

/** SVG path of y = f(x) for x in [a, b], mapped by sx / sy. */
function curve(f: (x: number) => number, a: number, b: number, sx: (x: number) => number, sy: (y: number) => number, n = 120) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n
    d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`
  }
  return d
}
/** Closed area under the curve between a and b. */
function area(f: (x: number) => number, a: number, b: number, sx: (x: number) => number, sy: (y: number) => number) {
  return `${curve(f, a, b, sx, sy, 60)}L${sx(b).toFixed(1)},${sy(0).toFixed(1)}L${sx(a).toFixed(1)},${sy(0).toFixed(1)}Z`
}

// ---------- Unit 1 ----------

/** Five histogram shapes as small multiples. */
function Shapes() {
  const shapes: { name: string; h: number[] }[] = [
    { name: 'Symmetric', h: [1, 3, 6, 9, 6, 3, 1] },
    { name: 'Skewed right', h: [5, 9, 7, 4, 2, 1, 1] },
    { name: 'Skewed left', h: [1, 1, 2, 4, 7, 9, 5] },
    { name: 'Uniform', h: [5, 5, 5, 5, 5, 5, 5] },
    { name: 'Bimodal', h: [2, 7, 4, 1, 4, 8, 3] },
  ]
  return (
    <Fig vb="0 0 520 150" caption="Shapes of distributions. The tail is the long, thin side: skewed right means the long tail points right.">
      {shapes.map((s, k) => {
        const x0 = 8 + k * 103
        return (
          <g key={s.name}>
            {s.h.map((v, i) => (
              <rect key={i} x={x0 + i * 13} y={110 - v * 10} width={12} height={v * 10} style={fillP} rx={1.5} />
            ))}
            <line x1={x0 - 2} y1={110} x2={x0 + 93} y2={110} style={ink} />
            <text x={x0 + 45} y={132} textAnchor="middle" style={txt(12)}>
              {s.name}
            </text>
          </g>
        )
      })}
    </Fig>
  )
}

/** Dotplot of the RAIN data (days of rain per month at a weather station). */
function Dotplot() {
  const counts = new Map<number, number>()
  RAIN.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1))
  const x = (v: number) => 30 + v * 30
  return (
    <Fig vb="0 0 420 170" caption="Dotplot: each dot is one month. Days with rain in each of 20 months.">
      {[...counts.entries()].flatMap(([v, n]) =>
        Array.from({ length: n }, (_, i) => <circle key={`${v}-${i}`} cx={x(v)} cy={118 - i * 14} r={6} style={fillP} />),
      )}
      <line x1={20} y1={128} x2={400} y2={128} style={ink} />
      {Array.from({ length: 13 }, (_, v) => (
        <g key={v}>
          <line x1={x(v)} y1={128} x2={x(v)} y2={133} style={ink} />
          <text x={x(v)} y={148} textAnchor="middle" style={txt(11)}>
            {v}
          </text>
        </g>
      ))}
      <text x={210} y={166} textAnchor="middle" style={txt(12, 'var(--muted)')}>
        Days with rain
      </text>
    </Fig>
  )
}

/** Histogram of TEST_SCORES with bins of width 10. */
function Histogram() {
  const bins = [50, 60, 70, 80, 90]
  const counts = bins.map((b) => TEST_SCORES.filter((v) => v >= b && v < b + 10).length)
  const x = (v: number) => 40 + (v - 50) * 6.4
  return (
    <Fig vb="0 0 400 200" caption="Histogram: bar height = how many values fall in each bin (here 50–<60, 60–<70, …).">
      {counts.map((c, i) => (
        <g key={i}>
          <rect x={x(bins[i])} y={160 - c * 18} width={64} height={c * 18} style={{ ...fillP, stroke: 'var(--surface)', strokeWidth: 2 }} />
          <text x={x(bins[i]) + 32} y={160 - c * 18 - 6} textAnchor="middle" style={txt(12)}>
            {c}
          </text>
        </g>
      ))}
      <line x1={36} y1={160} x2={370} y2={160} style={ink} />
      {[50, 60, 70, 80, 90, 100].map((v) => (
        <text key={v} x={x(v)} y={176} textAnchor="middle" style={txt(11)}>
          {v}
        </text>
      ))}
      <text x={200} y={194} textAnchor="middle" style={txt(12, 'var(--muted)')}>
        Test score
      </text>
    </Fig>
  )
}

/** A labeled boxplot with one outlier. */
function Boxplot() {
  const x = (v: number) => 30 + v * 3.4
  const [mn, q1, med, q3, hiWhisk, out] = [8, 30, 42, 55, 80, 108]
  return (
    <Fig vb="0 0 420 150" caption="A boxplot shows the five-number summary. Outliers (by the 1.5 × IQR rule) are plotted on their own.">
      <line x1={x(mn)} y1={70} x2={x(q1)} y2={70} style={ink} />
      <line x1={x(q3)} y1={70} x2={x(hiWhisk)} y2={70} style={ink} />
      <line x1={x(mn)} y1={60} x2={x(mn)} y2={80} style={ink} />
      <line x1={x(hiWhisk)} y1={60} x2={x(hiWhisk)} y2={80} style={ink} />
      <rect x={x(q1)} y={50} width={x(q3) - x(q1)} height={40} style={soft} />
      <line x1={x(med)} y1={50} x2={x(med)} y2={90} style={{ ...ink, stroke: 'var(--primary)', strokeWidth: 3 }} />
      <text x={x(out)} y={76} textAnchor="middle" style={txt(18, 'var(--oops)', 800)}>
        *
      </text>
      {[
        [mn, 'Min'],
        [q1, 'Q1'],
        [med, 'Median'],
        [q3, 'Q3'],
        [hiWhisk, 'Largest non-outlier'],
        [out, 'Outlier'],
      ].map(([v, l], i) => (
        <text key={i} x={x(Number(v))} y={i % 2 ? 112 : 36} textAnchor="middle" style={txt(11, 'var(--muted)')}>
          {l}
        </text>
      ))}
      <text x={(x(q1) + x(q3)) / 2} y={132} textAnchor="middle" style={txt(12)}>
        box = middle 50% (width = IQR)
      </text>
    </Fig>
  )
}

/** Mean vs. median on skewed curves. */
function MeanMedian() {
  const right = (x: number) => x * x * Math.exp(-x) // gamma-like, skewed right
  const sx = (x: number) => 20 + x * 22
  const sy = (y: number) => 120 - y * 170
  const sx2 = (x: number) => 400 - x * 22
  return (
    <Fig vb="0 0 420 160" caption="The mean is pulled toward the long tail. Skewed right: mean > median. Skewed left: mean < median.">
      <path d={curve(right, 0, 8, sx, sy)} style={{ ...ink, stroke: 'var(--primary)' }} />
      <line x1={sx(2.67)} y1={30} x2={sx(2.67)} y2={120} style={{ ...thin, strokeDasharray: '4 3' }} />
      <line x1={sx(3)} y1={30} x2={sx(3)} y2={120} style={{ stroke: 'var(--warm)', strokeWidth: 2 }} />
      <text x={sx(2.4)} y={26} textAnchor="end" style={txt(11, 'var(--muted)')}>
        median
      </text>
      <text x={sx(3.2)} y={26} style={txt(11, 'var(--warm)')}>
        mean
      </text>
      <text x={sx(4)} y={150} textAnchor="middle" style={txt(12)}>
        Skewed right
      </text>
      <path d={curve(right, 0, 8, sx2, sy)} style={{ ...ink, stroke: 'var(--primary)' }} />
      <line x1={sx2(2.67)} y1={30} x2={sx2(2.67)} y2={120} style={{ ...thin, strokeDasharray: '4 3' }} />
      <line x1={sx2(3)} y1={30} x2={sx2(3)} y2={120} style={{ stroke: 'var(--warm)', strokeWidth: 2 }} />
      <text x={sx2(2.4)} y={26} style={txt(11, 'var(--muted)')}>
        median
      </text>
      <text x={sx2(3.2)} y={26} textAnchor="end" style={txt(11, 'var(--warm)')}>
        mean
      </text>
      <text x={sx2(4)} y={150} textAnchor="middle" style={txt(12)}>
        Skewed left
      </text>
      <line x1={14} y1={120} x2={406} y2={120} style={ink} />
    </Fig>
  )
}

/** Bar chart and pie chart of the same categorical data. */
function BarPie() {
  const data = [
    { k: 'Bus', n: 18 },
    { k: 'Car', n: 12 },
    { k: 'Walk', n: 6 },
    { k: 'Bike', n: 4 },
  ]
  const total = data.reduce((s, d) => s + d.n, 0)
  const colors = ['var(--primary)', 'var(--warm)', 'var(--good)', 'var(--hack)']
  let angle = -Math.PI / 2
  return (
    <Fig vb="0 0 420 180" caption="Same data, two graphs: how 40 students get to school. Bars show counts; slices show shares of 100%.">
      {data.map((d, i) => (
        <g key={d.k}>
          <rect x={30 + i * 44} y={150 - d.n * 6.5} width={32} height={d.n * 6.5} style={{ fill: colors[i] }} rx={2} />
          <text x={46 + i * 44} y={166} textAnchor="middle" style={txt(11)}>
            {d.k}
          </text>
          <text x={46 + i * 44} y={145 - d.n * 6.5} textAnchor="middle" style={txt(11)}>
            {d.n}
          </text>
        </g>
      ))}
      <line x1={24} y1={150} x2={206} y2={150} style={ink} />
      {data.map((d, i) => {
        const a0 = angle
        const a1 = angle + (d.n / total) * 2 * Math.PI
        angle = a1
        const r = 62
        const cx = 320
        const cy = 90
        const big = a1 - a0 > Math.PI ? 1 : 0
        const mid = (a0 + a1) / 2
        return (
          <g key={d.k}>
            <path
              d={`M${cx},${cy}L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)}A${r},${r} 0 ${big} 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}Z`}
              style={{ fill: colors[i], stroke: 'var(--surface)', strokeWidth: 2 }}
            />
            <text x={cx + (r + 18) * Math.cos(mid)} y={cy + (r + 18) * Math.sin(mid) + 4} textAnchor="middle" style={txt(11)}>
              {Math.round((d.n / total) * 100)}%
            </text>
          </g>
        )
      })}
    </Fig>
  )
}

/** Completely randomized design vs. randomized block design. */
function Designs() {
  const box = (x: number, y: number, w: number, label: string, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={26} rx={6} style={soft} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" style={txt(11)}>
        {label}
      </text>
    </g>
  )
  const arrow = (x1: number, y1: number, x2: number, y2: number, key: string) => <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} style={thin} markerEnd="url(#st-arr)" />
  return (
    <Fig vb="0 0 440 210" caption="Top: completely randomized. Bottom: block first (here by grade), then randomize within each block.">
      <defs>
        <marker id="st-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0L10,5L0,10Z" style={{ fill: 'var(--muted)' }} />
        </marker>
      </defs>
      {box(10, 30, 90, '60 students', 'a')}
      {arrow(100, 43, 140, 25, 'a1')}
      {arrow(100, 43, 140, 61, 'a2')}
      <text x={120} y={18} textAnchor="middle" style={txt(10, 'var(--muted)')}>
        random
      </text>
      {box(142, 12, 110, '30 → app A', 'b')}
      {box(142, 48, 110, '30 → app B', 'c')}
      {arrow(252, 25, 292, 43, 'b1')}
      {arrow(252, 61, 292, 43, 'c1')}
      {box(294, 30, 130, 'compare test scores', 'd')}
      <line x1={10} y1={92} x2={430} y2={92} style={{ ...thin, strokeDasharray: '3 4' }} />
      {box(10, 140, 70, '60 students', 'e')}
      {arrow(80, 153, 104, 123, 'e1')}
      {arrow(80, 153, 104, 183, 'e2')}
      {box(106, 110, 80, '30 9th', 'f')}
      {box(106, 170, 80, '30 12th', 'g')}
      {arrow(186, 123, 210, 108, 'f1')}
      {arrow(186, 123, 210, 138, 'f2')}
      {arrow(186, 183, 210, 168, 'g1')}
      {arrow(186, 183, 210, 198, 'g2')}
      {box(212, 96, 80, '15 → A', 'h')}
      {box(212, 126, 80, '15 → B', 'i')}
      {box(212, 156, 80, '15 → A', 'j')}
      {box(212, 186, 80, '15 → B', 'k')}
      <text x={350} y={150} textAnchor="middle" style={txt(11)}>
        compare A vs. B
      </text>
      <text x={350} y={166} textAnchor="middle" style={txt(11)}>
        within each block
      </text>
    </Fig>
  )
}

// ---------- Unit 2 ----------

/** Segmented bar chart: phone type by grade. */
function Segmented() {
  const rows = [
    { k: '9th', a: 0.6 },
    { k: '10th', a: 0.5 },
    { k: '11th', a: 0.4 },
  ]
  return (
    <Fig vb="0 0 400 180" caption="Segmented bar chart: each bar is 100% of one group. Different splits across groups suggest an association.">
      {rows.map((r, i) => (
        <g key={r.k}>
          <rect x={60 + i * 100} y={20} width={60} height={r.a * 130} style={fillP} />
          <rect x={60 + i * 100} y={20 + r.a * 130} width={60} height={(1 - r.a) * 130} style={{ fill: 'var(--warm)' }} />
          <text x={90 + i * 100} y={20 + (r.a * 130) / 2 + 4} textAnchor="middle" style={txt(12, 'var(--primary-text)')}>
            {Math.round(r.a * 100)}%
          </text>
          <text x={90 + i * 100} y={20 + r.a * 130 + ((1 - r.a) * 130) / 2 + 4} textAnchor="middle" style={txt(12)}>
            {Math.round((1 - r.a) * 100)}%
          </text>
          <text x={90 + i * 100} y={168} textAnchor="middle" style={txt(12)}>
            {r.k}
          </text>
        </g>
      ))}
      <rect x={344} y={40} width={12} height={12} style={fillP} />
      <text x={360} y={51} style={txt(11)}>
        Yes
      </text>
      <rect x={344} y={60} width={12} height={12} style={{ fill: 'var(--warm)' }} />
      <text x={360} y={71} style={txt(11)}>
        No
      </text>
    </Fig>
  )
}

/** Binomial distribution, n = 10, p = 0.3. */
function Binomial() {
  const n = 10
  const p = 0.3
  return (
    <Fig vb="0 0 400 190" caption="Binomial distribution with n = 10 and p = 0.3. The bars add to 1; the mean np = 3 is the balance point.">
      {Array.from({ length: n + 1 }, (_, k) => {
        const h = binomPdf(n, p, k) * 520
        return <rect key={k} x={30 + k * 33} y={150 - h} width={26} height={h} style={fillP} rx={2} />
      })}
      <line x1={24} y1={150} x2={392} y2={150} style={ink} />
      {Array.from({ length: n + 1 }, (_, k) => (
        <text key={k} x={43 + k * 33} y={166} textAnchor="middle" style={txt(11)}>
          {k}
        </text>
      ))}
      <text x={200} y={184} textAnchor="middle" style={txt(12, 'var(--muted)')}>
        Number of successes, X
      </text>
    </Fig>
  )
}

const NX = (z: number) => 210 + z * 52
const NY = (y: number) => 150 - y * 300

/** The empirical rule. */
function NormalRule() {
  return (
    <Fig vb="0 0 420 200" caption="Empirical (68–95–99.7) rule: about 68% within 1 SD of the mean, 95% within 2 SDs, 99.7% within 3 SDs.">
      <path d={area(normPdf, -2, 2, NX, NY)} style={{ fill: 'var(--primary-soft)' }} />
      <path d={area(normPdf, -1, 1, NX, NY)} style={{ fill: 'var(--primary)', opacity: 0.45 }} />
      <path d={curve(normPdf, -3.6, 3.6, NX, NY)} style={{ ...ink, stroke: 'var(--primary)' }} />
      <line x1={16} y1={150} x2={404} y2={150} style={ink} />
      {[-3, -2, -1, 0, 1, 2, 3].map((z) => (
        <g key={z}>
          <line x1={NX(z)} y1={150} x2={NX(z)} y2={155} style={ink} />
          <text x={NX(z)} y={170} textAnchor="middle" style={txt(11)}>
            {z === 0 ? 'μ' : `μ${z > 0 ? '+' : '−'}${Math.abs(z)}σ`}
          </text>
        </g>
      ))}
      <text x={NX(0)} y={110} textAnchor="middle" style={txt(13, 'var(--text)', 800)}>
        68%
      </text>
      <text x={NX(0)} y={190} textAnchor="middle" style={txt(12, 'var(--muted)')}>
        95% between μ−2σ and μ+2σ · 99.7% between μ−3σ and μ+3σ
      </text>
    </Fig>
  )
}

/** Shaded area to the left of z = 1.2. */
function NormalArea() {
  return (
    <Fig vb="0 0 420 180" caption="A probability is an area under the curve. Sketch, label and shade before you calculate.">
      <path d={area(normPdf, -3.6, 1.2, NX, NY)} style={{ fill: 'var(--primary)', opacity: 0.4 }} />
      <path d={curve(normPdf, -3.6, 3.6, NX, NY)} style={{ ...ink, stroke: 'var(--primary)' }} />
      <line x1={16} y1={150} x2={404} y2={150} style={ink} />
      <line x1={NX(1.2)} y1={150} x2={NX(1.2)} y2={NY(normPdf(1.2))} style={{ stroke: 'var(--warm)', strokeWidth: 2 }} />
      <text x={NX(1.2)} y={168} textAnchor="middle" style={txt(12, 'var(--warm)')}>
        z = 1.2
      </text>
      <text x={NX(-0.3)} y={120} textAnchor="middle" style={txt(13, 'var(--text)', 800)}>
        P(Z &lt; 1.2) ≈ 0.885
      </text>
    </Fig>
  )
}

/** Skewed population and the sampling distributions of x̄ for n = 2 and n = 30 (CLT). */
function Clt() {
  const pop = (x: number) => (x <= 0 ? 0 : Math.exp(-x)) // exponential, mean 1, SD 1
  const xbar = (n: number) => (x: number) => (x <= 0 ? 0 : Math.exp(n * Math.log(n) + (n - 1) * Math.log(x) - n * x - logGamma(n))) // gamma(n, 1/n)
  const panel = (k: number, f: (x: number) => number, ymax: number, label: string) => {
    const x0 = 10 + k * 140
    const sx = (x: number) => x0 + x * 40
    const sy = (y: number) => 120 - (y / ymax) * 90
    return (
      <g key={k}>
        <path d={area(f, 0.001, 3, sx, sy)} style={{ fill: 'var(--primary-soft)' }} />
        <path d={curve(f, 0.001, 3, sx, sy)} style={{ ...ink, stroke: 'var(--primary)' }} />
        <line x1={x0} y1={120} x2={x0 + 125} y2={120} style={ink} />
        <line x1={sx(1)} y1={120} x2={sx(1)} y2={125} style={ink} />
        <text x={sx(1)} y={138} textAnchor="middle" style={txt(10)}>
          μ
        </text>
        <text x={x0 + 62} y={158} textAnchor="middle" style={txt(12)}>
          {label}
        </text>
      </g>
    )
  }
  return (
    <Fig vb="0 0 430 170" caption="Central limit theorem: even from a skewed population, the sampling distribution of x̄ gets closer to normal as n grows.">
      {panel(0, pop, 1, 'Population')}
      {panel(1, xbar(2), 0.8, 'x̄, n = 2')}
      {panel(2, xbar(30), 2.3, 'x̄, n = 30')}
    </Fig>
  )
}

// ---------- Unit 3 / 4 ----------

/** 20 confidence intervals from repeated samples; one misses. */
function CiCapture() {
  // centers chosen by hand to look like random sampling; one interval (index 13) misses the true value 0.5
  const centers = [0.52, 0.47, 0.55, 0.49, 0.51, 0.44, 0.53, 0.5, 0.46, 0.57, 0.48, 0.52, 0.45, 0.62, 0.5, 0.54, 0.47, 0.49, 0.53, 0.51]
  const me = 0.098
  const x = (p: number) => 40 + (p - 0.3) * 850
  return (
    <Fig vb="0 0 420 260" caption="20 samples, 20 different 95% intervals. In the long run about 95% capture the true p; here 19 of 20 do.">
      <line x1={x(0.5)} y1={10} x2={x(0.5)} y2={230} style={{ stroke: 'var(--warm)', strokeWidth: 2, strokeDasharray: '5 4' }} />
      <text x={x(0.5)} y={250} textAnchor="middle" style={txt(12, 'var(--warm)')}>
        true p = 0.5
      </text>
      {centers.map((c, i) => {
        const miss = c - me > 0.5 || c + me < 0.5
        const color = miss ? 'var(--oops)' : 'var(--primary)'
        return (
          <g key={i}>
            <line x1={x(c - me)} y1={18 + i * 10.5} x2={x(c + me)} y2={18 + i * 10.5} style={{ stroke: color, strokeWidth: 3 }} />
            <circle cx={x(c)} cy={18 + i * 10.5} r={3} style={{ fill: color }} />
          </g>
        )
      })}
    </Fig>
  )
}

/** Shaded tail area beyond the observed z (one-sided, "greater"). */
function PValue() {
  const z = 1.8
  return (
    <Fig vb="0 0 420 180" caption="The p-value is the area as extreme or more extreme than what we observed, assuming H₀ is true.">
      <path d={area(normPdf, z, 3.6, NX, NY)} style={{ fill: 'var(--oops)', opacity: 0.55 }} />
      <path d={curve(normPdf, -3.6, 3.6, NX, NY)} style={{ ...ink, stroke: 'var(--primary)' }} />
      <line x1={16} y1={150} x2={404} y2={150} style={ink} />
      <text x={NX(0)} y={168} textAnchor="middle" style={txt(11)}>
        0 (H₀ true)
      </text>
      <line x1={NX(z)} y1={150} x2={NX(z)} y2={NY(normPdf(z)) - 8} style={{ stroke: 'var(--oops)', strokeWidth: 2 }} />
      <text x={NX(z)} y={168} textAnchor="middle" style={txt(11, 'var(--oops)')}>
        observed z = 1.8
      </text>
      <text x={NX(2.7)} y={118} textAnchor="middle" style={txt(12, 'var(--oops)', 800)}>
        p ≈ 0.036
      </text>
    </Fig>
  )
}

/** t-distributions with df = 2 and 10 compared to the standard normal. */
function TvsZ() {
  return (
    <Fig vb="0 0 420 180" caption="t-distributions are bell-shaped with fatter tails than the normal. As df grows, t gets closer to z.">
      <path d={curve(normPdf, -4, 4, (z) => 210 + z * 46, NY)} style={{ ...ink, stroke: 'var(--text)' }} />
      <path d={curve((t) => tPdf(t, 10), -4, 4, (z) => 210 + z * 46, NY)} style={{ ...ink, stroke: 'var(--primary)', strokeDasharray: '6 3' }} />
      <path d={curve((t) => tPdf(t, 2), -4, 4, (z) => 210 + z * 46, NY)} style={{ ...ink, stroke: 'var(--warm)' }} />
      <line x1={16} y1={150} x2={404} y2={150} style={ink} />
      <text x={330} y={40} style={txt(11)}>
        — z (normal)
      </text>
      <text x={330} y={56} style={txt(11, 'var(--primary)')}>
        - - t, df = 10
      </text>
      <text x={330} y={72} style={txt(11, 'var(--warm)')}>
        — t, df = 2
      </text>
    </Fig>
  )
}

/** Chi-square curves for df = 2, 4 and 8. */
function ChiShapes() {
  const sx = (x: number) => 30 + x * 18
  const sy = (y: number) => 150 - y * 500
  return (
    <Fig vb="0 0 420 180" caption="Chi-square distributions take only positive values and are skewed right; the skew eases as df increases.">
      <path d={curve((x) => chiPdf(x, 2), 0.05, 20, sx, sy)} style={{ ...ink, stroke: 'var(--warm)' }} />
      <path d={curve((x) => chiPdf(x, 4), 0.01, 20, sx, sy)} style={{ ...ink, stroke: 'var(--primary)' }} />
      <path d={curve((x) => chiPdf(x, 8), 0.01, 20, sx, sy)} style={{ ...ink, stroke: 'var(--good)' }} />
      <line x1={26} y1={150} x2={400} y2={150} style={ink} />
      {[0, 5, 10, 15, 20].map((v) => (
        <text key={v} x={sx(v)} y={166} textAnchor="middle" style={txt(11)}>
          {v}
        </text>
      ))}
      <text x={300} y={40} style={txt(11, 'var(--warm)')}>
        df = 2
      </text>
      <text x={300} y={56} style={txt(11, 'var(--primary)')}>
        df = 4
      </text>
      <text x={300} y={72} style={txt(11, 'var(--good)')}>
        df = 8
      </text>
      <text x={sx(17)} y={120} style={txt(10, 'var(--muted)')}>
        P(χ² ≥ 9.49), df 4 = {(1 - gammaP(2, 9.49 / 2)).toFixed(2)}
      </text>
    </Fig>
  )
}

// ---------- Unit 5 ----------

function scatterPanel(k: number, pts: [number, number][], label: string) {
  const x0 = 10 + k * 104
  return (
    <g key={k}>
      <rect x={x0} y={10} width={94} height={94} rx={6} style={{ fill: 'var(--surface)', stroke: 'var(--border)' }} />
      {pts.map(([a, b], i) => (
        <circle key={i} cx={x0 + 6 + a * 82} cy={98 - b * 82} r={3} style={fillP} />
      ))}
      <text x={x0 + 47} y={122} textAnchor="middle" style={txt(11)}>
        {label}
      </text>
    </g>
  )
}

/** Four scatterplots: strong positive linear, weak negative, curved, no association. */
function ScatterForms() {
  // fixed pseudo-random jitter so the figure is the same every time
  const j = [0.03, -0.05, 0.06, -0.02, 0.04, -0.06, 0.01, 0.05, -0.04, 0.02, -0.03, 0.06, -0.01, 0.04, -0.05]
  const xs = j.map((_, i) => i / 14)
  const strong = xs.map((x, i) => [x, 0.1 + 0.8 * x + j[i]] as [number, number])
  const weak = xs.map((x, i) => [x, 0.75 - 0.45 * x + 4 * j[(i + 5) % 15]] as [number, number])
  const curved = xs.map((x, i) => [x, 0.9 - 3.2 * (x - 0.5) ** 2 + j[i] / 2] as [number, number])
  const none = xs.map((x, i) => [x, 0.5 + 6 * j[(i * 7) % 15]] as [number, number])
  return (
    <Fig vb="0 0 430 130" caption="Describe form (linear or not), direction, strength and unusual features, in context.">
      {scatterPanel(0, strong, 'Strong +, linear')}
      {scatterPanel(1, weak, 'Weak −, linear')}
      {scatterPanel(2, curved, 'Non-linear')}
      {scatterPanel(3, none, 'No association')}
    </Fig>
  )
}

/** Study hours vs. score with the least-squares line and residual segments. */
function Lsrl() {
  const m = lsrl(STUDY_HOURS, STUDY_SCORES)
  const sx = (x: number) => 50 + x * 40
  const sy = (y: number) => 170 - (y - 50) * 3
  return (
    <Fig vb="0 0 420 210" caption={`Least-squares line ŷ = ${m.a.toFixed(1)} + ${m.b.toFixed(2)}x. Each vertical segment is a residual (observed − predicted).`}>
      <line x1={46} y1={170} x2={400} y2={170} style={ink} />
      <line x1={46} y1={170} x2={46} y2={20} style={ink} />
      {STUDY_HOURS.map((x, i) => (
        <line key={`r${i}`} x1={sx(x)} y1={sy(STUDY_SCORES[i])} x2={sx(x)} y2={sy(m.a + m.b * x)} style={{ stroke: 'var(--warm)', strokeWidth: 1.5 }} />
      ))}
      <line x1={sx(0)} y1={sy(m.a)} x2={sx(8.5)} y2={sy(m.a + m.b * 8.5)} style={{ stroke: 'var(--primary)', strokeWidth: 2.5 }} />
      {STUDY_HOURS.map((x, i) => (
        <circle key={i} cx={sx(x)} cy={sy(STUDY_SCORES[i])} r={4} style={{ fill: 'var(--text)' }} />
      ))}
      {[0, 2, 4, 6, 8].map((v) => (
        <text key={v} x={sx(v)} y={186} textAnchor="middle" style={txt(11)}>
          {v}
        </text>
      ))}
      {[60, 80, 100].map((v) => (
        <text key={v} x={40} y={sy(v) + 4} textAnchor="end" style={txt(11)}>
          {v}
        </text>
      ))}
      <text x={220} y={204} textAnchor="middle" style={txt(12, 'var(--muted)')}>
        Hours studied (x)
      </text>
    </Fig>
  )
}

/** A random-looking residual plot next to a curved one. */
function ResidualPlots() {
  const good = [0.3, -0.5, 0.6, -0.2, 0.1, -0.6, 0.4, 0.2, -0.3, 0.5, -0.4, 0.0, 0.35, -0.15]
  const bad = good.map((_, i) => 1.4 * ((i - 6.5) / 6.5) ** 2 - 0.55 + good[i] * 0.2)
  const panel = (k: number, r: number[], label: string) => {
    const x0 = 20 + k * 205
    return (
      <g key={k}>
        <line x1={x0} y1={70} x2={x0 + 180} y2={70} style={{ ...thin, strokeDasharray: '4 3' }} />
        <line x1={x0} y1={10} x2={x0} y2={130} style={ink} />
        {r.map((v, i) => (
          <circle key={i} cx={x0 + 10 + i * 12.5} cy={70 - v * 60} r={3.5} style={fillP} />
        ))}
        <text x={x0 + 90} y={150} textAnchor="middle" style={txt(12)}>
          {label}
        </text>
      </g>
    )
  }
  return (
    <Fig vb="0 0 430 160" caption="Residuals vs. x. No pattern: a line is appropriate. Curved pattern: a linear model is not the best choice.">
      {panel(0, good, 'Random scatter ✓')}
      {panel(1, bad, 'Curved pattern ✗')}
    </Fig>
  )
}

/** Dash time vs. long jump – negative association. */
function LongJump() {
  const sx = (x: number) => 40 + (x - 6.6) * 260
  const sy = (y: number) => 160 - (y - 80) * 3.2
  return (
    <Fig vb="0 0 400 200" caption="Faster sprinters (smaller times) tend to jump farther: a strong, negative, linear association.">
      <line x1={36} y1={160} x2={390} y2={160} style={ink} />
      <line x1={36} y1={160} x2={36} y2={14} style={ink} />
      {LONG_JUMP.map(([x, y], i) => (
        <circle key={i} cx={sx(x)} cy={sy(y)} r={4} style={fillP} />
      ))}
      {[6.8, 7.2, 7.6, 8.0].map((v) => (
        <text key={v} x={sx(v)} y={176} textAnchor="middle" style={txt(11)}>
          {v.toFixed(1)}
        </text>
      ))}
      <text x={210} y={194} textAnchor="middle" style={txt(12, 'var(--muted)')}>
        60-m dash time (s)
      </text>
      <text x={20} y={90} textAnchor="middle" transform="rotate(-90 20 90)" style={txt(12, 'var(--muted)')}>
        Long jump (in)
      </text>
    </Fig>
  )
}

/** Boxplots of two classes on one scale (Class A is TEST_SCORES). */
function CompareBoxes() {
  const x = (v: number) => 40 + (v - 40) * 5.5
  const rows = [
    { k: 'Class A', f: fiveNumber(TEST_SCORES), y: 40 },
    { k: 'Class B', f: { min: 48, q1: 62, med: 71, q3: 77, max: 90 }, y: 100 },
  ]
  return (
    <Fig vb="0 0 420 170" caption="Comparing distributions: talk about center, spread, shape and unusual features, with numbers and in context.">
      {rows.map((r) => (
        <g key={r.k}>
          <text x={10} y={r.y + 5} style={txt(12)}>
            {r.k}
          </text>
          <line x1={x(r.f.min)} y1={r.y} x2={x(r.f.q1)} y2={r.y} style={ink} />
          <line x1={x(r.f.q3)} y1={r.y} x2={x(r.f.max)} y2={r.y} style={ink} />
          <rect x={x(r.f.q1)} y={r.y - 16} width={x(r.f.q3) - x(r.f.q1)} height={32} style={soft} />
          <line x1={x(r.f.med)} y1={r.y - 16} x2={x(r.f.med)} y2={r.y + 16} style={{ ...ink, stroke: 'var(--primary)', strokeWidth: 3 }} />
        </g>
      ))}
      <line x1={x(40)} y1={140} x2={x(100)} y2={140} style={ink} />
      {[40, 50, 60, 70, 80, 90, 100].map((v) => (
        <text key={v} x={x(v)} y={156} textAnchor="middle" style={txt(11)}>
          {v}
        </text>
      ))}
    </Fig>
  )
}

registerDiagrams({
  'st-shapes': Shapes,
  'st-dotplot': Dotplot,
  'st-histogram': Histogram,
  'st-boxplot': Boxplot,
  'st-mean-median': MeanMedian,
  'st-bar-pie': BarPie,
  'st-designs': Designs,
  'st-segmented': Segmented,
  'st-binomial': Binomial,
  'st-normal-rule': NormalRule,
  'st-normal-area': NormalArea,
  'st-clt': Clt,
  'st-ci-capture': CiCapture,
  'st-pvalue': PValue,
  'st-t-vs-z': TvsZ,
  'st-chi-shapes': ChiShapes,
  'st-scatter-forms': ScatterForms,
  'st-lsrl': Lsrl,
  'st-residual-plots': ResidualPlots,
  'st-long-jump': LongJump,
  'st-compare-boxes': CompareBoxes,
})
