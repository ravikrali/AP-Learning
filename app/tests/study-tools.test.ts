// Checks for the study tools: periodic table, glossary, search, bookmarks, and how welcome-page
// visits are sorted into channels.

import { describe, expect, it } from 'vitest'
import initSqlJs from 'sql.js'
import { COURSES, findLesson, glossary, lessonText, plainText } from '../src/content'
import { CHEM_GLOSSARY } from '../src/content/chem/glossary'
import { ELEMENTS, aufbau, electronCount, findElement, insights, isConfigException, outerSubshells, usualIon, valenceElectrons } from '../src/content/elements'
import { ATOMIC_MASS } from '../src/lib/chem'
import { searchGlossary, searchLessons } from '../src/lib/search'
import { __testing } from '../src/lib/db'
import { KEY_PATTERN, mergeItem } from '../shared/sync'
import { channelOf, hostOf, VID_PATTERN } from '../shared/visit'
import { readTouch } from '../src/lib/visit'
import { tipsFor } from '../src/lib/tips'

const el = (s: string) => ELEMENTS.find((e) => e.symbol === s)!

describe('periodic table', () => {
  it('has all 118 elements in order with unique symbols and names', () => {
    expect(ELEMENTS).toHaveLength(118)
    ELEMENTS.forEach((e, i) => expect(e.z).toBe(i + 1))
    expect(new Set(ELEMENTS.map((e) => e.symbol)).size).toBe(118)
    expect(new Set(ELEMENTS.map((e) => e.name)).size).toBe(118)
  })

  it('gives every electron configuration exactly Z electrons', () => {
    for (const e of ELEMENTS) expect(electronCount(e.config), e.symbol).toBe(e.z)
  })

  it('shows the same atomic masses the lessons use', () => {
    for (const [sym, mass] of Object.entries(ATOMIC_MASS)) expect(Number(el(sym).mass), sym).toBeCloseTo(mass, 6)
  })

  it('increases atomic mass with atomic number except for the known reversals', () => {
    const reversed: string[] = []
    for (let i = 1; i < 92; i++) {
      const a = Number(ELEMENTS[i - 1].mass.replace(/[()]/g, ''))
      const b = Number(ELEMENTS[i].mass.replace(/[()]/g, ''))
      if (b < a) reversed.push(`${ELEMENTS[i - 1].symbol}>${ELEMENTS[i].symbol}`)
    }
    expect(reversed).toEqual(['Ar>K', 'Co>Ni', 'Te>I', 'Th>Pa'])
  })

  it('puts every element in its own cell, in the right group and period', () => {
    expect(new Set(ELEMENTS.map((e) => `${e.row},${e.col}`)).size).toBe(118)
    const at = (s: string) => [el(s).period, el(s).group]
    expect(at('H')).toEqual([1, 1])
    expect(at('He')).toEqual([1, 18])
    expect(at('C')).toEqual([2, 14])
    expect(at('Al')).toEqual([3, 13])
    expect(at('Fe')).toEqual([4, 8])
    expect(at('Br')).toEqual([4, 17])
    expect(at('Ag')).toEqual([5, 11])
    expect(at('La')).toEqual([6, 3])
    expect(at('Hf')).toEqual([6, 4])
    expect(at('Au')).toEqual([6, 11])
    expect(at('Rn')).toEqual([6, 18])
    expect(at('Og')).toEqual([7, 18])
    expect(el('Ce').group).toBeUndefined()
    expect(el('Lu').row).toBe(9)
    expect(el('Lr').row).toBe(10)
    // every family sits in its group
    for (const e of ELEMENTS) {
      if (e.category === 'Alkali metal') expect(e.group, e.symbol).toBe(1)
      if (e.category === 'Alkaline earth metal') expect(e.group, e.symbol).toBe(2)
      if (e.category === 'Halogen') expect(e.group, e.symbol).toBe(17)
      if (e.category === 'Noble gas') expect(e.group, e.symbol).toBe(18)
    }
  })

  it('derives valence electrons from the configuration for main-group elements', () => {
    for (const e of ELEMENTS) {
      const v = valenceElectrons(e)
      if (v === null) continue
      // electrons in the highest shell's s and p subshells
      const outer = outerSubshells(e.config)
      const n = Math.max(...Object.keys(outer).map((k) => Number(k[0])))
      const counted = (outer[`${n}s`] ?? 0) + (outer[`${n}p`] ?? 0)
      expect(counted, e.symbol).toBe(v)
    }
  })

  it('flags the configuration exceptions students must know, and not the regular ones', () => {
    expect(isConfigException(el('Cr'))).toBe(true)
    expect(isConfigException(el('Cu'))).toBe(true)
    for (const s of ['H', 'C', 'Na', 'Fe', 'Zn', 'Br', 'Kr', 'Sr', 'I', 'Ba', 'Pb']) expect(isConfigException(el(s)), s).toBe(false)
    expect(aufbau(26)).toEqual({ '4s': 2, '3d': 6 })
  })

  it('gives the usual ions and sensible insights', () => {
    expect(usualIon(el('Na'))).toBe('Na⁺')
    expect(usualIon(el('Ca'))).toBe('Ca²⁺')
    expect(usualIon(el('Al'))).toBe('Al³⁺')
    expect(usualIon(el('Cl'))).toBe('Cl⁻')
    expect(usualIon(el('O'))).toBe('O²⁻')
    expect(usualIon(el('N'))).toBe('N³⁻')
    expect(usualIon(el('Fe'))).toBeNull()
    expect(usualIon(el('C'))).toBeNull()
    for (const e of ELEMENTS) {
      const list = insights(e)
      expect(list.length, e.symbol).toBeGreaterThanOrEqual(2)
      expect(list[0].text).toContain(`${e.z} protons`)
    }
    expect(insights(el('O')).some((i) => i.text.includes('O₂'))).toBe(true)
    expect(insights(el('F')).some((i) => i.text.includes('3.98'))).toBe(true)
    // electronegativity is highest for fluorine
    expect(Math.max(...ELEMENTS.map((e) => e.electronegativity ?? 0))).toBe(el('F').electronegativity)
    // only bromine and mercury are liquids; the gases are the 11 students learn
    expect(ELEMENTS.filter((e) => e.state === 'liquid').map((e) => e.symbol)).toEqual(['Br', 'Hg'])
    expect(ELEMENTS.filter((e) => e.state === 'gas' && !e.superheavy).map((e) => e.symbol)).toEqual(['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn'])
  })

  it('finds elements by symbol, name or number', () => {
    expect(findElement('fe')?.name).toBe('Iron')
    expect(findElement('sod')?.symbol).toBe('Na')
    expect(findElement('79')?.symbol).toBe('Au')
    expect(findElement('')).toBeUndefined()
  })
})

describe('glossary', () => {
  it('has unique terms, short definitions, and points each at a lesson that uses the term', () => {
    expect(CHEM_GLOSSARY.length).toBeGreaterThanOrEqual(100)
    expect(new Set(CHEM_GLOSSARY.map((g) => g.term.toLowerCase())).size).toBe(CHEM_GLOSSARY.length)
    for (const g of CHEM_GLOSSARY) {
      const ref = findLesson(g.lesson)
      expect(ref, `${g.term}: lesson ${g.lesson}`).toBeTruthy()
      expect(g.def.length, g.term).toBeLessThan(260)
      expect(g.def.trim().endsWith('.'), g.term).toBe(true)
      const needle = plainText(g.find ?? g.term).toLowerCase()
      expect(lessonText(ref!.lesson).toLowerCase(), `${g.term} in ${g.lesson}`).toContain(needle)
    }
  })

  it('covers every unit and is sorted for display', () => {
    const units = new Set(CHEM_GLOSSARY.map((g) => findLesson(g.lesson)!.unit.id))
    expect(units.size).toBe(COURSES[0].units.length)
    const shown = glossary('chem').map((g) => plainText(g.term).toLowerCase())
    expect(shown).toEqual([...shown].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })))
    expect(glossary('nope')).toEqual([])
  })
})

describe('search', () => {
  const course = COURSES[0]
  const refs = course.units.flatMap((unit) => unit.lessons.map((lesson, index) => ({ course, unit, lesson, index })))

  it('finds a topic by its title first', () => {
    const hits = searchLessons(refs, 'limiting reactant')
    expect(hits[0].lessonId).toBe('chem-4.5b')
    expect(hits[0].card).toBeNull()
  })

  it('finds text inside cards and points at the card', () => {
    const hits = searchLessons(refs, 'sea of electrons')
    expect(hits.length).toBeGreaterThan(0)
    const h = hits[0]
    expect(h.card).not.toBeNull()
    const card = findLesson(h.lessonId)!.lesson.cards[h.card!]
    expect(JSON.stringify(card).toLowerCase()).toContain('sea of')
    expect(h.snippet.toLowerCase()).toContain('sea')
  })

  it('needs every word, ignores case, and can be limited to one unit', () => {
    expect(searchLessons(refs, 'zzzz qqqq')).toEqual([])
    expect(searchLessons(refs, 'a')).toEqual([])
    expect(searchLessons(refs, 'HESS').length).toBeGreaterThan(0)
    const unit1 = refs.filter((r) => r.unit.id === 'chem-u1')
    expect(searchLessons(unit1, 'buffer')).toEqual([])
    expect(searchLessons(refs, 'buffer').length).toBeGreaterThan(0)
    for (const h of searchLessons(unit1, 'electron')) expect(findLesson(h.lessonId)!.unit.id).toBe('chem-u1')
  })

  it('finds glossary terms', () => {
    expect(searchGlossary('chem', 'molar').map((g) => g.term)).toEqual(expect.arrayContaining(['Molar mass', 'Molarity']))
    expect(searchGlossary('chem', 'x')).toEqual([])
  })
})

describe('unit tips', () => {
  it('every unit has smart tricks to show behind the bulb', () => {
    for (const u of COURSES[0].units) {
      const n = u.lessons.reduce((s, l) => s + tipsFor(l).tricks.length + tipsFor(l).traps.length, 0)
      expect(n, u.title).toBeGreaterThanOrEqual(4)
    }
  })
})

describe('bookmarks', () => {
  it('sync as "mark:<lesson>" items, the newest change winning', () => {
    expect(KEY_PATTERN.test('mark:chem-1.1')).toBe(true)
    const on = { key: 'mark:chem-1.1', data: { saved: 1, updated_at: '2026-10-10T10:00:00Z' }, updated_at: '2026-10-10T10:00:00Z' }
    const off = { key: 'mark:chem-1.1', data: { saved: 0, updated_at: '2026-10-10T11:00:00Z' }, updated_at: '2026-10-10T11:00:00Z' }
    expect(mergeItem(on, off)).toBe(off)
    expect(mergeItem(off, on)).toBeNull()
  })

  it('queue for upload when added and when removed, and are restored from a backup', async () => {
    const SQL = await initSqlJs()
    const db = new SQL.Database()
    __testing.prepareSchema(db)
    const outbox = () => db.exec("SELECT key, data FROM sync_outbox WHERE key LIKE 'mark:%'")[0]?.values ?? []
    db.run("INSERT INTO bookmarks(lesson_id, saved, updated_at) VALUES ('chem-1.1', 1, '2026-10-10T10:00:00Z')")
    expect(outbox()).toHaveLength(1)
    expect(JSON.parse(String(outbox()[0][1])).saved).toBe(1)
    db.run("UPDATE bookmarks SET saved = 0, updated_at = '2026-10-10T11:00:00Z' WHERE lesson_id = 'chem-1.1'")
    expect(JSON.parse(String(outbox()[0][1])).saved).toBe(0)
    db.run('DELETE FROM sync_outbox')
    db.exec(__testing.enqueueAllSql())
    expect(outbox()).toHaveLength(1)
  })
})

describe('welcome-page visits', () => {
  it('sorts visits into channels', () => {
    expect(channelOf({})).toBe('Direct')
    expect(channelOf({ referrer: 'google.com' })).toBe('Search')
    expect(channelOf({ referrer: 'duckduckgo.com' })).toBe('Search')
    expect(channelOf({ referrer: 'l.instagram.com' })).toBe('Social')
    expect(channelOf({ referrer: 't.co' })).toBe('Social')
    expect(channelOf({ referrer: 'reddit.com' })).toBe('Social')
    expect(channelOf({ referrer: 'mail.google.com' })).toBe('Email')
    expect(channelOf({ referrer: 'someschool.org' })).toBe('Referral')
    expect(channelOf({ referrer: 'robot.com' })).toBe('Referral')
    expect(channelOf({ source: 'instagram', referrer: 'google.com' })).toBe('Social')
    expect(channelOf({ source: 'google', medium: 'cpc' })).toBe('Paid')
    expect(channelOf({ source: 'newsletter' })).toBe('Email')
    expect(channelOf({ source: 'flyer', medium: 'qr' })).toBe('Campaign')
  })

  it('keeps only the host of a referrer and reads campaign tags', () => {
    expect(hostOf('https://www.Google.com/search?q=secret+words')).toBe('google.com')
    expect(hostOf('')).toBe('')
    expect(hostOf('not a url at all')).toBe('')
    const t = readTouch('?utm_source=tiktok&utm_medium=social&utm_campaign=fall', 'https://www.tiktok.com/@someone/video/1', 'www.aplearning.app')
    expect(t).toEqual({ source: 'tiktok', medium: 'social', campaign: 'fall', referrer: 'tiktok.com' })
    // our own pages and the Google sign-in round trip are not referrers
    expect(readTouch('', 'https://www.aplearning.app/', 'www.aplearning.app').referrer).toBeUndefined()
    expect(readTouch('', 'https://accounts.google.com/', 'www.aplearning.app').referrer).toBeUndefined()
    expect(readTouch('?ref=teacher', '', 'www.aplearning.app').source).toBe('teacher')
  })

  it('accepts only well-formed visitor IDs', () => {
    expect(VID_PATTERN.test('a'.repeat(30))).toBe(true)
    expect(VID_PATTERN.test('short')).toBe(false)
    expect(VID_PATTERN.test("x'; DROP TABLE visitors;--aaaaaaaa")).toBe(false)
  })
})
