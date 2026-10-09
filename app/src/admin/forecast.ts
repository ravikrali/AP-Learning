// Revenue history → simple forecast for the dashboard.
// Method (shown in the UI): a straight-line trend fitted to the last up to 6 complete months;
// with fewer than 3 months of history, the current monthly recurring revenue is projected flat.

export interface MonthValue {
  month: string // YYYY-MM
  amount: number // cents
}

export function monthKey(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export function addMonths(month: string, n: number) {
  const [y, m] = month.split('-').map(Number)
  return monthKey(new Date(Date.UTC(y, m - 1 + n, 1)))
}

/** Every month from the first one with data up to (and including) `until`, missing months as 0. */
export function fillMonths(rows: MonthValue[], until: string): MonthValue[] {
  if (!rows.length) return []
  const map = new Map(rows.map((r) => [r.month, r.amount]))
  const out: MonthValue[] = []
  for (let m = [...map.keys()].sort()[0]; m <= until; m = addMonths(m, 1)) out.push({ month: m, amount: map.get(m) ?? 0 })
  return out
}

export function forecast(history: MonthValue[], mrr: number, now = new Date(), ahead = 6): { points: MonthValue[]; method: string } {
  const current = monthKey(now)
  const complete = fillMonths(history, addMonths(current, -1)).slice(-6)
  const next = (i: number) => addMonths(current, i)
  if (complete.length < 3) {
    return {
      points: Array.from({ length: ahead }, (_, i) => ({ month: next(i), amount: mrr })),
      method: 'Current monthly recurring revenue, held flat (not enough history for a trend yet).',
    }
  }
  const n = complete.length
  const xs = complete.map((_, i) => i)
  const ys = complete.map((p) => p.amount)
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0)
  const slope = sxx ? xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / sxx : 0
  const at = (x: number) => Math.max(0, Math.round(my + slope * (x - mx)))
  return {
    points: Array.from({ length: ahead }, (_, i) => ({ month: next(i), amount: at(n + i) })),
    method: `Straight-line trend of the last ${n} complete months.`,
  }
}
