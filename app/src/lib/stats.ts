// Statistics helpers used to VERIFY lesson content and to power the Formulas & Tables page.
// Distributions are computed from first principles (incomplete gamma and beta functions), and the
// test suite checks them against values printed in the AP Statistics CED's own tables.

// ---------- one-variable summaries ----------

export const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0)
export const mean = (xs: number[]) => sum(xs) / xs.length

/** Sample standard deviation s (divides by n − 1), as on the AP formula sheet. */
export function sd(xs: number[]) {
  const m = mean(xs)
  return Math.sqrt(sum(xs.map((x) => (x - m) ** 2)) / (xs.length - 1))
}

const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b)

export function median(xs: number[]) {
  const s = sorted(xs)
  const n = s.length
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
}

/**
 * Five-number summary. Q1 and Q3 are the medians of the lower and upper halves; with an odd count
 * the median itself is left out of both halves (the method most calculators use). Lessons use data
 * sets with an even count whenever quartiles matter, so both common methods agree.
 */
export function fiveNumber(xs: number[]) {
  const s = sorted(xs)
  const n = s.length
  const half = Math.floor(n / 2)
  return { min: s[0], q1: median(s.slice(0, half)), med: median(s), q3: median(s.slice(n - half)), max: s[n - 1] }
}

export const iqr = (xs: number[]) => {
  const f = fiveNumber(xs)
  return f.q3 - f.q1
}

/** Values outside Q1 − 1.5·IQR … Q3 + 1.5·IQR. */
export function outliers(xs: number[]) {
  const f = fiveNumber(xs)
  const lo = f.q1 - 1.5 * (f.q3 - f.q1)
  const hi = f.q3 + 1.5 * (f.q3 - f.q1)
  return xs.filter((x) => x < lo || x > hi)
}

// ---------- special functions ----------

/** ln Γ(x), Lanczos approximation (g = 7, n = 9); accurate to about 15 digits for x > 0. */
export function logGamma(x: number): number {
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x)
  x -= 1
  let a = c[0]
  const t = x + 7.5
  for (let i = 1; i < 9; i++) a += c[i] / (x + i)
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
}

/** Regularized lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0
  if (x < a + 1) {
    let term = 1 / a
    let s = term
    for (let n = 1; n < 1000; n++) {
      term *= x / (a + n)
      s += term
      if (Math.abs(term) < Math.abs(s) * 1e-16) break
    }
    return s * Math.exp(-x + a * Math.log(x) - logGamma(a))
  }
  return 1 - gammaQcf(a, x)
}

/** Q(a, x) = 1 − P(a, x) by Lentz's continued fraction (for x ≥ a + 1). */
function gammaQcf(a: number, x: number): number {
  const tiny = 1e-300
  let b = x + 1 - a
  let c = 1 / tiny
  let d = 1 / b
  let h = d
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a)
    b += 2
    d = an * d + b
    if (Math.abs(d) < tiny) d = tiny
    c = b + an / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-16) break
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h
}

/** Regularized incomplete beta I_x(a, b). */
export function betaI(x: number, a: number, b: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const front = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x))
  if (x < (a + 1) / (a + b + 2)) return (front * betaCf(x, a, b)) / a
  return 1 - (front * betaCf(1 - x, b, a)) / b
}

function betaCf(x: number, a: number, b: number): number {
  const tiny = 1e-300
  let c = 1
  let d = 1 - ((a + b) * x) / (a + 1)
  if (Math.abs(d) < tiny) d = tiny
  d = 1 / d
  let h = d
  for (let m = 1; m < 1000; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < tiny) d = tiny
    c = 1 + aa / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1))
    d = 1 + aa * d
    if (Math.abs(d) < tiny) d = tiny
    c = 1 + aa / c
    if (Math.abs(c) < tiny) c = tiny
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-16) break
  }
  return h
}

/** Solve f(x) = target for increasing f on [lo, hi] by bisection. */
function invert(f: (x: number) => number, target: number, lo: number, hi: number) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (f(mid) < target) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

// ---------- normal ----------

/** P(Z ≤ z) for the standard normal distribution. */
export function normCdf(z: number): number {
  if (z === 0) return 0.5
  const p = gammaP(0.5, (z * z) / 2) / 2 // P(0 < Z < |z|)
  return z > 0 ? 0.5 + p : 0.5 - p
}

/** P(lo < X < hi) for X ~ N(mu, sigma). Use ±Infinity for open ends. */
export function normalcdf(lo: number, hi: number, mu = 0, sigma = 1): number {
  const c = (x: number) => (x === Infinity ? 1 : x === -Infinity ? 0 : normCdf((x - mu) / sigma))
  return c(hi) - c(lo)
}

/** The value with area p to its left. */
export function invNorm(p: number, mu = 0, sigma = 1): number {
  return mu + sigma * invert(normCdf, p, -40, 40)
}

// ---------- t ----------

/** P(T ≤ t) with df degrees of freedom (df may be fractional, as from technology). */
export function tCdf(t: number, df: number): number {
  const x = df / (df + t * t)
  const tail = betaI(x, df / 2, 0.5) / 2 // P(T > |t|)
  return t >= 0 ? 1 - tail : tail
}

/** The t value with area p to its left. */
export function invT(p: number, df: number): number {
  return invert((t) => tCdf(t, df), p, -1e4, 1e4)
}

/** Critical value t* for a C (e.g. 0.95) confidence interval. */
export const tStar = (conf: number, df: number) => invT(1 - (1 - conf) / 2, df)
export const zStar = (conf: number) => invNorm(1 - (1 - conf) / 2)

/** Welch–Satterthwaite degrees of freedom (what technology uses for two-sample t procedures). */
export function welchDf(s1: number, n1: number, s2: number, n2: number) {
  const a = (s1 * s1) / n1
  const b = (s2 * s2) / n2
  return (a + b) ** 2 / ((a * a) / (n1 - 1) + (b * b) / (n2 - 1))
}

// ---------- chi-square ----------

export const chiCdf = (x: number, df: number) => gammaP(df / 2, x / 2)
/** P(χ² ≥ x), the p-value of a chi-square test. */
export const chiUpper = (x: number, df: number) => 1 - chiCdf(x, df)
/** The χ² value with upper-tail area p. */
export const chiCrit = (p: number, df: number) => invert((x) => chiCdf(x, df), 1 - p, 0, 1e4)

/** Expected counts, χ² statistic, df and p-value for a two-way table of observed counts. */
export function chiSquareTest(observed: number[][]) {
  const rows = observed.map(sum)
  const cols = observed[0].map((_, j) => sum(observed.map((r) => r[j])))
  const total = sum(rows)
  const expected = observed.map((r, i) => r.map((_, j) => (rows[i] * cols[j]) / total))
  const chi2 = sum(observed.flatMap((r, i) => r.map((o, j) => (o - expected[i][j]) ** 2 / expected[i][j])))
  const df = (observed.length - 1) * (observed[0].length - 1)
  return { expected, chi2, df, p: chiUpper(chi2, df) }
}

// ---------- binomial ----------

export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return r
}

export const binomPdf = (n: number, p: number, x: number) => choose(n, x) * p ** x * (1 - p) ** (n - x)

/** P(X ≤ x) */
export function binomCdf(n: number, p: number, x: number) {
  let s = 0
  for (let k = 0; k <= Math.min(x, n); k++) s += binomPdf(n, p, k)
  return s
}

// ---------- discrete random variables ----------

export const rvMean = (xs: number[], ps: number[]) => sum(xs.map((x, i) => x * ps[i]))
export function rvSd(xs: number[], ps: number[]) {
  const m = rvMean(xs, ps)
  return Math.sqrt(sum(xs.map((x, i) => (x - m) ** 2 * ps[i])))
}

// ---------- inference shortcuts ----------

/** One-proportion z-interval. */
export function propInterval(x: number, n: number, conf: number) {
  const p = x / n
  const se = Math.sqrt((p * (1 - p)) / n)
  const me = zStar(conf) * se
  return { p, se, me, lo: p - me, hi: p + me }
}

export type Tail = 'greater' | 'less' | 'two'

const pFromZ = (z: number, tail: Tail) => (tail === 'greater' ? 1 - normCdf(z) : tail === 'less' ? normCdf(z) : 2 * (1 - normCdf(Math.abs(z))))
const pFromT = (t: number, df: number, tail: Tail) =>
  tail === 'greater' ? 1 - tCdf(t, df) : tail === 'less' ? tCdf(t, df) : 2 * (1 - tCdf(Math.abs(t), df))

/** One-proportion z-test of H0: p = p0. */
export function propTest(x: number, n: number, p0: number, tail: Tail) {
  const z = (x / n - p0) / Math.sqrt((p0 * (1 - p0)) / n)
  return { z, p: pFromZ(z, tail) }
}

/** Two-proportion z-interval for p1 − p2. */
export function twoPropInterval(x1: number, n1: number, x2: number, n2: number, conf: number) {
  const p1 = x1 / n1
  const p2 = x2 / n2
  const se = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2)
  const me = zStar(conf) * se
  return { diff: p1 - p2, se, me, lo: p1 - p2 - me, hi: p1 - p2 + me }
}

/** Two-proportion z-test of H0: p1 = p2 using the combined (pooled) proportion. */
export function twoPropTest(x1: number, n1: number, x2: number, n2: number, tail: Tail) {
  const pc = (x1 + x2) / (n1 + n2)
  const se = Math.sqrt(pc * (1 - pc) * (1 / n1 + 1 / n2))
  const z = (x1 / n1 - x2 / n2) / se
  return { pc, se, z, p: pFromZ(z, tail) }
}

/** One-sample t-interval for μ (or μ_d) from summary statistics. */
export function tInterval(xbar: number, s: number, n: number, conf: number) {
  const se = s / Math.sqrt(n)
  const ts = tStar(conf, n - 1)
  return { se, tStar: ts, me: ts * se, lo: xbar - ts * se, hi: xbar + ts * se, df: n - 1 }
}

/** One-sample t-test of H0: μ = mu0. */
export function tTest(xbar: number, s: number, n: number, mu0: number, tail: Tail) {
  const t = (xbar - mu0) / (s / Math.sqrt(n))
  return { t, df: n - 1, p: pFromT(t, n - 1, tail) }
}

/** Two-sample t-interval for μ1 − μ2 with technology (Welch) degrees of freedom. */
export function twoTInterval(x1: number, s1: number, n1: number, x2: number, s2: number, n2: number, conf: number) {
  const se = Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2)
  const df = welchDf(s1, n1, s2, n2)
  const ts = tStar(conf, df)
  return { se, df, tStar: ts, me: ts * se, lo: x1 - x2 - ts * se, hi: x1 - x2 + ts * se }
}

/** Two-sample t-test of H0: μ1 = μ2 with technology (Welch) degrees of freedom. */
export function twoTTest(x1: number, s1: number, n1: number, x2: number, s2: number, n2: number, tail: Tail) {
  const se = Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2)
  const df = welchDf(s1, n1, s2, n2)
  const t = (x1 - x2) / se
  return { se, df, t, p: pFromT(t, df, tail) }
}

// ---------- regression ----------

export function correlation(xs: number[], ys: number[]) {
  const mx = mean(xs)
  const my = mean(ys)
  const sxy = sum(xs.map((x, i) => (x - mx) * (ys[i] - my)))
  const sxx = sum(xs.map((x) => (x - mx) ** 2))
  const syy = sum(ys.map((y) => (y - my) ** 2))
  return sxy / Math.sqrt(sxx * syy)
}

/** Least-squares line ŷ = a + b·x, with r and r². */
export function lsrl(xs: number[], ys: number[]) {
  const mx = mean(xs)
  const my = mean(ys)
  const b = sum(xs.map((x, i) => (x - mx) * (ys[i] - my))) / sum(xs.map((x) => (x - mx) ** 2))
  const a = my - b * mx
  const r = correlation(xs, ys)
  return { a, b, r, r2: r * r, residuals: xs.map((x, i) => ys[i] - (a + b * x)) }
}
