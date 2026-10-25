import { describe, expect, test } from 'vitest'
import { CATALOG } from '../shared/catalog'
import {
  biggerPlan, canOpen, checkPickChange, codeProblem, DEFAULT_PRICING, describeDiscount, discounted, pickLimit, planRank, promoCourses,
  trimPicks, validateCode, validatePlan, validatePromo, type DiscountCode, type Pricing,
} from '../shared/pricing'
import { addMinutes, planToIcs } from '../shared/plan'
import { KEY_PATTERN, maxItemSize } from '../shared/sync'
import { COURSES, planExtras, questionTopic } from '../src/content'
import { CHEM_YOUTUBE } from '../src/content/chem/youtube'
import { buildPlan, learningItems, minutesNeeded, planStatus, type PlanAnswers } from '../src/lib/schedule'
import { forecast, fillMonths } from '../src/admin/forecast'
import { couponId, formEncode, planFromLookupKey, lookupKey, readSubscription, signPayload, verifyStripeSignature } from '../worker/stripe'

const P = DEFAULT_PRICING

const chem = COURSES[0]

describe('catalog & plans', () => {
  test('21 courses, unique ids, 2027 exam dates in May', () => {
    expect(CATALOG).toHaveLength(21)
    expect(new Set(CATALOG.map((c) => c.id)).size).toBe(21)
    for (const c of CATALOG) expect(c.exam.date).toMatch(/^2027-05-(0[3-7]|1[0-4])$/)
    expect(CATALOG.find((c) => c.id === 'chem')!.exam).toEqual({ date: '2027-05-06', time: '12:00' })
  })

  test('pick limits and opening', () => {
    expect(pickLimit(P, 'free')).toBe(2)
    expect(pickLimit(P, 'three')).toBe(3)
    expect(canOpen(P, { plan: 'free', courses: ['chem'] }, 'chem')).toBe(true)
    expect(canOpen(P, { plan: 'free', courses: ['chem'] }, 'bio')).toBe(false)
    expect(canOpen(P, { plan: 'all', courses: [] }, 'bio')).toBe(true)
    expect(trimPicks(P, 'free', ['chem', 'bio', 'stats'])).toEqual(['chem', 'bio'])
    // an unknown or retired-and-gone plan id counts as free
    expect(pickLimit(P, 'nope')).toBe(2)
  })

  test('changing picked courses', () => {
    const now = new Date('2026-10-09T00:00:00Z')
    expect(checkPickChange(P, 'free', [], ['chem'], null, now)).toBeNull()
    expect(checkPickChange(P, 'free', ['chem'], ['chem', 'stats'], null, now)).toBeNull()
    expect(checkPickChange(P, 'free', ['chem', 'stats'], ['chem', 'stats', 'bio'], null, now)).toMatch(/Upgrade/)
    expect(checkPickChange(P, 'three', ['chem'], ['chem', 'bio', 'stats'], null, now)).toBeNull()
    expect(checkPickChange(P, 'three', ['chem'], ['nope'], null, now)).toBe('Unknown course')
    expect(checkPickChange(P, 'free', ['chem'], ['chem', 'chem'], null, now)).toMatch(/twice/)
    // first swap is fine; a second within 30 days is not; after 30 days it is
    expect(checkPickChange(P, 'free', ['chem'], ['bio'], null, now)).toBeNull()
    expect(checkPickChange(P, 'free', ['bio'], ['chem'], '2026-10-01T00:00:00Z', now)).toMatch(/2026-10-31/)
    expect(checkPickChange(P, 'free', ['bio'], ['chem'], '2026-09-01T00:00:00Z', now)).toBeNull()
    // adding never counts as a swap
    expect(checkPickChange(P, 'three', ['bio'], ['bio', 'chem'], '2026-10-08T00:00:00Z', now)).toBeNull()
  })

  test('sync keys for plans and analytics', () => {
    expect(KEY_PATTERN.test('plan:chem')).toBe(true)
    expect(KEY_PATTERN.test('t:time:ab12cd34ef')).toBe(true)
    expect(KEY_PATTERN.test('t:ev:ab12cd34ef')).toBe(true)
    expect(KEY_PATTERN.test('t:other:x')).toBe(false)
    expect(maxItemSize('plan:chem')).toBeGreaterThan(maxItemSize('note:x'))
  })
})

describe('question → lesson mapping', () => {
  test('every question belongs to a lesson or unit checkpoint', () => {
    for (const u of chem.units) {
      for (const l of u.lessons) for (const q of l.check) expect(questionTopic(q.id)?.lesson).toBe(l.id)
      for (const q of u.checkpoint) expect(questionTopic(q.id)?.lesson).toBe(`unit:${u.id}`)
    }
  })
})

describe('study plan builder', () => {
  const answers: PlanAnswers = {
    examDate: '2027-05-06',
    examTime: '12:00',
    days: [0, 1, 2, 3, 6],
    minutes: 30,
    time: '16:30',
    start: '',
    reviewWeeks: 3,
  }
  const now = new Date(2026, 9, 9, 10, 0) // Fri 9 Oct 2026, local time
  const all = chem.units.flatMap((u) => u.lessons)

  test('schedules every unfinished lesson once, in course order, on study days only', () => {
    const p = buildPlan(chem, answers, new Set(), planExtras('chem'), now)
    const lessons = p.sessions.flatMap((s) => s.items.filter((i) => i.k === 'lesson').map((i) => i.id))
    expect(lessons).toEqual(all.map((l) => l.id))
    expect(p.overflow).toBeUndefined()
    for (const s of p.sessions) {
      const [y, m, d] = s.date.split('-').map(Number)
      expect(answers.days).toContain((new Date(y, m - 1, d).getDay() + 6) % 7)
      expect(s.date >= '2026-10-09' && s.date < '2027-05-06').toBe(true)
    }
    // sessions stay within the time budget unless a single lesson is longer
    for (const s of p.sessions) {
      const learn = s.items.filter((i) => i.k !== 'cards')
      if (learn.length > 1) expect(learn.reduce((n, i) => n + i.m, 0)).toBeLessThanOrEqual(answers.minutes)
    }
  })

  test('spreads lessons evenly up to the review weeks', () => {
    const p = buildPlan(chem, answers, new Set(), planExtras('chem'), now)
    const lessonDays = p.sessions.filter((s) => s.items.some((i) => i.k === 'lesson')).map((s) => s.date)
    expect(lessonDays[lessonDays.length - 1] > '2027-02-15').toBe(true) // about one item per session, finishing weeks before review (Apr 15)
    expect(lessonDays.length).toBeGreaterThanOrEqual(90)
  })

  test('review weeks contain practice, not new lessons', () => {
    const p = buildPlan(chem, answers, new Set(), planExtras('chem'), now)
    const review = p.sessions.filter((s) => s.date >= '2027-04-15')
    expect(review.length).toBeGreaterThan(5)
    expect(review.every((s) => s.items.every((i) => i.k !== 'lesson'))).toBe(true)
    expect(review.some((s) => s.items.some((i) => i.k === 'exam'))).toBe(true)
    expect(review.some((s) => s.items.some((i) => i.k === 'frq'))).toBe(true)
  })

  test('skips finished lessons and starts at the chosen unit', () => {
    const done = new Set(all.slice(0, 10).map((l) => l.id))
    const p = buildPlan(chem, { ...answers, start: 'chem-u4' }, done, {}, now)
    const first = p.sessions[0].items.find((i) => i.k === 'lesson')!
    expect(first.id).toBe(chem.units.find((u) => u.id === 'chem-u4')!.lessons[0].id)
    const items = learningItems(chem, '', done)
    expect(items.some((i) => done.has(i.id!))).toBe(false)
  })

  test('reports when it does not fit, and the session length that would', () => {
    const tight = { ...answers, examDate: '2026-12-01', days: [5], minutes: 15, reviewWeeks: 1 }
    const p = buildPlan(chem, tight, new Set(), {}, now)
    expect(p.overflow).toBeGreaterThan(0)
    const roomy = { ...answers, examDate: '2027-03-01' }
    expect(minutesNeeded(chem, roomy, new Set(), now)).toBe(30)
  })

  test('status: behind / today', () => {
    const p = buildPlan(chem, answers, new Set(), {}, now)
    const later = new Date(2026, 9, 20)
    const st = planStatus(p, new Set(), later)
    expect(st.behind).toBeGreaterThan(0)
    expect(planStatus(p, new Set(), now).todays).toBeUndefined() // Friday is not a study day
    expect(planStatus(p, new Set(), new Date(2026, 9, 12)).todays?.date).toBe('2026-10-12')
  })

  test('status: progress against the schedule (Home page card)', () => {
    const p = buildPlan(chem, answers, new Set(), {}, now)
    const later = new Date(2026, 9, 20)
    const lessons = p.sessions.flatMap((s) => s.items.filter((i) => i.k === 'lesson').map((i) => ({ id: i.id!, date: s.date })))
    const byLater = lessons.filter((l) => l.date <= '2026-10-20')
    const st = planStatus(p, new Set(), later)
    expect(st.lessonsPlanned).toBe(lessons.length)
    expect(st.dueSoFar).toBe(byLater.length)
    expect(st.lessonsDone).toBe(0)
    expect(st.behind).toBe(byLater.filter((l) => l.date < '2026-10-20').length)
    // doing everything planned so far, plus one lesson early, puts the student ahead
    const done = new Set([...byLater.map((l) => l.id), lessons[byLater.length].id])
    const caught = planStatus(p, done, later)
    expect(caught).toMatchObject({ behind: 0, ahead: 1, lessonsDone: byLater.length + 1 })
  })
})

describe('calendar (.ics)', () => {
  test('valid structure, folded lines, escaped text, exam event', () => {
    const p = buildPlan(chem, { examDate: '2027-05-06', examTime: '12:00', days: [0, 2, 4], minutes: 30, time: '16:30', start: '', reviewWeeks: 2 }, new Set(), planExtras('chem'), new Date(2026, 9, 9))
    p.tz = 'America/Chicago'
    const ics = planToIcs([p], { baseUrl: 'https://www.eziq.app', now: new Date('2026-10-09T00:00:00Z') })
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true)
    const events = ics.match(/BEGIN:VEVENT/g)!.length
    expect(events).toBe(p.sessions.length + 1)
    expect(ics).toContain('DTSTART;TZID=America/Chicago:20261009T163000')
    expect(ics).toContain('SUMMARY:🎯 Chemistry exam')
    for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
    expect(ics).not.toMatch(/[^\r]\n/)
    expect(addMinutes('23:50', 30)).toBe('23:59')
  })
})

describe('Stripe helpers', () => {
  test('nested form encoding', () => {
    const f = formEncode({ line_items: [{ price: 'p_1', quantity: 1 }], metadata: { plan: 'all' }, skip: undefined })
    expect(f.toString()).toBe('line_items%5B0%5D%5Bprice%5D=p_1&line_items%5B0%5D%5Bquantity%5D=1&metadata%5Bplan%5D=all')
  })

  test('webhook signatures', async () => {
    const body = '{"id":"evt_1"}'
    const t = 1_800_000_000
    const sig = await signPayload(body, 'whsec_test', t)
    expect(await verifyStripeSignature(body, `t=${t},v1=${sig}`, 'whsec_test', t + 10)).toBe(true)
    expect(await verifyStripeSignature(body, `t=${t},v1=${sig}`, 'whsec_other', t + 10)).toBe(false)
    expect(await verifyStripeSignature(body + ' ', `t=${t},v1=${sig}`, 'whsec_test', t + 10)).toBe(false)
    expect(await verifyStripeSignature(body, `t=${t},v1=${sig}`, 'whsec_test', t + 1000)).toBe(false)
    expect(await verifyStripeSignature(body, null, 'whsec_test', t)).toBe(false)
  })

  test('plan from price and subscription shapes', () => {
    expect(planFromLookupKey(lookupKey('three', 'month', 599))).toBe('three')
    expect(planFromLookupKey(lookupKey('all', 'year', 12900))).toBe('all')
    expect(planFromLookupKey(lookupKey('duo', 'month', 499))).toBe('duo')
    // keys made before prices could be edited still read
    expect(planFromLookupKey('aplearning_three_monthly_599')).toBe('three')
    expect(planFromLookupKey('other')).toBeNull()
    expect(planFromLookupKey('aplearning_free_monthly_0')).toBeNull()
    // a new price is a new key, so people on the old price stay on it
    expect(lookupKey('three', 'month', 599)).not.toBe(lookupKey('three', 'month', 699))
    const s = readSubscription({
      id: 'sub_1', customer: 'cus_1', status: 'active', cancel_at_period_end: false, metadata: { user_sub: 'u1', code: 'FALL20' },
      items: { data: [{ id: 'si_1', current_period_end: 1_800_000_000, price: { lookup_key: lookupKey('all', 'year', 12900), unit_amount: 12900, recurring: { interval: 'year' } } }] },
    })
    expect(s).toMatchObject({ plan: 'all', itemId: 'si_1', userSub: 'u1', periodEnd: new Date(1_800_000_000_000).toISOString(), priceCents: 12900, interval: 'year', code: 'FALL20' })
  })
})

describe('revenue forecast', () => {
  test('flat when history is short, trend when there is enough', () => {
    const now = new Date('2026-10-15T00:00:00Z')
    const short = forecast([{ month: '2026-09', amount: 1000 }], 1299, now)
    expect(short.points.every((p) => p.amount === 1299)).toBe(true)
    const rising = forecast(
      [
        { month: '2026-06', amount: 1000 },
        { month: '2026-07', amount: 2000 },
        { month: '2026-08', amount: 3000 },
        { month: '2026-09', amount: 4000 },
      ],
      4000,
      now,
    )
    expect(rising.points[0]).toEqual({ month: '2026-10', amount: 5000 })
    expect(rising.points[1].amount).toBe(6000)
    expect(fillMonths([{ month: '2026-07', amount: 5 }], '2026-09').map((m) => m.amount)).toEqual([5, 0, 0])
  })
})

describe('YouTube links', () => {
  test('every AP Chemistry lesson has two well-formed, distinct links', () => {
    for (const l of chem.units.flatMap((u) => u.lessons)) {
      const v = CHEM_YOUTUBE[l.id]
      expect(v, l.id).toBeDefined()
      expect(v.length, l.id).toBe(2)
      expect(new Set(v.map((x) => x[0])).size).toBe(2)
      for (const [id, title, channel] of v) {
        expect(id).toMatch(/^[\w-]{11}$/)
        expect(title.length).toBeGreaterThan(3)
        expect(channel.length).toBeGreaterThan(1)
      }
    }
    expect(Object.keys(CHEM_YOUTUBE).every((k) => chem.units.some((u) => u.lessons.some((l) => l.id === k)))).toBe(true)
  })
})

describe('pricing set in the admin portal', () => {
  const duo = { id: 'duo', name: 'Duo', blurb: '', courses: 2, monthly: 399, yearly: 3900, trialDays: 7, sort: 1, active: true }
  const withDuo: Pricing = { plans: [...P.plans, duo], promos: [] }

  test('plans rank by courses, then price; the bigger of paid and granted wins', () => {
    expect(planRank(P, 'free')).toBe(0)
    expect(planRank(P, 'three')).toBeLessThan(planRank(P, 'all'))
    expect(planRank(withDuo, 'duo')).toBeLessThan(planRank(withDuo, 'three'))
    expect(biggerPlan(P, 'three', 'all')).toBe('all')
    expect(biggerPlan(P, 'all', 'three')).toBe('all')
    expect(biggerPlan(P, 'free', null)).toBe('free')
  })

  test('a plan typed into the portal is checked', () => {
    expect(validatePlan({ ...duo, monthly: 399 })).toMatchObject({ id: 'duo', courses: 2, monthly: 399, yearly: 3900, trialDays: 7 })
    expect(validatePlan({ ...duo, courses: '' })).toMatchObject({ courses: null })
    expect(validatePlan({ ...duo, id: 'Duo Plan' })).toMatch(/id/)
    expect(validatePlan({ ...duo, monthly: 10 })).toMatch(/at least/)
    expect(validatePlan({ ...duo, courses: 0 })).toMatch(/Courses/)
    expect(validatePlan({ ...duo, trialDays: 365 })).toMatch(/trial/)
    expect(validatePlan({ id: 'free', name: 'Free', courses: 2, monthly: 500 })).toMatch(/free plan has no price/)
    // the free plan can never be retired
    expect(validatePlan({ id: 'free', name: 'Free', courses: 1, monthly: 0, active: false })).toMatchObject({ active: true, courses: 1 })
  })

  test('a free-course promotion opens its courses for everyone, only while it runs, without using a slot', () => {
    const p: Pricing = { ...P, promos: [{ id: 1, label: 'Stats free in November', courses: ['stats'], starts: '2026-11-01T05:00:00.000Z', ends: '2026-12-01T06:00:00.000Z' }] }
    const free = { plan: 'free', courses: ['chem', 'bio'] }
    expect(canOpen(p, free, 'stats', new Date('2026-10-31T12:00:00Z'))).toBe(false)
    expect(canOpen(p, free, 'stats', new Date('2026-11-15T12:00:00Z'))).toBe(true)
    expect(canOpen(p, free, 'stats', new Date('2026-12-01T06:00:00Z'))).toBe(false)
    expect(promoCourses(p, new Date('2026-11-15T12:00:00Z')).get('stats')).toBe('2026-12-01T06:00:00.000Z')
    // both picks still fit: the promotion did not use one
    expect(checkPickChange(p, 'free', ['chem'], ['chem', 'bio'], null)).toBeNull()
  })

  test('a promotion typed into the portal is checked', () => {
    const ok = { label: 'Stats week', courses: ['stats'], starts: '2026-11-01T00:00:00Z', ends: '2026-11-08T00:00:00Z' }
    expect(validatePromo(ok)).toMatchObject({ courses: ['stats'], ends: '2026-11-08T00:00:00.000Z' })
    expect(validatePromo({ ...ok, courses: [] })).toMatch(/at least one/)
    expect(validatePromo({ ...ok, courses: ['nope'] })).toBe('Unknown course')
    expect(validatePromo({ ...ok, ends: ok.starts })).toMatch(/end after/)
    expect(validatePromo({ ...ok, label: '' })).toMatch(/name/)
  })

  const fall20: DiscountCode = {
    code: 'FALL20', kind: 'coupon', channel: null, percentOff: 20, amountOff: null, duration: 'repeating', months: 3, plans: [], starts: null,
    ends: '2026-12-01T00:00:00.000Z', maxUses: 100, commissionPct: null, active: true, note: null,
  }

  test('what a code gives', () => {
    expect(describeDiscount(fall20)).toBe('20% off for 3 months')
    expect(describeDiscount({ ...fall20, percentOff: null, amountOff: 200, duration: 'once' })).toBe('$2.00 off the first payment')
    expect(describeDiscount({ ...fall20, duration: 'forever' })).toBe('20% off every payment')
    expect(describeDiscount({ ...fall20, percentOff: null })).toBe('No discount')
    expect(discounted(599, fall20)).toBe(479)
    expect(discounted(599, { percentOff: null, amountOff: 1000 })).toBe(0)
    expect(discounted(599, null)).toBe(599)
  })

  test('when a code can be used', () => {
    const now = new Date('2026-11-01T00:00:00Z')
    expect(codeProblem(fall20, 'three', 0, now)).toBeNull()
    expect(codeProblem({ ...fall20, active: false }, 'three', 0, now)).toMatch(/no longer/)
    expect(codeProblem(fall20, 'three', 0, new Date('2026-12-01T00:00:00Z'))).toMatch(/expired/)
    expect(codeProblem({ ...fall20, starts: '2026-11-02T00:00:00Z' }, 'three', 0, now)).toMatch(/not active yet/)
    expect(codeProblem(fall20, 'three', 100, now)).toMatch(/used up/)
    expect(codeProblem({ ...fall20, plans: ['all'] }, 'three', 0, now)).toMatch(/that plan/)
  })

  test('a code typed into the portal is checked', () => {
    const ids = P.plans.map((p) => p.id)
    expect(validateCode({ ...fall20, code: ' fall20 ' }, ids)).toMatchObject({ code: 'FALL20', percentOff: 20, months: 3 })
    expect(validateCode({ ...fall20, code: 'no spaces' }, ids)).toMatch(/letters/)
    expect(validateCode({ ...fall20, percentOff: 120 }, ids)).toMatch(/Percent/)
    expect(validateCode({ ...fall20, percentOff: 10, amountOff: 100 }, ids)).toMatch(/not both/)
    expect(validateCode({ ...fall20, percentOff: null }, ids)).toMatch(/coupon needs/)
    expect(validateCode({ ...fall20, plans: ['free'] }, ids)).toMatch(/paid plans/)
    expect(validateCode({ ...fall20, months: 0 }, ids)).toMatch(/months/)
    // an affiliate code needs its channel, can track without a discount, and can carry a commission
    expect(validateCode({ ...fall20, kind: 'affiliate', percentOff: null }, ids)).toMatch(/partner or channel/)
    expect(validateCode({ ...fall20, kind: 'affiliate', channel: 'TikTok', percentOff: null, commissionPct: 15 }, ids)).toMatchObject({
      kind: 'affiliate', channel: 'TikTok', percentOff: null, duration: 'once', months: null, commissionPct: 15,
    })
    // a coupon never carries a commission
    expect(validateCode({ ...fall20, commissionPct: 15 }, ids)).toMatchObject({ commissionPct: null })
  })

  test('each discount gets its own Stripe coupon, so editing a code never changes what earlier students got', () => {
    expect(couponId(fall20)).toBe('aplearning_fall20_20pct_repeating3')
    expect(couponId({ ...fall20, percentOff: 25 })).not.toBe(couponId(fall20))
    expect(couponId({ ...fall20, percentOff: null, amountOff: 200, duration: 'once' })).toBe('aplearning_fall20_200c_once')
  })
})
