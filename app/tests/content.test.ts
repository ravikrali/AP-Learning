// Content verification: run with `npm test`. A build should never ship if any of these fail.
import { describe, expect, it } from 'vitest'
import { COURSES } from '../src/content'
import type { Card, Lesson, Question } from '../src/content/types'
import { CED_TOPICS } from '../src/content/chem/ced'
import { checkBalanced, parseFormula, stripSpecies } from '../src/lib/chem'

const chem = COURSES.find((c) => c.id === 'chem')!
const lessons: Lesson[] = COURSES.flatMap((c) => c.units.flatMap((u) => u.lessons))

function allQuestions(): { q: Question; where: string }[] {
  const out: { q: Question; where: string }[] = []
  for (const c of COURSES)
    for (const u of c.units) {
      for (const l of u.lessons) {
        l.check.forEach((q) => out.push({ q, where: l.id }))
        l.cards.forEach((card) => card.kind === 'try' && out.push({ q: card.question, where: l.id }))
      }
      u.checkpoint.forEach((q) => out.push({ q, where: `${u.id} checkpoint` }))
    }
  return out
}

/** every text field in a card/question/flashcard */
function texts(): { text: string; where: string }[] {
  const out: { text: string; where: string }[] = []
  const add = (text: string | undefined, where: string) => text && out.push({ text, where })
  const addQ = (q: Question, where: string) => {
    add(q.prompt, where)
    add(q.explain, where)
    add(q.hint, where)
    if (q.type === 'mcq') q.choices.forEach((c) => add(c, where))
  }
  const addCard = (c: Card, where: string) => {
    switch (c.kind) {
      case 'example':
        add(c.problem, where)
        c.steps.forEach((s) => add(s, where))
        add(c.answer, where)
        break
      case 'try':
        addQ(c.question, where)
        break
      case 'summary':
        c.points.forEach((p) => add(p, where))
        break
      default:
        add(c.body, where)
    }
  }
  for (const c of COURSES)
    for (const u of c.units) {
      add(u.blurb, u.id)
      u.checkpoint.forEach((q) => addQ(q, `${u.id} checkpoint`))
      for (const l of u.lessons) {
        l.cards.forEach((c) => addCard(c, l.id))
        l.check.forEach((q) => addQ(q, l.id))
        l.flashcards.forEach((f) => {
          add(f.front, l.id)
          add(f.back, l.id)
        })
      }
    }
  return out
}

describe('structure', () => {
  it('lesson ids are unique', () => {
    const ids = lessons.map((l) => l.id)
    expect(ids.length).toBe(new Set(ids).size)
  })

  it('question ids are unique', () => {
    const ids = allQuestions().map((x) => x.q.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dupes).toEqual([])
  })

  it('every lesson has content, quick-check questions and flashcards', () => {
    for (const l of lessons) {
      expect(l.cards.length, l.id).toBeGreaterThanOrEqual(3)
      expect(l.check.length, l.id).toBeGreaterThanOrEqual(2)
      expect(l.flashcards.length, l.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('lessons within a unit are ordered foundation → core → advanced', () => {
    const rank = { foundation: 0, core: 1, advanced: 2 }
    for (const c of COURSES)
      for (const u of c.units) {
        const r = u.lessons.map((l) => rank[l.level])
        expect(r, u.id).toEqual([...r].sort((a, b) => a - b))
      }
  })

  it('multiple-choice questions are well formed', () => {
    for (const { q, where } of allQuestions()) {
      if (q.type !== 'mcq') continue
      expect(q.choices.length, `${where} ${q.id}`).toBeGreaterThanOrEqual(2)
      expect(q.answer, `${where} ${q.id}`).toBeGreaterThanOrEqual(0)
      expect(q.answer, `${where} ${q.id}`).toBeLessThan(q.choices.length)
      expect(new Set(q.choices).size, `${where} ${q.id} duplicate choices`).toBe(q.choices.length)
      expect(q.explain.length, `${where} ${q.id}`).toBeGreaterThan(10)
    }
  })
})

describe('numbers are re-computed independently', () => {
  it('numeric questions match their computation', () => {
    for (const { q, where } of allQuestions()) {
      if (q.type !== 'num') continue
      expect(q.compute, `${where} ${q.id} needs a compute() check`).toBeTypeOf('function')
      const truth = q.compute!()
      const err = Math.abs(q.answer - truth) / Math.max(Math.abs(truth), 1e-30)
      expect(err, `${where} ${q.id}: stated ${q.answer}, computed ${truth}`).toBeLessThan(0.005)
      // the accepted range must not be wider than the stated answer's precision warrants
      expect(q.tolerance ?? 0.02, `${where} ${q.id}`).toBeLessThanOrEqual(0.05)
    }
  })

  it('worked-example numbers match their computation', () => {
    for (const l of lessons)
      for (const c of l.cards) {
        if (c.kind !== 'example' || !c.verify) continue
        for (const v of c.verify) {
          const truth = v.compute()
          const err = Math.abs(v.stated - truth) / Math.max(Math.abs(truth), 1e-30)
          expect(err, `${l.id} "${c.title}": stated ${v.stated}, computed ${truth}`).toBeLessThan(v.tol ?? 0.005)
        }
      }
  })
})

describe('chemistry notation', () => {
  it('every [[eq: ...]] equation is balanced in atoms and charge', () => {
    const problems: string[] = []
    for (const { text, where } of texts())
      for (const m of text.matchAll(/\[\[eq:([^\]]+)\]\]/g)) {
        const eq = m[1].trim()
        try {
          const r = checkBalanced(eq)
          if (!r.ok) problems.push(`${where}: ${eq} → ${JSON.stringify(r.atoms)} charge ${JSON.stringify(r.charge)}`)
        } catch (e) {
          problems.push(`${where}: ${eq} → ${(e as Error).message}`)
        }
      }
    expect(problems).toEqual([])
  })

  it('every {{formula}} parses', () => {
    const problems: string[] = []
    for (const { text, where } of texts())
      for (const m of text.matchAll(/\{\{([^}]+)\}\}/g)) {
        const f = m[1].trim()
        if (/\s|->|<=>/.test(f)) continue // equations/phrases are formatted only
        try {
          const sp = stripSpecies(f)
          if (sp.formula !== 'e') parseFormula(sp.formula)
        } catch (e) {
          problems.push(`${where}: {{${f}}} → ${(e as Error).message}`)
        }
      }
    expect(problems).toEqual([])
  })
})

describe('College Board coverage', () => {
  it('only real CED topic numbers are referenced', () => {
    for (const l of chem.units.flatMap((u) => u.lessons)) for (const t of l.ced) expect(CED_TOPICS[t], `${l.id} → ${t}`).toBeDefined()
  })

  it('every CED topic in each included unit is taught', () => {
    const covered = new Set(chem.units.flatMap((u) => u.lessons.flatMap((l) => l.ced)))
    const included = new Set(chem.units.map((u) => u.number))
    const missing = Object.keys(CED_TOPICS).filter((t) => included.has(Number(t.split('.')[0])) && !covered.has(t))
    expect(missing).toEqual([])
  })
})

import { CHEM_FRQS } from '../src/content/chem/frq'

describe('free-response practice', () => {
  it('long FRQs are worth 10 points and short ones 4, like the real exam', () => {
    for (const f of CHEM_FRQS) {
      const pts = f.parts.reduce((n, p) => n + p.rubric.length, 0)
      expect(pts, f.id).toBe(f.kind === 'long' ? 10 : 4)
    }
  })
  it('FRQ numbers match their computation and equations balance', () => {
    const problems: string[] = []
    for (const f of CHEM_FRQS) {
      for (const p of f.parts) {
        for (const v of p.verify ?? []) {
          const truth = v.compute()
          const err = Math.abs(v.stated - truth) / Math.max(Math.abs(truth), 1e-30)
          if (err >= (v.tol ?? 0.005)) problems.push(`${f.id} ${p.label}: stated ${v.stated}, computed ${truth}`)
        }
        for (const t of [f.intro, p.prompt, p.answer])
          for (const m of t.matchAll(/\[\[eq:([^\]]+)\]\]/g)) if (!checkBalanced(m[1].trim()).ok) problems.push(`${f.id}: ${m[1]}`)
      }
    }
    expect(problems).toEqual([])
  })
})

import { hasDiagram } from '../src/content/diagrams'

describe('diagrams', () => {
  it('every referenced diagram exists', () => {
    const missing = lessons.flatMap((l) => l.cards.flatMap((c) => (c.kind === 'concept' && c.diagram && !hasDiagram(c.diagram) ? [`${l.id}: ${c.diagram}`] : [])))
    expect(missing).toEqual([])
  })
})
