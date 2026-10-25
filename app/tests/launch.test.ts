import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { ageFrom, MIN_AGE, oldEnough, validBirth } from '../shared/age'
import { churnByMonth, conversion, costPerSignup, nextMonth } from '../shared/business'
import { ADMIN_URL, APP_URL, BRAND, BRAND_SLUG, movedUrl, OLD_DOMAINS, TRADEMARK_NOTICE } from '../shared/brand'
import { CATALOG } from '../shared/catalog'
import { CARD_REF_PATTERN, countable } from '../shared/visit'
import { COURSES } from '../src/content'
import { CED_VERSION } from '../src/content/chem/ced'

describe('CED version tags', () => {
  test('AP Chemistry follows the edition its topic list was copied from', () => {
    expect(COURSES.find((c) => c.id === 'chem')!.cedVersion).toBe(CED_VERSION)
  })

  test("every lesson's tag matches its course's CED edition", () => {
    // When College Board publishes a new CED, bump the course's edition: this test then lists
    // every lesson that still has to be re-checked (and re-tagged by hand) before release.
    const stale: string[] = []
    for (const course of COURSES)
      for (const unit of course.units)
        for (const l of unit.lessons) if (l.cedVersion !== course.cedVersion) stale.push(`${l.id}: tagged "${l.cedVersion}", course is "${course.cedVersion}"`)
    expect(stale).toEqual([])
  })

  test('the check really fails for a lesson left on an older edition', () => {
    const course = COURSES[0]
    const lessons = course.units.flatMap((u) => u.lessons).map((l, i) => (i === 3 ? { ...l, cedVersion: 'Fall 2019' } : l))
    expect(lessons.filter((l) => l.cedVersion !== course.cedVersion).map((l) => l.id)).toEqual([lessons[3].id])
  })
})

describe('age question', () => {
  const now = new Date('2026-10-11T12:00:00Z')

  test('age is counted carefully: the birthday month counts as not reached yet', () => {
    expect(ageFrom(2013, 9, now)).toBe(13) // birthday was last month
    expect(ageFrom(2013, 10, now)).toBe(12) // birthday is some day this month
    expect(ageFrom(2013, 11, now)).toBe(12)
    expect(ageFrom(2010, 1, now)).toBe(16)
  })

  test('under-13s are turned away, 13 and over are let in', () => {
    expect(MIN_AGE).toBe(13)
    expect(oldEnough(2013, 9, now)).toBe(true)
    expect(oldEnough(2013, 10, now)).toBe(false)
    expect(oldEnough(2015, 3, now)).toBe(false)
    expect(oldEnough(1980, 6, now)).toBe(true)
  })

  test('nonsense birth dates are rejected', () => {
    expect(validBirth(2010, 5, now)).toBe(true)
    expect(validBirth(2026, 10, now)).toBe(true)
    expect(validBirth(2026, 11, now)).toBe(false) // next month
    expect(validBirth(2027, 1, now)).toBe(false)
    expect(validBirth(1900, 1, now)).toBe(false)
    expect(validBirth(2010, 13, now)).toBe(false)
    expect(validBirth(2010.5, 1, now)).toBe(false)
    expect(validBirth('2010', 1, now)).toBe(false)
    expect(validBirth(NaN, NaN, now)).toBe(false)
  })
})

describe('visit counting by country', () => {
  test('EU, EEA and UK visitors are not counted', () => {
    for (const c of ['DE', 'FR', 'IE', 'ES', 'PL', 'SE', 'NO', 'IS', 'LI', 'GB', 'gb']) expect(countable(c), c).toBe(false)
  })
  test('everyone else is, including an unknown country', () => {
    for (const c of ['US', 'CA', 'IN', 'AU', 'CH', 'T1', '', null, undefined]) expect(countable(c), String(c)).toBe(true)
  })
})

describe('error report tags', () => {
  test('a report names a card, a quick-check question or the video', () => {
    for (const ok of ['card:0', 'card:12', 'check:3', 'video']) expect(CARD_REF_PATTERN.test(ok), ok).toBe(true)
    for (const bad of ['', 'card', 'card:', 'card:-1', 'card:1234', 'finish', 'check:1; DROP']) expect(CARD_REF_PATTERN.test(bad), bad).toBe(false)
  })
})

describe('business numbers', () => {
  test('next month rolls over the year', () => {
    expect(nextMonth('2027-05')).toBe('2027-06')
    expect(nextMonth('2026-12')).toBe('2027-01')
  })

  test('churn = paid last month, did not pay this month', () => {
    const payers = [
      { month: '2027-04', n: 100 },
      { month: '2027-05', n: 110 },
      { month: '2027-06', n: 60 },
      { month: '2027-07', n: 55 },
    ]
    const retained = [
      { month: '2027-04', n: 95 }, // 95 of April's 100 paid again in May
      { month: '2027-05', n: 55 }, // the post-exam drop: only 55 of May's 110 paid in June
      { month: '2027-06', n: 20 }, // July is the month in progress
    ]
    const rows = churnByMonth(payers, retained, '2027-07')
    expect(rows.map((r) => r.month)).toEqual(['2027-05', '2027-06', '2027-07'])
    expect(rows[0]).toMatchObject({ start: 100, lost: 5, rate: 0.05, partial: false })
    expect(rows[1]).toMatchObject({ start: 110, lost: 55, rate: 0.5, partial: false })
    expect(rows[2]).toMatchObject({ start: 60, lost: 40, partial: true })
  })

  test('a month nobody carried over from counts as all lost; no data means no rows', () => {
    expect(churnByMonth([{ month: '2027-01', n: 4 }], [], '2027-03')).toEqual([{ month: '2027-02', start: 4, lost: 4, rate: 1, partial: false }])
    expect(churnByMonth([], [], '2027-03')).toEqual([])
    // the month in progress has no following month yet
    expect(churnByMonth([{ month: '2027-03', n: 9 }], [], '2027-03')).toEqual([])
  })

  test('conversion and cost per sign-up never divide by zero', () => {
    expect(conversion(200, 10)).toBe(0.05)
    expect(conversion(0, 0)).toBeNull()
    expect(costPerSignup(5000, 25)).toBe(200) // $50.00 over 25 sign-ups = $2.00 each
    expect(costPerSignup(5000, 0)).toBeNull()
  })
})

describe('moving from the old address', () => {
  const at = (u: string) => movedUrl(new URL(u))
  test('every old page goes to the same place on the new domain', () => {
    expect(OLD_DOMAINS).toContain('aplearning.app')
    expect(BRAND.domain).toBe('eziq.app')
    expect(at('https://www.aplearning.app/')).toBe('https://www.eziq.app/')
    expect(at('https://aplearning.app/?code=FALL20')).toBe('https://www.eziq.app/?code=FALL20')
    expect(at('https://admin.aplearning.app/admin')).toBe('https://admin.eziq.app/admin')
    expect(at('http://www.aplearning.app/index.html?utm_source=tiktok')).toBe('https://www.eziq.app/index.html?utm_source=tiktok')
  })
  test('the API stays where it is, and the new domain is left alone', () => {
    expect(at('https://www.aplearning.app/api/billing/webhook')).toBeNull()
    expect(at('https://www.aplearning.app/api/cal/abcdefghijklmnop.ics')).toBeNull()
    expect(at('https://www.eziq.app/')).toBeNull()
    expect(at('https://notaplearning.app/')).toBeNull()
    expect(at('http://localhost:8787/')).toBeNull()
  })
})

describe('brand in one place', () => {
  test('addresses and file names come from the name and domain', () => {
    expect(APP_URL).toBe(`https://www.${BRAND.domain}`)
    expect(ADMIN_URL).toBe(`https://admin.${BRAND.domain}`)
    expect(BRAND_SLUG).toMatch(/^[a-z0-9-]+$/)
    expect(TRADEMARK_NOTICE).toContain(BRAND.name)
  })

  // Every file that makes up the app's own screens and backend (lesson content is checked elsewhere).
  const files = ['src', 'src/pages', 'src/components', 'src/lib', 'src/admin', 'shared', 'worker']
    .flatMap((dir) => readdirSync(join(__dirname, '..', dir), { withFileTypes: true }).filter((f) => f.isFile() && /\.(ts|tsx)$/.test(f.name)).map((f) => join(dir, f.name)))
    .concat(['index.html', 'admin.html', 'vite.config.ts'])
  const read = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8')

  test('the name and address are not typed anywhere else', () => {
    const offenders = files
      .filter((f) => f.replace(/\\/g, '/') !== 'shared/brand.ts')
      .flatMap((f) =>
        read(f)
          .split('\n')
          // comments may mention the product; saved-data keys keep their old prefix on purpose
          .filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line))
          .filter((line) => line.includes(BRAND.name) || new RegExp(`\\b${BRAND.domain.replace('.', '\\.')}`).test(line.replace(/\/\/.*$/, '')))
          .map((line) => `${f}: ${line.trim().slice(0, 100)}`),
      )
    expect(offenders).toEqual([])
  })

  describe('copy rules', () => {
    const screens = files.filter((f) => /\.tsx$/.test(f) || /shared[\\/](catalog|plan)\.ts$/.test(f))
    const code = (f: string) =>
      read(f)
        .split('\n')
        .filter((line) => !/^\s*(\/\/|\*|\/\*|import )/.test(line))
        .join('\n')

    test('AP always carries its ® in screen text', () => {
      const bare = screens.flatMap((f) =>
        [...code(f).matchAll(/[^\n]*\bAP [^\n]*/g)].map((m) => `${f}: ${m[0].trim().slice(0, 100)}`),
      )
      expect(bare).toEqual([])
    })

    test('course names do not carry the AP® mark; only the official exam name does', () => {
      const named = [...CATALOG, ...COURSES].filter((c) => /\bAP|APUSH|APES/.test(`${c.title} ${c.short}`)).map((c) => c.id)
      expect(named).toEqual([])
      for (const c of CATALOG) expect(c.ap, c.id).toMatch(/^AP® /)
      expect(BRAND.name).not.toMatch(/\bAP\b/)
    })

    test('nothing promises a score or a result', () => {
      const promise = /guarantee|get a 5\b|score a 5\b|earn a 5\b|raise your score|boost your score|improve your score|higher score|pass the (ap|exam)|\bace (the|your)|become an expert|AP expert/i
      const found = screens.flatMap((f) => [...code(f).matchAll(new RegExp(`[^\\n]*(${promise.source})[^\\n]*`, 'gi'))].map((m) => `${f}: ${m[0].trim().slice(0, 100)}`))
      expect(found).toEqual([])
    })

    test('the College Board notice says "not affiliated" and "does not endorse", and is on the pages that need it', () => {
      expect(TRADEMARK_NOTICE).toMatch(/AP® is a trademark registered by the College Board/)
      expect(TRADEMARK_NOTICE).toMatch(/not affiliated with/)
      expect(TRADEMARK_NOTICE).toMatch(/does not endorse/)
      for (const f of ['src/pages/Login.tsx', 'src/pages/Support.tsx', 'src/pages/Me.tsx', 'src/pages/Plans.tsx', 'src/pages/Learn.tsx', 'src/pages/Errata.tsx', 'src/admin/AdminApp.tsx', 'index.html', 'vite.config.ts'])
        expect(/Trademark|TRADEMARK_NOTICE/.test(read(f)), f).toBe(true)
      // and nobody writes their own shorter version of it
      const own = files.filter((f) => f.replace(/\\/g, '/') !== 'shared/brand.ts' && /is a trademark/.test(read(f)))
      expect(own).toEqual([])
    })
  })
})
