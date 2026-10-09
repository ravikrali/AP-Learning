// A personal study plan for one course, and its calendar (.ics) form.
// The app builds the plan (src/lib/schedule.ts) and syncs it as item "plan:<courseId>";
// the Worker turns every plan into a calendar feed people can subscribe to.

export interface PlanItem {
  /** lesson | checkpoint | exam (practice exam) | frq | cards (flashcard review) | review (weak spots) */
  k: 'lesson' | 'checkpoint' | 'exam' | 'frq' | 'cards' | 'review'
  /** lesson id, unit id, exam format … (depends on k) */
  id?: string
  /** title shown in the app and the calendar */
  t: string
  /** minutes */
  m: number
  /** app route, e.g. "/lesson/chem-1.1" */
  to?: string
}

export interface PlanSession {
  /** local date, YYYY-MM-DD */
  date: string
  items: PlanItem[]
}

export interface StudyPlan {
  course: string
  courseTitle: string
  examDate: string
  examTime: string
  /** IANA time zone of the device that made the plan, e.g. "America/Chicago" */
  tz: string
  /** usual start time, HH:MM */
  time: string
  /** minutes per session */
  minutes: number
  /** study weekdays, 0 = Monday … 6 = Sunday */
  days: number[]
  /** unit id to start from, or "" for the beginning */
  start: string
  reviewWeeks: number
  createdAt: string
  sessions: PlanSession[]
  /** set when the lessons didn't fit before the review period */
  overflow?: number
}

// ---------- calendar ----------

function esc(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** RFC 5545 line folding: lines over 75 octets continue on the next line after a space. */
function fold(line: string): string {
  const enc = new TextEncoder()
  if (enc.encode(line).length <= 75) return line
  const out: string[] = []
  let cur = ''
  for (const ch of line) {
    if (enc.encode(cur + ch).length > (out.length ? 74 : 75)) {
      out.push(cur)
      cur = ''
    }
    cur += ch
  }
  out.push(cur)
  return out.join('\r\n ')
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const local = (date: string, hhmm: string) => `${date.replace(/-/g, '')}T${hhmm.replace(':', '')}00`

/** Add minutes to HH:MM on the same day (stops at 23:59). */
export function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const t = Math.min(h * 60 + m + minutes, 23 * 60 + 59)
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

export const sessionMinutes = (s: PlanSession) => s.items.reduce((n, i) => n + i.m, 0)

export function planToIcs(plans: StudyPlan[], opts: { baseUrl: string; name?: string; now?: Date }): string {
  const now = stamp(opts.now ?? new Date())
  const tz = plans[0]?.tz
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AP Learning//Study plan//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(opts.name ?? 'AP Learning study plan')}`,
    ...(tz ? [`X-WR-TIMEZONE:${tz}`] : []),
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
  ]
  const when = (p: StudyPlan, date: string, hhmm: string) => (p.tz ? `;TZID=${p.tz}:${local(date, hhmm)}` : `:${local(date, hhmm)}`)

  for (const p of plans) {
    for (const s of p.sessions) {
      const mins = Math.max(10, sessionMinutes(s))
      const first = s.items[0]
      const title = s.items.length === 1 ? first.t : `${first.t} + ${s.items.length - 1} more`
      const desc = [
        ...s.items.map((i) => `• ${i.t} (${i.m} min)`),
        '',
        `Open AP Learning: ${opts.baseUrl}/#${first.to ?? '/'}`,
      ].join('\n')
      lines.push(
        'BEGIN:VEVENT',
        `UID:${p.course}-${s.date}@aplearning.app`,
        `DTSTAMP:${now}`,
        `DTSTART${when(p, s.date, p.time)}`,
        `DTEND${when(p, s.date, addMinutes(p.time, mins))}`,
        `SUMMARY:${esc(`📚 ${p.courseTitle.replace(/^AP /, '')}: ${title}`)}`,
        `DESCRIPTION:${esc(desc)}`,
        `URL:${opts.baseUrl}/#${first.to ?? '/'}`,
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Study time',
        'TRIGGER:-PT10M',
        'END:VALARM',
        'END:VEVENT',
      )
    }
    lines.push(
      'BEGIN:VEVENT',
      `UID:${p.course}-exam@aplearning.app`,
      `DTSTAMP:${now}`,
      `DTSTART${when(p, p.examDate, p.examTime)}`,
      `DTEND${when(p, p.examDate, addMinutes(p.examTime, 195))}`,
      `SUMMARY:${esc(`🎯 ${p.courseTitle} exam`)}`,
      `DESCRIPTION:${esc('Check the exact reporting time and room with your AP coordinator. You have got this!')}`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}
