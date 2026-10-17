// Business numbers for the admin dashboard, worked out from plain monthly counts so the same
// rules can be tested without a database.

export interface MonthCount {
  month: string // "2027-05"
  n: number
}

export function nextMonth(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
}

export interface ChurnRow {
  month: string
  /** subscribers who paid in the month before */
  start: number
  /** of those, how many did not pay again in this month */
  lost: number
  /** lost ÷ start, or null when nobody was paying the month before */
  rate: number | null
  /** the month is not over, so some of the "lost" may still renew */
  partial: boolean
}

/**
 * Monthly churn. Plans are billed monthly, so a subscriber who paid in one month and not in
 * the next has left (or their card failed).
 * payers: people with a paid invoice, per month. retained: of a month's payers, how many also
 * paid in the following month (keyed by the earlier month).
 */
export function churnByMonth(payers: MonthCount[], retained: MonthCount[], current: string): ChurnRow[] {
  const kept = new Map(retained.map((r) => [r.month, r.n]))
  return [...payers]
    .sort((a, b) => a.month.localeCompare(b.month))
    .filter((p) => p.month < current)
    .map((p) => {
      const month = nextMonth(p.month)
      const lost = Math.max(0, p.n - (kept.get(p.month) ?? 0))
      return { month, start: p.n, lost, rate: p.n ? lost / p.n : null, partial: month === current }
    })
}

/** Share of sign-ups who went on to pay at least once. */
export const conversion = (signups: number, paid: number) => (signups > 0 ? paid / signups : null)

/** Ad spend (cents) per sign-up, or null when there were no sign-ups to divide by. */
export const costPerSignup = (spendCents: number, signups: number) => (signups > 0 ? spendCents / signups : null)

export const MONTH_PATTERN = /^20\d{2}-(0[1-9]|1[0-2])$/
/** A campaign source tag as it appears in a link's utm_source. */
export const SOURCE_PATTERN = /^[\w.\- ()]{1,80}$/
/** What a sign-up without a tagged link is filed under. */
export const NO_SOURCE = '(none)'
