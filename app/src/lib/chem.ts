// Chemistry helpers used to VERIFY lesson content (molar masses, balanced equations).
// Atomic masses: IUPAC standard values rounded as on typical AP periodic tables.

export const ATOMIC_MASS: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.012, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974,
  S: 32.06, Cl: 35.45, Ar: 39.95, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867,
  V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546,
  Zn: 65.38, Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95, Ru: 101.07,
  Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71, Sb: 121.76,
  Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33, La: 138.91, Hf: 178.49,
  W: 183.84, Pt: 195.08, Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98,
  U: 238.03,
}

export type AtomCounts = Record<string, number>

function addCounts(target: AtomCounts, src: AtomCounts, mult = 1) {
  for (const [el, n] of Object.entries(src)) target[el] = (target[el] ?? 0) + n * mult
}

/** Parse a formula like "Ca(OH)2", "CuSO4·5H2O", "[Cu(NH3)4]" into atom counts. Charge must be stripped first. */
export function parseFormula(formula: string, allowGeneric = false): AtomCounts {
  const parts = formula.split(/[·*•]/)
  const total: AtomCounts = {}
  parts.forEach((part, idx) => {
    const m = idx > 0 ? part.match(/^(\d+)(.*)$/) : null
    addCounts(total, parseGroup(m ? m[2] : part, allowGeneric), m ? Number(m[1]) : 1)
  })
  return total
}

function parseGroup(s: string, allowGeneric = false): AtomCounts {
  let i = 0
  function readNum(): number {
    let n = ''
    while (i < s.length && /\d/.test(s[i])) n += s[i++]
    return n ? Number(n) : 1
  }
  function parseSeq(close?: string): AtomCounts {
    const counts: AtomCounts = {}
    while (i < s.length) {
      const ch = s[i]
      if (ch === '(' || ch === '[') {
        i++
        const inner = parseSeq(ch === '(' ? ')' : ']')
        addCounts(counts, inner, readNum())
      } else if (ch === ')' || ch === ']') {
        if (ch !== close) throw new Error(`Unbalanced bracket in ${s}`)
        i++
        return counts
      } else if (/[A-Z]/.test(ch)) {
        let el = ch
        i++
        while (i < s.length && /[a-z]/.test(s[i])) el += s[i++]
        // generic placeholder species like A, B, X (used in kinetics examples)
        if (!(el in ATOMIC_MASS) && !(allowGeneric && el.length === 1)) throw new Error(`Unknown element "${el}" in ${s}`)
        counts[el] = (counts[el] ?? 0) + readNum()
      } else {
        throw new Error(`Unexpected "${ch}" in formula ${s}`)
      }
    }
    if (close) throw new Error(`Missing ${close} in ${s}`)
    return counts
  }
  return parseSeq()
}

export function molarMass(formula: string): number {
  const counts = parseFormula(stripSpecies(formula).formula)
  let m = 0
  for (const [el, n] of Object.entries(counts)) m += ATOMIC_MASS[el] * n
  return m
}

export interface Species {
  coef: number
  formula: string
  charge: number
  state?: string
}

/** Split "2Fe^3+(aq)" into coefficient, formula, charge, state. */
export function stripSpecies(raw: string): Species {
  let s = raw.trim()
  let state: string | undefined
  const st = s.match(/\((s|l|g|aq)\)$/)
  if (st) {
    state = st[1]
    s = s.slice(0, -st[0].length)
  }
  let charge = 0
  const ch = s.match(/\^(\d*)([+-])$/)
  if (ch) {
    charge = (ch[1] ? Number(ch[1]) : 1) * (ch[2] === '+' ? 1 : -1)
    s = s.slice(0, -ch[0].length)
  }
  let coef = 1
  const co = s.match(/^(\d+\/\d+|\d+)\s*(?=[A-Z(\[e])/)
  if (co) {
    coef = co[1].includes('/') ? Number(co[1].split('/')[0]) / Number(co[1].split('/')[1]) : Number(co[1])
    s = s.slice(co[0].length)
  }
  return { coef, formula: s, charge, state }
}

export interface BalanceResult {
  ok: boolean
  atoms: { left: AtomCounts; right: AtomCounts }
  charge: { left: number; right: number }
}

/** Check an equation written like "2H2(g) + O2(g) -> 2H2O(l)" (also <=>, ⇌, →). Electrons: "e^-". */
export function checkBalanced(eq: string): BalanceResult {
  const sides = eq.split(/\s*(?:->|<=>|⇌|→)\s*/)
  if (sides.length !== 2) throw new Error(`Equation needs exactly one arrow: ${eq}`)
  const tally = (side: string) => {
    const atoms: AtomCounts = {}
    let charge = 0
    for (const raw of side.split(/\s+\+\s+/)) {
      const sp = stripSpecies(raw)
      charge += sp.charge * sp.coef
      if (sp.formula === 'e') continue
      addCounts(atoms, parseFormula(sp.formula, true), sp.coef)
    }
    return { atoms, charge }
  }
  const L = tally(sides[0])
  const R = tally(sides[1])
  const els = new Set([...Object.keys(L.atoms), ...Object.keys(R.atoms)])
  let ok = Math.abs(L.charge - R.charge) < 1e-9
  for (const el of els) if (Math.abs((L.atoms[el] ?? 0) - (R.atoms[el] ?? 0)) > 1e-9) ok = false
  return { ok, atoms: { left: L.atoms, right: R.atoms }, charge: { left: L.charge, right: R.charge } }
}

// Constants from the AP Chemistry Equations and Constants sheet (effective 2025).
export const CONST = {
  NA: 6.022e23,
  h: 6.626e-34,
  c: 2.998e8,
  R_J: 8.314,
  R_Latm: 0.08206,
  F: 96485,
  Kw: 1.0e-14,
}
