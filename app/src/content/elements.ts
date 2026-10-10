// The periodic table: where each element sits, and the quick insights shown when it is tapped.
// The numbers come from elementData.ts (PubChem). Everything else here is worked out from an
// element's position by rules that the test suite checks, so no fact is typed in twice.

import { ELEMENT_ROWS } from './elementData'

export type Category =
  | 'Alkali metal'
  | 'Alkaline earth metal'
  | 'Transition metal'
  | 'Post-transition metal'
  | 'Metalloid'
  | 'Nonmetal'
  | 'Halogen'
  | 'Noble gas'
  | 'Lanthanide'
  | 'Actinide'

export interface Element {
  z: number
  symbol: string
  name: string
  /** as printed on the table; "(210)" = mass number of a long-lived isotope (no stable isotopes) */
  mass: string
  config: string
  electronegativity: number | null
  oxidation: string
  state: 'solid' | 'liquid' | 'gas'
  category: Category
  period: number
  /** 1–18; undefined for the two rows drawn below the table */
  group?: number
  /** grid position: rows 1–7 are the main table, 9–10 the lanthanides and actinides */
  row: number
  col: number
  /** made in labs a few atoms at a time: properties are predictions */
  superheavy: boolean
}

const PERIOD_END = [2, 10, 18, 36, 54, 86, 118]

function place(z: number): { period: number; group?: number; row: number; col: number } {
  const period = PERIOD_END.findIndex((end) => z <= end) + 1
  const start = period === 1 ? 1 : PERIOD_END[period - 2] + 1
  const i = z - start // position within the period, from 0
  if (period === 1) return { period, group: z === 1 ? 1 : 18, row: 1, col: z === 1 ? 1 : 18 }
  if (period <= 3) {
    const group = i < 2 ? i + 1 : i + 11
    return { period, group, row: period, col: group }
  }
  if (period <= 5) return { period, group: i + 1, row: period, col: i + 1 }
  // periods 6 and 7: La and Ac sit in group 3 (as on the AP exam's table); the next 14 go below
  if (i < 3) return { period, group: i + 1, row: period, col: i + 1 }
  if (i < 17) return { period, row: period + 3, col: i + 1 }
  return { period, group: i - 13, row: period, col: i - 13 }
}

export const ELEMENTS: Element[] = ELEMENT_ROWS.map(([z, symbol, name, mass, config, electronegativity, oxidation, state, category]) => ({
  z,
  symbol,
  name,
  mass,
  config,
  electronegativity,
  oxidation,
  state,
  category: category as Category,
  superheavy: z >= 104,
  ...place(z),
}))

export const CATEGORY_INFO: Record<Category, { key: string; blurb: string }> = {
  'Alkali metal': {
    key: 'alkali',
    blurb: 'Group 1 metals. One valence electron that is lost easily, so they form 1+ ions and react strongly with water.',
  },
  'Alkaline earth metal': {
    key: 'alkaline',
    blurb: 'Group 2 metals. Two valence electrons, so they form 2+ ions.',
  },
  'Transition metal': {
    key: 'transition',
    blurb: 'The d-block. Many form more than one positive ion (like Fe²⁺ and Fe³⁺), and many of their compounds are colored.',
  },
  'Post-transition metal': {
    key: 'post',
    blurb: 'Metals to the right of the d-block. Softer and lower-melting than most transition metals.',
  },
  Metalloid: {
    key: 'metalloid',
    blurb: 'On the staircase between metals and nonmetals, with properties in between. Several are semiconductors.',
  },
  Nonmetal: {
    key: 'nonmetal',
    blurb: 'Tend to gain or share electrons. They form covalent bonds with each other and negative ions with metals.',
  },
  Halogen: {
    key: 'halogen',
    blurb: 'Group 17. Seven valence electrons: one short of a full shell, so they form 1− ions and are very reactive.',
  },
  'Noble gas': {
    key: 'noble',
    blurb: 'Group 18. A full outer shell makes them very stable, so they rarely react.',
  },
  Lanthanide: { key: 'lanthanide', blurb: 'The first row of the f-block. Similar to one another; most form 3+ ions.' },
  Actinide: { key: 'actinide', blurb: 'The second row of the f-block. All are radioactive.' },
}

const DIATOMIC = new Set(['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'])
const NOBLE_Z: Record<string, number> = { He: 2, Ne: 10, Ar: 18, Kr: 36, Xe: 54, Rn: 86 }
const FILL_ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p']
const CAPACITY: Record<string, number> = { s: 2, p: 6, d: 10, f: 14 }

/** Electrons in each subshell beyond the noble-gas core, e.g. { '4s': 1, '3d': 5 }. */
export function outerSubshells(config: string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const part of config.replace(/^\[[A-Za-z]+\]\s*/, '').split(' ')) if (part) out[part.slice(0, 2)] = Number(part.slice(2))
  return out
}

/** Total electrons a configuration describes (core + outer); must equal the atomic number. */
export function electronCount(config: string): number {
  const core = /^\[([A-Za-z]+)\]/.exec(config)?.[1]
  return (core ? NOBLE_Z[core] : 0) + Object.values(outerSubshells(config)).reduce((a, b) => a + b, 0)
}

/** The configuration predicted by simply filling subshells in order (no exceptions). */
export function aufbau(z: number): Record<string, number> {
  const core = [86, 54, 36, 18, 10, 2].find((n) => n < z) ?? 0
  let left = z
  const out: Record<string, number> = {}
  let used = 0
  for (const sub of FILL_ORDER) {
    if (left <= 0) break
    const n = Math.min(left, CAPACITY[sub[1]])
    left -= n
    used += n
    if (used > core) out[sub] = n
  }
  return out
}

/** True when the real configuration differs from simple filling order (like Cr and Cu). */
export function isConfigException(e: Element): boolean {
  const a = aufbau(e.z)
  const b = outerSubshells(e.config)
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  return [...keys].some((k) => (a[k] ?? 0) !== (b[k] ?? 0))
}

/** Valence electrons for main-group elements (groups 1, 2 and 13–18). */
export function valenceElectrons(e: Element): number | null {
  if (e.group === undefined) return null
  if (e.symbol === 'He') return 2
  if (e.group <= 2) return e.group
  if (e.group >= 13) return e.group - 10
  return null
}

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
export const prettyConfig = (config: string) => config.replace(/([spdf])(\d+)/g, (_, l: string, n: string) => l + [...n].map((d) => SUP[d]).join(''))

/** The ion a main-group element usually forms, when there is one clear answer. */
export function usualIon(e: Element): string | null {
  if (e.superheavy || e.symbol === 'H') return null
  if (e.category === 'Alkali metal') return `${e.symbol}⁺`
  if (e.category === 'Alkaline earth metal') return `${e.symbol}²⁺`
  if (e.symbol === 'Al') return 'Al³⁺'
  if (e.category === 'Halogen' && e.symbol !== 'At') return `${e.symbol}⁻`
  if (['O', 'S', 'Se'].includes(e.symbol)) return `${e.symbol}²⁻`
  if (['N', 'P'].includes(e.symbol)) return `${e.symbol}³⁻`
  return null
}

export interface Insight {
  icon: string
  text: string
}

/** Short, exam-useful facts about one element, built from its data and position. */
export function insights(e: Element): Insight[] {
  const out: Insight[] = []
  out.push({ icon: '⚛️', text: `A neutral ${e.name.toLowerCase()} atom has **${e.z} protons** and **${e.z} electrons**.` })
  if (!e.mass.startsWith('('))
    out.push({ icon: '⚖️', text: `Molar mass: **1 mol of ${e.symbol} atoms = ${e.mass} g**.` })
  else out.push({ icon: '☢️', text: `No stable isotopes. ${e.mass} is the mass number of a long-lived isotope.` })
  const v = valenceElectrons(e)
  if (v !== null && !e.superheavy) out.push({ icon: '🔘', text: `**${v} valence electron${v === 1 ? '' : 's'}** (group ${e.group}).` })
  const ion = usualIon(e)
  if (ion) out.push({ icon: '⚡', text: `Usually forms the ion **${ion}** to reach a noble-gas electron arrangement.` })
  if (DIATOMIC.has(e.symbol)) out.push({ icon: '👯', text: `Exists as a diatomic molecule, **${e.symbol}₂**, as an element.` })
  if (!e.superheavy && isConfigException(e))
    out.push({ icon: '⚠️', text: 'Its electron configuration is an **exception** to the usual filling order.' })
  if (e.electronegativity !== null) {
    const en = e.electronegativity
    const where = en >= 3 ? 'high: it pulls shared electrons strongly' : en >= 2 ? 'medium' : 'low: it attracts shared electrons weakly'
    out.push({ icon: '🧲', text: `Electronegativity **${en.toFixed(2)}** (${where}). Fluorine is the highest at 3.98.` })
  } else if (e.category === 'Noble gas' && !e.superheavy)
    out.push({ icon: '🧲', text: 'No electronegativity value is listed: it rarely forms bonds.' })
  if (e.superheavy) out.push({ icon: '🔬', text: 'Made a few atoms at a time in laboratories, so its properties are predictions.' })
  return out
}

export function findElement(symbolOrName: string): Element | undefined {
  const q = symbolOrName.trim().toLowerCase()
  if (!q) return undefined
  return ELEMENTS.find((e) => e.symbol.toLowerCase() === q) ?? ELEMENTS.find((e) => e.name.toLowerCase().startsWith(q)) ?? ELEMENTS.find((e) => String(e.z) === q)
}
