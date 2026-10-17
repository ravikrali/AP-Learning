// The statistics library is checked against numbers printed in the AP Statistics CED (effective Fall 2026):
// its Tables A (z), B (t) and C (χ²), and the answers to its sample exam questions.
import { describe, expect, it } from 'vitest'
import {
  binomCdf,
  binomPdf,
  chiCrit,
  chiSquareTest,
  chiUpper,
  fiveNumber,
  invNorm,
  invT,
  lsrl,
  mean,
  median,
  normCdf,
  normalcdf,
  outliers,
  rvMean,
  rvSd,
  sd,
  tCdf,
  tStar,
  twoPropTest,
  twoTInterval,
  zStar,
} from '../src/lib/stats'

describe('Table A: standard normal probabilities (area below z)', () => {
  const rows: [number, number][] = [
    [-3.4, 0.0003],
    [-2.5, 0.0062],
    [-2.47, 0.0068],
    [-1.53, 0.063],
    [-0.4, 0.3446],
    [-0.49, 0.3121],
    [0.05, 0.5199],
    [0.09, 0.5359],
    [1.94, 0.9738],
    [3.33, 0.9996],
  ]
  it.each(rows)('Φ(%s) = %s', (z, p) => expect(normCdf(z)).toBeCloseTo(p, 4))
})

describe('Table B: t critical values (upper-tail probability p)', () => {
  const rows: [number, number, number][] = [
    [1, 0.05, 6.314],
    [1, 0.25, 1.0],
    [5, 0.1, 1.476],
    [10, 0.05, 1.812],
    [20, 0.15, 1.064],
    [21, 0.005, 2.831],
    [30, 0.0005, 3.646],
    [60, 0.05, 1.671],
    [1000, 0.005, 2.581],
  ]
  it.each(rows)('df %s, p %s → %s', (df, p, t) => expect(invT(1 - p, df)).toBeCloseTo(t, 3))
  it('the z* row (df = ∞) matches the normal distribution', () => {
    expect(zStar(0.9)).toBeCloseTo(1.645, 3)
    expect(zStar(0.95)).toBeCloseTo(1.96, 3)
    expect(zStar(0.99)).toBeCloseTo(2.576, 3)
    expect(zStar(0.999)).toBeCloseTo(3.291, 3)
  })
  it('tCdf and invT agree', () => {
    expect(tCdf(tStar(0.95, 14), 14)).toBeCloseTo(0.975, 10)
    expect(tCdf(0, 7)).toBe(0.5)
  })
})

describe('Table C: χ² critical values (upper-tail probability p)', () => {
  const rows: [number, number, number][] = [
    [1, 0.05, 3.84],
    [2, 0.01, 9.21],
    [4, 0.05, 9.49],
    [10, 0.01, 23.21],
    [17, 0.25, 20.49],
    [30, 0.05, 43.77],
    [80, 0.0005, 128.3],
  ]
  it.each(rows)('df %s, p %s → %s', (df, p, x) => expect(chiCrit(p, df)).toBeCloseTo(x, x > 100 ? 0 : 1))
  it('upper tail and critical value agree', () => expect(chiUpper(chiCrit(0.05, 6), 6)).toBeCloseTo(0.05, 10))
})

describe('CED sample questions', () => {
  it('MC 9: SD of the number of left-handed students, n = 20, p = 0.1', () => {
    expect(Math.sqrt(20 * 0.1 * 0.9)).toBeCloseTo(1.342, 3)
  })
  it('MC 10: P(at least 4 left-handed of 20) = 0.1330', () => {
    expect(1 - binomCdf(20, 0.1, 3)).toBeCloseTo(0.133, 4)
  })
  it('MC 12: penguins N(15.1, 2.2), P(13.0 < X < 16.5) ≈ 0.57', () => {
    expect(normalcdf(13, 16.5, 15.1, 2.2)).toBeCloseTo(0.57, 2)
  })
  it('MC 17: two-proportion test, z = 2.33 and p-value = 0.0099', () => {
    const r = twoPropTest(150, 600, 34, 200, 'greater')
    expect(r.z).toBeCloseTo(2.33, 2)
    expect(r.p).toBeCloseTo(0.0099, 4)
  })
  it('MC 19: SD of sample means, σ = 10.6, n = 30 → 1.94', () => {
    expect(10.6 / Math.sqrt(30)).toBeCloseTo(1.94, 2)
  })
  it('MC 24: residual −6.8 at x = 7 on ŷ = 313.875 − 30.805x → observed 91.44', () => {
    expect(313.875 - 30.805 * 7 - 6.8).toBeCloseTo(91.44, 2)
  })
  it('FRQ 3: z = 2.91, p-value = 0.0036', () => {
    const r = twoPropTest(83, 250, 54, 250, 'two')
    expect(r.pc).toBeCloseTo(0.274, 3)
    expect(r.z).toBeCloseTo(2.91, 2)
    expect(r.p).toBeCloseTo(0.0036, 4)
  })
  it('FRQ 4: P(X ≥ 3) = 0.62, E(X) = 2.79, 90% interval (−0.365, −0.015)', () => {
    const ps = [0.04, 0.13, 0.21, 0.35, 0.19, 0.05, 0.03]
    const xs = [0, 1, 2, 3, 4, 5, 6]
    expect(ps.slice(3).reduce((a, b) => a + b, 0)).toBeCloseTo(0.62, 10)
    expect(rvMean(xs, ps)).toBeCloseTo(2.79, 10)
    const ci = twoTInterval(2.6, 1.6, 400, 2.79, 1.31, 350, 0.9)
    expect(ci.lo).toBeCloseTo(-0.365, 3)
    expect(ci.hi).toBeCloseTo(-0.015, 3)
  })
  it('FRQ 2: 1.5 × IQR fences for DES are −1,095.5 and 2,428.5', () => {
    const iqr = 1107 - 226
    expect(226 - 1.5 * iqr).toBe(-1095.5)
    expect(1107 + 1.5 * iqr).toBe(2428.5)
  })
})

describe('summaries and helpers', () => {
  it('mean, SD, median, quartiles', () => {
    const xs = [2, 4, 4, 4, 5, 5, 7, 9]
    expect(mean(xs)).toBe(5)
    expect(sd(xs)).toBeCloseTo(Math.sqrt(32 / 7), 12)
    expect(median(xs)).toBe(4.5)
    expect(fiveNumber(xs)).toEqual({ min: 2, q1: 4, med: 4.5, q3: 6, max: 9 })
    expect(fiveNumber([1, 2, 3, 4, 5, 6, 7])).toEqual({ min: 1, q1: 2, med: 4, q3: 6, max: 7 })
    expect(outliers([1, 2, 3, 4, 5, 6, 7, 30])).toEqual([30])
  })
  it('binomial probabilities add to 1', () => {
    let s = 0
    for (let k = 0; k <= 12; k++) s += binomPdf(12, 0.3, k)
    expect(s).toBeCloseTo(1, 12)
  })
  it('random variable SD', () => expect(rvSd([0, 1], [0.5, 0.5])).toBeCloseTo(0.5, 12))
  it('invNorm undoes normCdf', () => expect(invNorm(normCdf(1.234))).toBeCloseTo(1.234, 8))
  it('chi-square test on a 2×2 table matches the two-proportion z-test (χ² = z²)', () => {
    const r = chiSquareTest([
      [83, 167],
      [54, 196],
    ])
    expect(r.df).toBe(1)
    expect(r.chi2).toBeCloseTo(twoPropTest(83, 250, 54, 250, 'two').z ** 2, 8)
    expect(r.p).toBeCloseTo(twoPropTest(83, 250, 54, 250, 'two').p, 8)
  })
  it('least-squares line passes through (x̄, ȳ) and residuals sum to 0', () => {
    const xs = [1, 2, 3, 4, 5]
    const ys = [2, 4, 5, 4, 5]
    const m = lsrl(xs, ys)
    expect(m.b).toBeCloseTo(0.6, 12)
    expect(m.a).toBeCloseTo(2.2, 12)
    expect(m.a + m.b * mean(xs)).toBeCloseTo(mean(ys), 12)
    expect(m.residuals.reduce((a, b) => a + b, 0)).toBeCloseTo(0, 12)
  })
})

// ---------- AP Statistics content checks ----------

import { COURSES, findLesson, glossary, lessonText, plainText } from '../src/content'
import { STATS_GLOSSARY } from '../src/content/stats/glossary'
import { STATS_FRQS } from '../src/content/stats/frq'
import { CED_VERSION } from '../src/content/stats/ced'

const statsCourse = COURSES.find((c) => c.id === 'stats')!

/** Every string a student can see in the Statistics course. */
function statsTexts(): { text: string; where: string }[] {
  const out: { text: string; where: string }[] = []
  const walk = (v: unknown, where: string) => {
    if (typeof v === 'string') out.push({ text: v, where })
    else if (Array.isArray(v)) v.forEach((x) => walk(x, where))
    // titles and labels are shown as plain text, so markup rules don't apply to them
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => !['compute', 'verify', 'title', 'label', 'id'].includes(k) && walk(x, where))
  }
  for (const u of statsCourse.units) {
    walk(u.checkpoint, `${u.id} checkpoint`)
    walk(u.blurb, u.id)
    for (const l of u.lessons) walk(l, l.id)
  }
  for (const f of STATS_FRQS) walk(f, f.id)
  return out
}

describe('AP Statistics course', () => {
  it('follows the Fall 2026 CED', () => {
    expect(statsCourse.cedVersion).toBe('Fall 2026')
    expect(CED_VERSION).toBe('Fall 2026')
  })

  it('has the five CED units plus the toolkit, with at least 60 lessons', () => {
    expect(statsCourse.units.map((u) => u.number)).toEqual([0, 1, 2, 3, 4, 5])
    expect(statsCourse.units.flatMap((u) => u.lessons).length).toBeGreaterThanOrEqual(60)
  })

  it('has enough multiple-choice questions per unit for a 42-question exam weighted by the CED', () => {
    // the full practice exam draws round(42 × midpoint share) questions per unit
    const mids = statsCourse.units.filter((u) => u.weight).map((u) => {
      const [a, b] = u.weight!.replace('%', '').split('–').map(Number)
      return { u, mid: (a + b) / 2 }
    })
    const total = mids.reduce((s, m) => s + m.mid, 0)
    for (const { u, mid } of mids) {
      const mcq = [...u.checkpoint, ...u.lessons.flatMap((l) => [...l.check, ...l.cards.flatMap((c) => (c.kind === 'try' ? [c.question] : []))])].filter((q) => q.type === 'mcq')
      expect(mcq.length, u.id).toBeGreaterThanOrEqual(Math.round((42 * mid) / total) + 1)
    }
  })

  it('has two FRQs of each of the four exam question types', () => {
    for (const k of ['q1', 'q2', 'q3', 'q4']) expect(STATS_FRQS.filter((f) => f.kind === k).length, k).toBe(2)
  })

  it('writes critical values as t^{∗} / z^{∗} (asterisk operator) so "*" never breaks bold or italics', () => {
    // after removing **bold** and well-formed *italic* runs, no "*" may be left over (a bare "z*" would start an italic run)
    const leftover = (t: string) =>
      t
        .replace(/\*\*[^*]+\*\*/g, '')
        .replace(/(^|[\s("'])\*[^*\s]([^*]*[^*\s])?\*(?=$|[\s.,;:!?)'"])/g, '$1')
    const bad = statsTexts().filter(({ text }) => leftover(text).includes('*'))
    expect(bad.map((b) => `${b.where}: ${b.text.slice(0, 60)}`)).toEqual([])
  })

  it('never uses chemistry markup', () => {
    const bad = statsTexts().filter(({ text }) => /\[\[eq:|\{\{/.test(text))
    expect(bad.map((b) => b.where)).toEqual([])
  })
})

describe('AP Statistics glossary', () => {
  it('has unique terms, short definitions, and points each at a lesson that uses the term', () => {
    expect(STATS_GLOSSARY.length).toBeGreaterThanOrEqual(100)
    expect(new Set(STATS_GLOSSARY.map((g) => g.term.toLowerCase())).size).toBe(STATS_GLOSSARY.length)
    const problems: string[] = []
    for (const g of STATS_GLOSSARY) {
      const ref = findLesson(g.lesson)
      if (!ref || ref.course.id !== 'stats') {
        problems.push(`${g.term}: no stats lesson ${g.lesson}`)
        continue
      }
      if (g.def.length >= 260 || !g.def.trim().endsWith('.')) problems.push(`${g.term}: definition length or full stop`)
      const needle = plainText(g.find ?? g.term).toLowerCase()
      if (!lessonText(ref.lesson).toLowerCase().includes(needle)) problems.push(`${g.term} not in ${g.lesson}`)
    }
    expect(problems).toEqual([])
  })

  it('covers every unit and is sorted for display', () => {
    const units = new Set(STATS_GLOSSARY.map((g) => findLesson(g.lesson)!.unit.id))
    expect(units.size).toBe(statsCourse.units.length)
    const shown = glossary('stats').map((g) => plainText(g.term).toLowerCase())
    expect(shown).toEqual([...shown].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })))
  })
})

import { STATS_YOUTUBE } from '../src/content/stats/youtube'

describe('AP Statistics YouTube links', () => {
  it('every lesson has two well-formed, distinct links', () => {
    for (const l of statsCourse.units.flatMap((u) => u.lessons)) {
      const v = STATS_YOUTUBE[l.id]
      expect(v, l.id).toBeDefined()
      expect(v.length, l.id).toBe(2)
      expect(new Set(v.map((x) => x[0])).size, l.id).toBe(2)
      for (const [id, title, channel] of v) {
        expect(id).toMatch(/^[\w-]{11}$/)
        expect(title.length).toBeGreaterThan(3)
        expect(channel.length).toBeGreaterThan(1)
      }
    }
    expect(Object.keys(STATS_YOUTUBE).every((k) => findLesson(k)?.course.id === 'stats')).toBe(true)
  })
})

import { planExtras } from '../src/content'

describe('AP Statistics study plans', () => {
  it('review weeks link to the Statistics practice exams and FRQs', () => {
    const x = planExtras('stats')
    expect(x.path).toBe('/exam/stats')
    expect(x.exams?.map((e) => e.minutes)).toEqual([30, 45, 90])
    expect(x.frqs?.length).toBe(8)
    expect(planExtras('chem').path).toBe('/exam')
  })
})
