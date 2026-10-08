// Small, theme-aware SVG diagrams used inside lesson cards ("diagram" field).
import type { CSSProperties, ReactNode } from 'react'

const ink: CSSProperties = { stroke: 'var(--text)', fill: 'none', strokeWidth: 2 }
const thin: CSSProperties = { stroke: 'var(--muted)', fill: 'none', strokeWidth: 1.2 }
const txt = (size = 13, color = 'var(--text)', weight = 600): CSSProperties => ({ fill: color, fontSize: size, fontWeight: weight, fontFamily: 'inherit' })

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

function Axes({ x0, y0, x1, y1, xl, yl }: { x0: number; y0: number; x1: number; y1: number; xl: string; yl: string }) {
  return (
    <g>
      <line x1={x0} y1={y0} x2={x1} y2={y0} style={ink} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} style={ink} />
      <text x={(x0 + x1) / 2} y={y0 + 32} textAnchor="middle" style={txt(13, 'var(--muted)')}>
        {xl}
      </text>
      <text x={x0 - 34} y={(y0 + y1) / 2} textAnchor="middle" transform={`rotate(-90 ${x0 - 34} ${(y0 + y1) / 2})`} style={txt(13, 'var(--muted)')}>
        {yl}
      </text>
    </g>
  )
}

/** Mass spectrum of chlorine: 35Cl ≈ 75.8 %, 37Cl ≈ 24.2 % */
function MassSpecCl() {
  const X0 = 60, Y0 = 200, H = 160
  const bars = [
    { m: 35, p: 75.8 },
    { m: 37, p: 24.2 },
  ]
  const x = (m: number) => X0 + 40 + (m - 33) * 55
  return (
    <Fig vb="0 0 400 240" caption="Mass spectrum of chlorine atoms. Peak height = relative abundance.">
      <Axes x0={X0} y0={Y0} x1={380} y1={20} xl="Mass (amu)" yl="Abundance (%)" />
      {[33, 34, 35, 36, 37, 38].map((m) => (
        <g key={m}>
          <line x1={x(m)} y1={Y0} x2={x(m)} y2={Y0 + 5} style={ink} />
          <text x={x(m)} y={Y0 + 18} textAnchor="middle" style={txt(12)}>
            {m}
          </text>
        </g>
      ))}
      {bars.map((b) => (
        <g key={b.m}>
          <rect x={x(b.m) - 9} y={Y0 - (b.p / 100) * H} width={18} height={(b.p / 100) * H} style={{ fill: 'var(--primary)' }} rx={3} />
          <text x={x(b.m)} y={Y0 - (b.p / 100) * H - 8} textAnchor="middle" style={txt(13)}>
            {b.p}%
          </text>
        </g>
      ))}
    </Fig>
  )
}

/** Photoelectron spectrum of sodium (energies in MJ/mol; x axis not to scale). */
function PesNa() {
  const X0 = 50, Y0 = 200
  const peaks = [
    { label: '1s', e: '104', n: 2, x: 90 },
    { label: '2s', e: '6.84', n: 2, x: 200 },
    { label: '2p', e: '3.67', n: 6, x: 270 },
    { label: '3s', e: '0.50', n: 1, x: 350 },
  ]
  return (
    <Fig vb="0 0 400 250" caption="PES of sodium, 1s²2s²2p⁶3s¹. Further left = more tightly held. Peak height ∝ number of electrons. (Axis not to scale.)">
      <Axes x0={X0} y0={Y0} x1={385} y1={20} xl="← Binding energy (MJ/mol), decreasing to the right" yl="Relative # of e⁻" />
      <line x1={140} y1={Y0 - 6} x2={150} y2={Y0 + 6} style={thin} />
      <line x1={146} y1={Y0 - 6} x2={156} y2={Y0 + 6} style={thin} />
      {peaks.map((p) => (
        <g key={p.label}>
          <rect x={p.x - 8} y={Y0 - p.n * 26} width={16} height={p.n * 26} rx={3} style={{ fill: 'var(--accent)' }} />
          <text x={p.x} y={Y0 - p.n * 26 - 22} textAnchor="middle" style={txt(13)}>
            {p.label}
          </text>
          <text x={p.x} y={Y0 - p.n * 26 - 8} textAnchor="middle" style={txt(11, 'var(--muted)')}>
            {p.e}
          </text>
        </g>
      ))}
    </Fig>
  )
}

/** Periodic trends cheat sheet. */
function PeriodicTrends() {
  return (
    <Fig vb="0 0 400 230" caption="Arrows point toward increasing values. Noble gases are usually left out of electronegativity comparisons.">
      <rect x={40} y={30} width={320} height={160} rx={10} style={{ fill: 'var(--surface)', stroke: 'var(--border)', strokeWidth: 2 }} />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`r${i}`} x1={40} x2={360} y1={30 + (i + 1) * 22.8} y2={30 + (i + 1) * 22.8} style={{ stroke: 'var(--border)' }} />
      ))}
      <defs>
        <marker id="arrP" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" style={{ fill: 'var(--primary)' }} />
        </marker>
        <marker id="arrW" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" style={{ fill: 'var(--warm)' }} />
        </marker>
      </defs>
      <line x1={70} y1={175} x2={330} y2={50} style={{ stroke: 'var(--primary)', strokeWidth: 4 }} markerEnd="url(#arrP)" />
      <text x={205} y={98} textAnchor="middle" transform="rotate(-25 205 98)" style={txt(13, 'var(--primary)', 800)}>
        Ionization energy, electronegativity
      </text>
      <line x1={330} y1={70} x2={80} y2={180} style={{ stroke: 'var(--warm)', strokeWidth: 4 }} markerEnd="url(#arrW)" />
      <text x={230} y={152} textAnchor="middle" transform="rotate(-24 230 152)" style={txt(13, 'var(--warm)', 800)}>
        Atomic radius
      </text>
      <text x={200} y={215} textAnchor="middle" style={txt(12, 'var(--muted)')}>
        Up and right: stronger pull on electrons. Down and left: bigger atoms.
      </text>
    </Fig>
  )
}

/** Potential energy vs. internuclear distance for H2 (min at 74 pm, well depth 436 kJ/mol). */
function PeCurveH2() {
  // x: 0..300 pm -> 60..380 px ; y: +150..-500 kJ/mol -> 30..220 px (0 at y=72)
  const X = (pm: number) => 60 + (pm / 300) * 320
  const Y = (e: number) => 72 + (-e / 500) * 148
  const pts: string[] = []
  for (let r = 40; r <= 300; r += 4) {
    // Morse-like curve: De(1 - e^{-a(r-re)})^2 - De
    const De = 436, re = 74, a = 0.0194
    const e = De * (1 - Math.exp(-a * (r - re))) ** 2 - De
    if (e < 160) pts.push(`${X(r).toFixed(1)},${Y(e).toFixed(1)}`)
  }
  return (
    <Fig vb="0 0 400 260" caption="H₂: energy is lowest at the bond length (74 pm). The depth of the well is the bond energy (436 kJ/mol).">
      <line x1={60} y1={20} x2={60} y2={225} style={ink} />
      <line x1={60} y1={Y(0)} x2={385} y2={Y(0)} style={thin} />
      <text x={388} y={Y(0) - 6} textAnchor="end" style={txt(11, 'var(--muted)')}>0 (atoms far apart)</text>
      <text x={24} y={125} textAnchor="middle" transform="rotate(-90 24 125)" style={txt(12, 'var(--muted)')}>Potential energy (kJ/mol)</text>
      <text x={220} y={250} textAnchor="middle" style={txt(12, 'var(--muted)')}>Distance between nuclei (pm) →</text>
      <polyline points={pts.join(' ')} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <line x1={X(74)} y1={Y(-436)} x2={X(74)} y2={235} style={{ ...thin, strokeDasharray: '4 4' }} />
      <text x={X(74)} y={246} textAnchor="middle" style={txt(12)}>74</text>
      <line x1={X(200)} y1={Y(0)} x2={X(200)} y2={Y(-436)} style={{ stroke: 'var(--warm)', strokeWidth: 2 }} />
      <line x1={X(74)} y1={Y(-436)} x2={X(200)} y2={Y(-436)} style={{ ...thin, strokeDasharray: '4 4' }} />
      <text x={X(200) + 6} y={Y(-218)} style={txt(12, 'var(--warm)', 800)}>bond energy</text>
      <text x={X(200) + 6} y={Y(-218) + 15} style={txt(12, 'var(--warm)', 800)}>436 kJ/mol</text>
      <text x={X(52)} y={40} style={txt(11, 'var(--muted)')}>too close:</text>
      <text x={X(52)} y={54} style={txt(11, 'var(--muted)')}>nuclei repel</text>
    </Fig>
  )
}

/** 2-D slice of an ionic lattice: alternating cations and anions. */
function IonicLattice() {
  const cells = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++) {
      const cat = (r + c) % 2 === 0
      cells.push(
        <g key={`${r}-${c}`}>
          <circle cx={70 + c * 52} cy={40 + r * 50} r={cat ? 13 : 21} style={{ fill: cat ? 'var(--primary)' : 'var(--accent)', opacity: 0.9 }} />
          <text x={70 + c * 52} y={45 + r * 50} textAnchor="middle" style={txt(14, '#fff', 800)}>
            {cat ? '+' : '−'}
          </text>
        </g>,
      )
    }
  return (
    <Fig vb="0 0 400 230" caption="Ionic solid (like NaCl): each ion is surrounded by ions of opposite charge. Small cations (+), larger anions (−).">
      {cells}
    </Fig>
  )
}

/** Metallic bonding + the two kinds of alloys. */
function Alloys() {
  const grid = (ox: number, fill: (i: number, j: number) => string, extra?: ReactNode) => {
    const g = []
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        g.push(<circle key={`${i}${j}`} cx={ox + 18 + j * 26} cy={50 + i * 26} r={12} style={{ fill: fill(i, j) }} />)
    return (
      <g>
        {g}
        {extra}
      </g>
    )
  }
  const host = 'var(--primary)'
  return (
    <Fig vb="0 0 400 190" caption="Pure metal: cations in a sea of electrons. Substitutional alloy: similar-sized atoms swap in (brass: Zn for Cu). Interstitial alloy: small atoms fill the gaps (steel: C in Fe).">
      {grid(10, () => host, (
        <g>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
            <text key={k} x={20 + (k % 3) * 40} y={66 + Math.floor(k / 3) * 30} style={txt(11, 'var(--warm)', 800)}>
              e⁻
            </text>
          ))}
        </g>
      ))}
      {grid(140, (i, j) => ((i * 4 + j) % 5 === 2 ? 'var(--warm)' : host))}
      {grid(270, () => host, (
        <g>
          {[
            [31, 63], [83, 63], [57, 89], [31, 115], [83, 115],
          ].map(([x, y], k) => (
            <circle key={k} cx={270 + x} cy={y} r={5} style={{ fill: 'var(--accent)' }} />
          ))}
        </g>
      ))}
      <text x={62} y={170} textAnchor="middle" style={txt(12)}>pure metal</text>
      <text x={192} y={170} textAnchor="middle" style={txt(12)}>substitutional</text>
      <text x={322} y={170} textAnchor="middle" style={txt(12)}>interstitial</text>
    </Fig>
  )
}

/** Particle views of solid, liquid, gas. */
function Phases() {
  const box = (ox: number, label: string, pts: [number, number][]) => (
    <g>
      <rect x={ox} y={20} width={110} height={110} rx={8} style={{ fill: 'var(--surface)', stroke: 'var(--border)', strokeWidth: 2 }} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={ox + x} cy={20 + y} r={8} style={{ fill: 'var(--primary)' }} />
      ))}
      <text x={ox + 55} y={150} textAnchor="middle" style={txt(13)}>
        {label}
      </text>
    </g>
  )
  const solid: [number, number][] = []
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) solid.push([15 + j * 20, 15 + i * 20])
  const liquid: [number, number][] = [
    [14, 98], [31, 96], [48, 99], [66, 95], [84, 98], [99, 92], [20, 80], [38, 79], [56, 82], [74, 78], [92, 76],
    [12, 62], [29, 63], [47, 64], [65, 61], [83, 60], [24, 45], [43, 47], [61, 44], [79, 43], [97, 58],
  ]
  const gas: [number, number][] = [
    [20, 25], [80, 18], [55, 55], [15, 95], [92, 85], [40, 88],
  ]
  return (
    <Fig vb="0 0 400 165" caption="Solid: fixed positions, vibrating. Liquid: touching but sliding past each other. Gas: far apart, fast and random.">
      {box(15, 'solid (crystalline)', solid)}
      {box(145, 'liquid', liquid)}
      {box(275, 'gas', gas)}
    </Fig>
  )
}

/** Maxwell–Boltzmann distribution at two temperatures (N2 speeds, computed). */
function MaxwellBoltzmann() {
  const m = 0.028 / 6.022e23
  const k = 1.380649e-23
  const f = (v: number, T: number) => 4 * Math.PI * (m / (2 * Math.PI * k * T)) ** 1.5 * v * v * Math.exp((-m * v * v) / (2 * k * T))
  const X = (v: number) => 50 + (v / 1500) * 330
  const peak = f(Math.sqrt((2 * k * 300) / m), 300)
  const Y = (p: number) => 200 - (p / peak) * 165
  const curve = (T: number) => {
    const pts: string[] = []
    for (let v = 0; v <= 1500; v += 15) pts.push(`${X(v).toFixed(1)},${Y(f(v, T)).toFixed(1)}`)
    return pts.join(' ')
  }
  return (
    <Fig vb="0 0 400 240" caption="Nitrogen molecules at 300 K and 600 K. Hotter: the curve flattens and shifts right (more fast molecules). The area under each curve is the same (same number of molecules).">
      <Axes x0={50} y0={200} x1={385} y1={20} xl="Molecular speed (m/s) →" yl="Fraction of molecules" />
      {[0, 500, 1000, 1500].map((v) => (
        <text key={v} x={X(v)} y={215} textAnchor="middle" style={txt(11, 'var(--muted)')}>
          {v}
        </text>
      ))}
      <polyline points={curve(300)} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <polyline points={curve(600)} style={{ stroke: 'var(--warm)', fill: 'none', strokeWidth: 3 }} />
      <text x={X(330)} y={Y(peak) - 6} style={txt(12, 'var(--primary)', 800)}>300 K</text>
      <text x={X(700)} y={Y(f(600, 600)) - 10} style={txt(12, 'var(--warm)', 800)}>600 K</text>
    </Fig>
  )
}

/** The electromagnetic spectrum and what each region does to molecules. */
function EmSpectrum() {
  const regions = [
    { n: 'radio', c: '#9aa4b5' },
    { n: 'microwave', c: '#7b8cde', what: 'rotation' },
    { n: 'infrared', c: '#e07a5f', what: 'vibration' },
    { n: 'visible', c: 'url(#rainbow)', what: 'electrons' },
    { n: 'UV', c: '#8e44ad', what: 'electrons' },
    { n: 'X-ray', c: '#5d6679' },
  ]
  return (
    <Fig vb="0 0 400 170" caption="Higher frequency = shorter wavelength = more energy per photon.">
      <defs>
        <linearGradient id="rainbow" x1="0" x2="1">
          <stop offset="0" stopColor="#e74c3c" />
          <stop offset="0.25" stopColor="#f39c12" />
          <stop offset="0.5" stopColor="#2ecc71" />
          <stop offset="0.75" stopColor="#3498db" />
          <stop offset="1" stopColor="#8e44ad" />
        </linearGradient>
      </defs>
      {regions.map((r, i) => (
        <g key={r.n}>
          <rect x={10 + i * 63} y={40} width={60} height={34} rx={6} style={{ fill: r.c }} />
          <text x={40 + i * 63} y={32} textAnchor="middle" style={txt(11)}>
            {r.n}
          </text>
          {r.what && (
            <text x={40 + i * 63} y={92} textAnchor="middle" style={txt(11, 'var(--accent)', 800)}>
              {r.what}
            </text>
          )}
        </g>
      ))}
      <text x={10} y={125} style={txt(12, 'var(--muted)')}>← longer λ, lower ν, lower energy</text>
      <text x={390} y={148} textAnchor="end" style={txt(12, 'var(--muted)')}>shorter λ, higher ν, higher energy →</text>
    </Fig>
  )
}

/** Beer's law calibration line. */
function BeerCalibration() {
  const X = (c: number) => 55 + (c / 0.5) * 310
  const Y = (a: number) => 200 - (a / 1.0) * 170
  const pts = [0.1, 0.2, 0.3, 0.4]
  return (
    <Fig vb="0 0 400 240" caption="Standards of known concentration make a straight line (A = εbc). Read an unknown's concentration from its absorbance.">
      <Axes x0={55} y0={200} x1={385} y1={20} xl="Concentration (M)" yl="Absorbance" />
      <line x1={X(0)} y1={Y(0)} x2={X(0.48)} y2={Y(0.96)} style={{ stroke: 'var(--primary)', strokeWidth: 2.5 }} />
      {pts.map((c) => (
        <circle key={c} cx={X(c)} cy={Y(2 * c)} r={5} style={{ fill: 'var(--primary)' }} />
      ))}
      {[0.1, 0.2, 0.3, 0.4].map((c) => (
        <text key={c} x={X(c)} y={215} textAnchor="middle" style={txt(11, 'var(--muted)')}>
          {c}
        </text>
      ))}
      <line x1={X(0)} y1={Y(0.5)} x2={X(0.25)} y2={Y(0.5)} style={{ stroke: 'var(--warm)', strokeWidth: 2, strokeDasharray: '5 4' }} />
      <line x1={X(0.25)} y1={Y(0.5)} x2={X(0.25)} y2={Y(0)} style={{ stroke: 'var(--warm)', strokeWidth: 2, strokeDasharray: '5 4' }} />
      <circle cx={X(0.25)} cy={Y(0.5)} r={6} style={{ fill: 'var(--warm)' }} />
      <text x={X(0.25) + 10} y={Y(0.5) - 8} style={txt(12, 'var(--warm)', 800)}>unknown: A = 0.50 → 0.25 M</text>
    </Fig>
  )
}

/** Paper chromatogram with Rf. */
function Chromatogram() {
  return (
    <Fig vb="0 0 400 230" caption="Rf = distance traveled by the spot ÷ distance traveled by the solvent front.">
      <rect x={140} y={15} width={120} height={200} rx={4} style={{ fill: 'var(--surface)', stroke: 'var(--border)', strokeWidth: 2 }} />
      <line x1={140} y1={40} x2={260} y2={40} style={{ stroke: 'var(--accent)', strokeWidth: 2, strokeDasharray: '6 4' }} />
      <text x={268} y={44} style={txt(12, 'var(--accent)', 800)}>solvent front</text>
      <line x1={140} y1={190} x2={260} y2={190} style={thin} />
      <text x={268} y={194} style={txt(12, 'var(--muted)')}>start line</text>
      <ellipse cx={180} cy={75} rx={10} ry={7} style={{ fill: 'var(--warm)' }} />
      <ellipse cx={220} cy={150} rx={10} ry={7} style={{ fill: 'var(--primary)' }} />
      <text x={128} y={79} textAnchor="end" style={txt(12)}>A: Rf ≈ 0.77</text>
      <text x={128} y={154} textAnchor="end" style={txt(12)}>B: Rf ≈ 0.27</text>
      <rect x={140} y={195} width={120} height={20} style={{ fill: 'var(--accent)', opacity: 0.25 }} />
    </Fig>
  )
}

/** Strong acid–strong base titration: 25.0 mL 0.100 M HCl titrated with 0.100 M NaOH (computed). */
function TitrationStrong() {
  const pH = (v: number) => {
    const acid = 25.0 * 0.1
    const base = v * 0.1
    const vol = (25.0 + v) / 1000
    if (Math.abs(acid - base) < 1e-9) return 7
    if (acid > base) return -Math.log10((acid - base) / 1000 / vol)
    return 14 + Math.log10((base - acid) / 1000 / vol)
  }
  const X = (v: number) => 55 + (v / 50) * 320
  const Y = (p: number) => 205 - (p / 14) * 180
  const pts: string[] = []
  for (let v = 0; v <= 50; v += 0.25) pts.push(`${X(v).toFixed(1)},${Y(pH(v)).toFixed(1)}`)
  return (
    <Fig vb="0 0 400 245" caption="25.0 mL of 0.100 M HCl titrated with 0.100 M NaOH. The steep jump marks the equivalence point (25.0 mL, pH 7).">
      <Axes x0={55} y0={205} x1={385} y1={20} xl="Volume of NaOH added (mL)" yl="pH" />
      {[0, 7, 14].map((p) => (
        <text key={p} x={48} y={Y(p) + 4} textAnchor="end" style={txt(11, 'var(--muted)')}>
          {p}
        </text>
      ))}
      {[0, 25, 50].map((v) => (
        <text key={v} x={X(v)} y={219} textAnchor="middle" style={txt(11, 'var(--muted)')}>
          {v}
        </text>
      ))}
      <polyline points={pts.join(' ')} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <circle cx={X(25)} cy={Y(7)} r={6} style={{ fill: 'var(--warm)' }} />
      <text x={X(25) + 10} y={Y(7) + 4} style={txt(12, 'var(--warm)', 800)}>equivalence point</text>
    </Fig>
  )
}

/** Smooth energy-profile path through given (x, energy) points using a cubic Bézier per segment. */
function profilePath(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`
  }
  return d
}

function ProfileAxes() {
  return <Axes x0={50} y0={210} x1={385} y1={15} xl="Reaction coordinate →" yl="Potential energy" />
}

/** Single-step exothermic reaction energy profile. */
function EnergyProfile() {
  const R = 150, TS = 45, P = 185
  return (
    <Fig vb="0 0 400 250" caption="Ea = transition state − reactants. ΔH = products − reactants (negative here: exothermic).">
      <ProfileAxes />
      <path d={profilePath([[60, R], [120, R], [205, TS], [290, P], [375, P]])} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <text x={205} y={TS - 8} textAnchor="middle" style={txt(12)}>transition state</text>
      <text x={75} y={R - 8} style={txt(12)}>reactants</text>
      <text x={315} y={P - 8} style={txt(12)}>products</text>
      <line x1={140} y1={R} x2={140} y2={TS} style={{ stroke: 'var(--warm)', strokeWidth: 2 }} />
      <text x={130} y={(R + TS) / 2} textAnchor="end" style={txt(13, 'var(--warm)', 800)}>Ea</text>
      <line x1={120} y1={R} x2={350} y2={R} style={{ ...thin, strokeDasharray: '4 4' }} />
      <line x1={340} y1={R} x2={340} y2={P} style={{ stroke: 'var(--accent)', strokeWidth: 2 }} />
      <text x={347} y={(R + P) / 2 + 4} style={txt(13, 'var(--accent)', 800)}>ΔH</text>
    </Fig>
  )
}

/** Catalyzed vs. uncatalyzed pathway. */
function EnergyProfileCatalyst() {
  const R = 150, P = 185
  return (
    <Fig vb="0 0 400 250" caption="A catalyst provides a different pathway with a lower activation energy. ΔH does not change.">
      <ProfileAxes />
      <path d={profilePath([[60, R], [120, R], [205, 40], [290, P], [375, P]])} style={{ stroke: 'var(--muted)', fill: 'none', strokeWidth: 3, strokeDasharray: '7 5' }} />
      <path d={profilePath([[60, R], [120, R], [205, 100], [290, P], [375, P]])} style={{ stroke: 'var(--accent)', fill: 'none', strokeWidth: 3 }} />
      <text x={205} y={32} textAnchor="middle" style={txt(12, 'var(--muted)', 800)}>uncatalyzed</text>
      <text x={205} y={92} textAnchor="middle" style={txt(12, 'var(--accent)', 800)}>catalyzed</text>
      <text x={70} y={R - 8} style={txt(12)}>reactants</text>
      <text x={315} y={P - 8} style={txt(12)}>products</text>
    </Fig>
  )
}

/** Two-step mechanism energy profile with an intermediate. */
function MultistepProfile() {
  return (
    <Fig vb="0 0 400 250" caption="Two humps = two elementary steps. The valley between them is the intermediate. Here step 1 has the larger activation energy, so it is the slow step.">
      <ProfileAxes />
      <path d={profilePath([[60, 160], [100, 160], [160, 40], [215, 120], [270, 75], [330, 190], [375, 190]])} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <text x={160} y={32} textAnchor="middle" style={txt(12)}>TS₁</text>
      <text x={270} y={67} textAnchor="middle" style={txt(12)}>TS₂</text>
      <text x={215} y={140} textAnchor="middle" style={txt(12, 'var(--warm)', 800)}>intermediate</text>
      <line x1={110} y1={160} x2={110} y2={42} style={{ stroke: 'var(--warm)', strokeWidth: 2 }} />
      <text x={104} y={100} textAnchor="end" style={txt(12, 'var(--warm)', 800)}>Ea₁</text>
      <line x1={232} y1={120} x2={232} y2={77} style={{ stroke: 'var(--accent)', strokeWidth: 2 }} />
      <text x={238} y={102} style={txt(12, 'var(--accent)', 800)}>Ea₂</text>
      <text x={62} y={152} style={txt(12)}>reactants</text>
      <text x={318} y={182} style={txt(12)}>products</text>
    </Fig>
  )
}

/** Maxwell–Boltzmann energy distribution with an activation-energy threshold at two temperatures. */
function MbActivation() {
  // energy distribution f(E) ∝ sqrt(E) exp(-E/kT), arbitrary units
  const f = (E: number, T: number) => (2 / Math.sqrt(Math.PI)) * Math.sqrt(E) * T ** -1.5 * Math.exp(-E / T)
  const X = (E: number) => 50 + (E / 10) * 330
  const peak = f(0.5, 1)
  const Y = (p: number) => 205 - (p / peak) * 170
  const ea = 4.5
  const curve = (T: number) => {
    const pts: string[] = []
    for (let E = 0; E <= 10; E += 0.1) pts.push(`${X(E).toFixed(1)},${Y(f(E, T)).toFixed(1)}`)
    return pts.join(' ')
  }
  const area = (T: number) => {
    const pts: string[] = [`${X(ea)},${Y(0)}`]
    for (let E = ea; E <= 10; E += 0.1) pts.push(`${X(E).toFixed(1)},${Y(f(E, T)).toFixed(1)}`)
    pts.push(`${X(10)},${Y(0)}`)
    return pts.join(' ')
  }
  return (
    <Fig vb="0 0 400 245" caption="Only collisions with energy ≥ Ea can react (shaded). At the higher temperature, a much larger fraction of particles is past the Ea line.">
      <Axes x0={50} y0={205} x1={385} y1={20} xl="Kinetic energy →" yl="Fraction of particles" />
      <polygon points={area(2)} style={{ fill: 'var(--warm)', opacity: 0.3 }} />
      <polygon points={area(1)} style={{ fill: 'var(--primary)', opacity: 0.45 }} />
      <polyline points={curve(1)} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <polyline points={curve(2)} style={{ stroke: 'var(--warm)', fill: 'none', strokeWidth: 3 }} />
      <line x1={X(ea)} y1={Y(0)} x2={X(ea)} y2={30} style={{ stroke: 'var(--text)', strokeWidth: 2, strokeDasharray: '5 4' }} />
      <text x={X(ea) + 5} y={40} style={txt(13, 'var(--text)', 800)}>Ea</text>
      <text x={X(0.7)} y={Y(peak) - 6} style={txt(12, 'var(--primary)', 800)}>lower T</text>
      <text x={X(2.2)} y={Y(f(2.2, 2)) - 12} style={txt(12, 'var(--warm)', 800)}>higher T</text>
    </Fig>
  )
}

/** Three plots for first-order data: only ln[A] vs t is straight. */
function IntegratedPlots() {
  const k = 0.25
  const A = (t: number) => Math.exp(-k * t)
  const plot = (ox: number, title: string, fn: (t: number) => number, lo: number, hi: number) => {
    const pts: string[] = []
    for (let t = 0; t <= 10; t += 0.25) {
      const v = fn(t)
      pts.push(`${(ox + 10 + (t / 10) * 100).toFixed(1)},${(150 - ((v - lo) / (hi - lo)) * 110).toFixed(1)}`)
    }
    return (
      <g>
        <line x1={ox + 10} y1={150} x2={ox + 115} y2={150} style={ink} />
        <line x1={ox + 10} y1={150} x2={ox + 10} y2={35} style={ink} />
        <polyline points={pts.join(' ')} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
        <text x={ox + 62} y={25} textAnchor="middle" style={txt(13, 'var(--text)', 800)}>
          {title}
        </text>
        <text x={ox + 62} y={168} textAnchor="middle" style={txt(11, 'var(--muted)')}>
          time →
        </text>
      </g>
    )
  }
  return (
    <Fig vb="0 0 400 180" caption="Data for a FIRST-order reaction: only the ln[A] vs. time plot is a straight line (slope = −k).">
      {plot(0, '[A] vs t', A, 0, 1)}
      {plot(133, 'ln[A] vs t', (t) => Math.log(A(t)), -2.5, 0)}
      {plot(266, '1/[A] vs t', (t) => 1 / A(t), 1, 12.2)}
    </Fig>
  )
}

/** Heating curve of water (schematic). */
function HeatingCurve() {
  // Slopes reflect specific heats: liquid water (4.18 J/g·°C) warms most slowly; ice and steam (~2 J/g·°C) faster.
  const pts: [number, number][] = [
    [55, 200], [85, 170], [135, 170], [255, 110], [345, 110], [375, 80],
  ]
  return (
    <Fig vb="0 0 400 245" caption="Flat parts = phase changes: energy goes into overcoming IMFs, so the temperature stays constant. Liquid water's slope is the gentlest because it has the highest specific heat. The boiling plateau is longer because ΔH_vap (40.7 kJ/mol) is much larger than ΔH_fus (6.01 kJ/mol).">
      <Axes x0={50} y0={210} x1={385} y1={20} xl="Heat added →" yl="Temperature" />
      <polyline points={pts.map(([x, y]) => `${x},${y}`).join(' ')} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <text x={110} y={162} textAnchor="middle" style={txt(11, 'var(--accent)', 800)}>melting (0 °C)</text>
      <text x={300} y={102} textAnchor="middle" style={txt(11, 'var(--accent)', 800)}>boiling (100 °C)</text>
      <text x={60} y={180} style={txt(11, 'var(--muted)')}>solid</text>
      <text x={200} y={155} style={txt(11, 'var(--muted)')}>liquid</text>
      <text x={352} y={86} style={txt(11, 'var(--muted)')}>gas</text>
    </Fig>
  )
}

/** Exothermic vs endothermic energy level diagrams. */
function EnergyLevels() {
  const box = (ox: number, title: string, rY: number, pY: number, color: string, label: string) => (
    <g>
      <line x1={ox} y1={200} x2={ox} y2={30} style={ink} />
      <text x={ox + 80} y={22} textAnchor="middle" style={txt(13, 'var(--text)', 800)}>{title}</text>
      <line x1={ox + 15} y1={rY} x2={ox + 75} y2={rY} style={{ stroke: 'var(--text)', strokeWidth: 3 }} />
      <text x={ox + 45} y={rY - 6} textAnchor="middle" style={txt(11)}>reactants</text>
      <line x1={ox + 95} y1={pY} x2={ox + 155} y2={pY} style={{ stroke: 'var(--text)', strokeWidth: 3 }} />
      <text x={ox + 125} y={pY - 6} textAnchor="middle" style={txt(11)}>products</text>
      <line x1={ox + 85} y1={rY} x2={ox + 85} y2={pY} style={{ stroke: color, strokeWidth: 3 }} />
      <text x={ox + 85} y={215} textAnchor="middle" style={txt(12, color, 800)}>{label}</text>
    </g>
  )
  return (
    <Fig vb="0 0 400 235" caption="Exothermic: products are lower in energy, so heat is released (ΔH < 0). Endothermic: products are higher, so heat is absorbed (ΔH > 0).">
      {box(25, 'Exothermic', 80, 170, 'var(--warm)', 'ΔH < 0')}
      {box(215, 'Endothermic', 170, 80, 'var(--accent)', 'ΔH > 0')}
    </Fig>
  )
}

/** Approach to equilibrium: concentrations level off, forward and reverse rates become equal. */
function EquilibriumApproach() {
  const panel = (ox: number, title: string, a: (t: number) => number, b: (t: number) => number, la: string, lb: string) => {
    const X = (t: number) => ox + 15 + (t / 10) * 160
    const Y = (v: number) => 175 - v * 130
    const line = (fn: (t: number) => number) => {
      const pts: string[] = []
      for (let t = 0; t <= 10; t += 0.2) pts.push(`${X(t).toFixed(1)},${Y(fn(t)).toFixed(1)}`)
      return pts.join(' ')
    }
    return (
      <g>
        <line x1={ox + 15} y1={175} x2={ox + 180} y2={175} style={ink} />
        <line x1={ox + 15} y1={175} x2={ox + 15} y2={35} style={ink} />
        <text x={ox + 97} y={24} textAnchor="middle" style={txt(13, 'var(--text)', 800)}>{title}</text>
        <text x={ox + 97} y={193} textAnchor="middle" style={txt(11, 'var(--muted)')}>time →</text>
        <polyline points={line(a)} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
        <polyline points={line(b)} style={{ stroke: 'var(--warm)', fill: 'none', strokeWidth: 3 }} />
        <text x={X(7)} y={Y(a(7)) - 8} style={txt(11, 'var(--primary)', 800)}>{la}</text>
        <text x={X(7)} y={Y(b(7)) + 16} style={txt(11, 'var(--warm)', 800)}>{lb}</text>
        <line x1={X(4)} y1={40} x2={X(4)} y2={175} style={{ ...thin, strokeDasharray: '4 4' }} />
        <text x={X(4) + 3} y={48} style={txt(10, 'var(--muted)')}>equilibrium</text>
      </g>
    )
  }
  const k = 0.9
  return (
    <Fig vb="0 0 400 205" caption="Left: concentrations stop changing (but are not equal!). Right: forward and reverse rates become equal: a dynamic equilibrium.">
      {panel(0, 'Concentration', (t) => 0.95 - 0.55 * (1 - Math.exp(-k * t)), (t) => 0.55 * (1 - Math.exp(-k * t)), '[reactant]', '[product]')}
      {panel(205, 'Rate', (t) => 0.3 + 0.62 * Math.exp(-k * t), (t) => 0.3 * (1 - Math.exp(-k * t)), 'forward', 'reverse')}
    </Fig>
  )
}

/** Weak acid (25.0 mL 0.100 M CH3COOH, Ka 1.8e-5) titrated with 0.100 M NaOH (computed). */
function TitrationWeak() {
  const Ka = 1.8e-5, Kw = 1.0e-14
  const pH = (v: number) => {
    const ha0 = 25.0 * 0.1, oh = v * 0.1, vol = (25.0 + v) / 1000
    const pH0 = -Math.log10(Math.sqrt(Ka * 0.1))
    if (v === 0) return pH0
    // Henderson–Hasselbalch is only valid once real buffer amounts exist; never dip below the starting pH
    if (oh < ha0 - 1e-9) return Math.max(pH0, -Math.log10(Ka) + Math.log10(oh / (ha0 - oh)))
    if (Math.abs(oh - ha0) < 1e-9) {
      const a = ha0 / 1000 / vol
      return 14 + Math.log10(Math.sqrt((Kw / Ka) * a))
    }
    return 14 + Math.log10((oh - ha0) / 1000 / vol)
  }
  const X = (v: number) => 55 + (v / 50) * 320
  const Y = (p: number) => 205 - (p / 14) * 180
  const pts: string[] = []
  for (let v = 0; v <= 50; v += 0.25) pts.push(`${X(v).toFixed(1)},${Y(pH(v)).toFixed(1)}`)
  return (
    <Fig vb="0 0 400 245" caption="Weak acid + strong base. Half-equivalence (12.5 mL): pH = pKa = 4.74. Equivalence (25.0 mL): pH ≈ 8.7, basic, because the acetate ion is present.">
      <Axes x0={55} y0={205} x1={385} y1={20} xl="Volume of NaOH added (mL)" yl="pH" />
      {[0, 7, 14].map((p) => (
        <text key={p} x={48} y={Y(p) + 4} textAnchor="end" style={txt(11, 'var(--muted)')}>{p}</text>
      ))}
      {[0, 12.5, 25, 50].map((v) => (
        <text key={v} x={X(v)} y={219} textAnchor="middle" style={txt(11, 'var(--muted)')}>{v}</text>
      ))}
      <rect x={X(3)} y={Y(6)} width={X(22) - X(3)} height={Y(3.6) - Y(6)} style={{ fill: 'var(--accent)', opacity: 0.12 }} />
      <text x={X(12.5)} y={Y(6.3)} textAnchor="middle" style={txt(11, 'var(--accent)', 800)}>buffer region</text>
      <polyline points={pts.join(' ')} style={{ stroke: 'var(--primary)', fill: 'none', strokeWidth: 3 }} />
      <circle cx={X(12.5)} cy={Y(pH(12.5))} r={6} style={{ fill: 'var(--accent)' }} />
      <text x={X(12.5) + 8} y={Y(pH(12.5)) + 16} style={txt(12, 'var(--accent)', 800)}>pH = pKa</text>
      <circle cx={X(25)} cy={Y(pH(25))} r={6} style={{ fill: 'var(--warm)' }} />
      <text x={X(25) + 10} y={Y(pH(25)) + 4} style={txt(12, 'var(--warm)', 800)}>equivalence (pH ≈ 8.7)</text>
    </Fig>
  )
}

/** Zn/Cu galvanic cell with salt bridge and electron flow. */
function GalvanicCell() {
  return (
    <Fig vb="0 0 400 250" caption="Zn | Zn²⁺ || Cu²⁺ | Cu. Electrons flow through the wire from the anode (oxidation, Zn) to the cathode (reduction, Cu). In the salt bridge, anions move toward the anode and cations toward the cathode.">
      <defs>
        <marker id="arrE" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" style={{ fill: 'var(--warm)' }} />
        </marker>
      </defs>
      {/* beakers */}
      <path d="M30 110 L30 225 L150 225 L150 110" style={{ ...ink, fill: 'none' }} />
      <path d="M250 110 L250 225 L370 225 L370 110" style={{ ...ink, fill: 'none' }} />
      <rect x={32} y={140} width={116} height={83} style={{ fill: 'var(--accent)', opacity: 0.15 }} />
      <rect x={252} y={140} width={116} height={83} style={{ fill: 'var(--primary)', opacity: 0.25 }} />
      {/* electrodes */}
      <rect x={75} y={85} width={22} height={115} style={{ fill: 'var(--muted)' }} />
      <rect x={303} y={85} width={22} height={115} style={{ fill: '#b87333' }} />
      <text x={86} y={215} textAnchor="middle" style={txt(12, 'var(--text)', 800)}>Zn</text>
      <text x={314} y={215} textAnchor="middle" style={txt(12, 'var(--text)', 800)}>Cu</text>
      {/* salt bridge */}
      <path d="M120 165 L120 120 L280 120 L280 165" style={{ stroke: 'var(--border)', fill: 'none', strokeWidth: 14 }} />
      <text x={200} y={113} textAnchor="middle" style={txt(11, 'var(--muted)')}>salt bridge</text>
      <text x={200} y={140} textAnchor="middle" style={txt(10, 'var(--muted)')}>← anions · cations →</text>
      {/* wire */}
      <polyline points="86,85 86,40 314,40 314,85" style={{ stroke: 'var(--text)', fill: 'none', strokeWidth: 2 }} />
      <circle cx={200} cy={40} r={15} style={{ fill: 'var(--surface)', stroke: 'var(--text)', strokeWidth: 2 }} />
      <text x={200} y={45} textAnchor="middle" style={txt(13, 'var(--text)', 800)}>V</text>
      <line x1={110} y1={30} x2={170} y2={30} style={{ stroke: 'var(--warm)', strokeWidth: 2.5 }} markerEnd="url(#arrE)" />
      <line x1={230} y1={30} x2={290} y2={30} style={{ stroke: 'var(--warm)', strokeWidth: 2.5 }} markerEnd="url(#arrE)" />
      <text x={140} y={22} textAnchor="middle" style={txt(11, 'var(--warm)', 800)}>e⁻</text>
      <text x={260} y={22} textAnchor="middle" style={txt(11, 'var(--warm)', 800)}>e⁻</text>
      <text x={90} y={245} textAnchor="middle" style={txt(11)}>ANODE: Zn → Zn²⁺ + 2e⁻</text>
      <text x={310} y={245} textAnchor="middle" style={txt(11)}>CATHODE: Cu²⁺ + 2e⁻ → Cu</text>
    </Fig>
  )
}

const DIAGRAMS: Record<string, () => ReactNode> = {
  'galvanic-cell': GalvanicCell,
  'titration-weak': TitrationWeak,
  'equilibrium-approach': EquilibriumApproach,
  'heating-curve': HeatingCurve,
  'energy-levels': EnergyLevels,
  'energy-profile': EnergyProfile,
  'energy-profile-catalyst': EnergyProfileCatalyst,
  'multistep-profile': MultistepProfile,
  'mb-activation': MbActivation,
  'integrated-plots': IntegratedPlots,
  'titration-strong': TitrationStrong,
  phases: Phases,
  'maxwell-boltzmann': MaxwellBoltzmann,
  'em-spectrum': EmSpectrum,
  'beer-calibration': BeerCalibration,
  chromatogram: Chromatogram,
  'mass-spec-cl': MassSpecCl,
  'pes-na': PesNa,
  'periodic-trends': PeriodicTrends,
  'pe-curve-h2': PeCurveH2,
  'ionic-lattice': IonicLattice,
  alloys: Alloys,
}

export function registerDiagrams(more: Record<string, () => ReactNode>) {
  Object.assign(DIAGRAMS, more)
}

export function hasDiagram(id: string) {
  return id in DIAGRAMS
}

export function Diagram({ id }: { id: string }) {
  const D = DIAGRAMS[id]
  return D ? <D /> : null
}
