import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CATALOG, CATEGORIES } from '../../shared/catalog'
import {
  discounted,
  FREE_PLAN,
  money,
  offeredPlans,
  pickLimit,
  planFeatures,
  planOf,
  promoCourses,
  unlimited,
  type Interval,
  type Plan,
  type PlanId,
} from '../../shared/pricing'
import { BUILT } from '../content'
import { BRAND } from '../../shared/brand'
import { Trademark } from '../components/Legal'
import { useApp } from '../lib/app'
import {
  addCourse,
  billingPortal,
  cancelPlan,
  checkCode,
  choosePlan,
  courseTitle,
  openable,
  pickProblem,
  refreshAccount,
  setPicks,
  toggleInterest,
  useAccount,
  type Account,
  type CodeInfo,
} from '../lib/account'
import { usePricing } from '../lib/pricing'
import { linkCode } from '../lib/visit'
import { TopBar } from '../components/bits'

const longDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '')
const shortDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

/** The price line of a plan card: "$5.99/month", "$59.00/year", "Free". */
export function PriceTag({ plan, interval, code }: { plan: Plan; interval: Interval; code?: CodeInfo | null }) {
  const cents = interval === 'year' && plan.yearly ? plan.yearly : plan.monthly
  const per = interval === 'year' && plan.yearly ? '/year' : '/month'
  const fits = code && plan.id !== FREE_PLAN && (!code.plans.length || code.plans.includes(plan.id))
  const first = fits ? discounted(cents, code) : cents
  return (
    <div className="plan-price">
      {first !== cents && <s className="was">{money(cents)}</s>}
      {money(first)}
      {cents > 0 && <span>{per}</span>}
    </div>
  )
}

/** Shown instead of a course's screens when the plan doesn't include it. */
export function CourseGate({ courseId, children }: { courseId: string; children: ReactNode }) {
  const a = useAccount()
  const pricing = usePricing()
  const [err, setErr] = useState<string | null>(null)
  if (openable(a, courseId, pricing)) return <>{children}</>
  const limit = pickLimit(pricing, a.plan)
  const hasSlot = a.courses.length < limit
  const title = courseTitle(courseId)
  const left = limit - a.courses.length
  return (
    <div>
      <TopBar title={title} back="/learn" />
      <div className="empty">
        <div className="e">🔓</div>
        {hasSlot ? (
          <>
            <p>
              {a.plan === FREE_PLAN ? (
                <>
                  Your free plan includes <b>{limit === 1 ? 'one course' : `${limit} courses`}</b>
                  {a.courses.length ? <> and you have {left} left</> : null}. Add <b>{title}</b>?
                </>
              ) : (
                <>
                  You have {left} course slot{left === 1 ? '' : 's'} left. Add <b>{title}</b>?
                </>
              )}
            </p>
            <button className="btn" onClick={() => addCourse(courseId).catch((e) => setErr(e.message))}>
              ✓ Add {title}
            </button>
          </>
        ) : (
          <>
            <p>
              <b>{title}</b> isn't in your plan yet. Your plan includes {a.courses.map(courseTitle).join(', ')}.
            </p>
            <Link className="btn" to="/plans">
              See plans
            </Link>
          </>
        )}
        {err && <p className="small" style={{ color: 'var(--oops)' }}>{err}</p>}
      </div>
    </div>
  )
}

function PlanCard({
  plan, a, busy, interval, code, onChoose,
}: { plan: Plan; a: Account; busy: boolean; interval: Interval; code: CodeInfo | null; onChoose: (p: PlanId) => void }) {
  const { user } = useApp()
  const current = a.ownPlan === plan.id
  const trial = plan.trialDays > 0 && !a.trialUsed && a.paidPlan === FREE_PLAN
  let action: ReactNode
  if (current) action = <span className="pill">✓ Your plan</span>
  else if (plan.id === FREE_PLAN)
    action =
      a.paidPlan !== FREE_PLAN && !a.cancelAtPeriodEnd ? (
        <button className="btn ghost" disabled={busy} onClick={() => onChoose(FREE_PLAN)}>
          Switch to free
        </button>
      ) : null
  else if (!plan.active) action = <span className="small muted">No longer offered</span>
  else if (user.guest || !user.token) action = <span className="small muted">Sign in with Google to subscribe</span>
  else if (!a.billing) action = <span className="small muted">Coming soon</span>
  else if (interval === 'year' && !plan.yearly) action = <span className="small muted">Monthly only</span>
  else
    action = (
      <button className="btn" disabled={busy} onClick={() => onChoose(plan.id)}>
        {a.paidPlan !== FREE_PLAN ? `Switch to ${plan.name}` : trial ? `Start ${plan.trialDays}-day free trial` : `Choose ${plan.name}`}
      </button>
    )
  return (
    <div className={`plan-card ${plan.courses === null ? 'top' : ''} ${current ? 'current' : ''}`}>
      <div className="plan-name">{plan.name}</div>
      <PriceTag plan={plan} interval={interval} code={code} />
      {trial && plan.active && <div className="small" style={{ color: 'var(--good)', fontWeight: 700 }}>{plan.trialDays} days free, then billed</div>}
      <ul>
        {planFeatures(plan).map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="plan-action">{action}</div>
    </div>
  )
}

export function PlansPage() {
  const a = useAccount()
  const pricing = usePricing()
  const { user } = useApp()
  const nav = useNavigate()
  const { search } = useLocation()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [interval, setBilling] = useState<Interval>(a.interval ?? 'month')
  const [typed, setTyped] = useState('')
  const [code, setCode] = useState<CodeInfo | null>(null)
  const [codeErr, setCodeErr] = useState<string | null>(null)
  const checkout = new URLSearchParams(search).get('checkout')
  const signedIn = !user.guest && !!user.token

  const shown = offeredPlans(pricing)
  if (!shown.some((p) => p.id === a.ownPlan)) shown.push(planOf(pricing, a.ownPlan))
  const yearly = shown.some((p) => p.yearly)

  // Back from Stripe: the webhook can take a few seconds, so check again a few times.
  useEffect(() => {
    if (checkout !== 'done') {
      void refreshAccount().catch(() => undefined)
      return
    }
    setMsg('Thank you! Setting up your plan…')
    let n = 0
    const t = window.setInterval(async () => {
      n++
      const fresh = await refreshAccount().catch(() => null)
      if ((fresh && fresh.paidPlan !== FREE_PLAN) || n > 10) {
        window.clearInterval(t)
        setMsg(fresh && fresh.paidPlan !== FREE_PLAN ? `🎉 You're on ${planOf(pricing, fresh.paidPlan).name}. Pick your courses below.` : 'Payment received. Your plan will appear in a minute.')
        nav('/plans', { replace: true })
      }
    }, 2000)
    return () => window.clearInterval(t)
  }, [checkout, nav, pricing])

  // a code from the link they came through (or signed up through) is filled in for them
  useEffect(() => {
    const start = a.refCode ?? linkCode()
    if (start && !typed && signedIn && a.paidPlan === FREE_PLAN) {
      setTyped(start)
      void applyCode(start, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a.refCode, signedIn])

  async function applyCode(text = typed, quiet = false) {
    setCodeErr(null)
    const t = text.trim().toUpperCase()
    if (!t) return setCode(null)
    try {
      setCode(await checkCode(t))
    } catch (e) {
      setCode(null)
      if (!quiet) setCodeErr((e as Error).message)
    }
  }

  async function choose(p: PlanId) {
    setBusy(true)
    setMsg(null)
    try {
      if (p === FREE_PLAN) {
        await cancelPlan(false)
        setMsg(`Done. You keep ${planOf(pricing, a.paidPlan).name} until ${longDate(a.periodEnd)}, then move to Free.`)
      } else {
        const r = await choosePlan(p, interval, code?.code)
        if (r.url) window.location.href = r.url
        else setMsg(`🎉 Switched to ${planOf(pricing, p).name}. Any difference is prorated on your next bill.${r.note ? ` ${r.note}` : ''}`)
      }
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function manage() {
    setBusy(true)
    try {
      window.location.href = await billingPortal()
    } catch (e) {
      setMsg((e as Error).message)
      setBusy(false)
    }
  }

  const paid = planOf(pricing, a.paidPlan)
  return (
    <div>
      <TopBar title="Plans & courses" back="/me" />
      {msg && <div className="card notice">{msg}</div>}

      {yearly && (
        <div className="row center" style={{ marginBottom: 10, justifyContent: 'center' }}>
          <div className="seg" role="group" aria-label="Billing period">
            <button className={interval === 'month' ? 'on' : ''} onClick={() => setBilling('month')}>
              Monthly
            </button>
            <button className={interval === 'year' ? 'on' : ''} onClick={() => setBilling('year')}>
              Yearly
            </button>
          </div>
        </div>
      )}

      <div className="plans">
        {shown.map((p) => (
          <PlanCard key={p.id} plan={p} a={a} busy={busy} interval={interval} code={code} onChoose={choose} />
        ))}
      </div>

      {signedIn && a.billing && a.paidPlan === FREE_PLAN && (
        <form
          className="card stack code-box"
          style={{ marginTop: 12 }}
          onSubmit={(e) => {
            e.preventDefault()
            void applyCode()
          }}
        >
          <label className="small" htmlFor="code" style={{ fontWeight: 700 }}>
            Have a code?
          </label>
          <div className="row">
            <input id="code" className="admin-input grow" value={typed} onChange={(e) => setTyped(e.target.value.toUpperCase())} placeholder="e.g. FALL20" autoCapitalize="characters" maxLength={30} />
            <button className="btn secondary">Apply</button>
          </div>
          {code && (
            <div className="small" style={{ color: 'var(--good)' }}>
              ✓ {code.code}: {code.description}
              {code.plans.length ? ` (${code.plans.map((id) => planOf(pricing, id).name).join(', ')})` : ''}. It's applied when you choose a plan.
            </div>
          )}
          {codeErr && <div className="small" style={{ color: 'var(--oops)' }}>{codeErr}</div>}
        </form>
      )}

      {a.compPlan && <p className="small muted center">🎁 {planOf(pricing, a.compPlan).name} was given to you by {BRAND.name}.</p>}
      {a.admin && <p className="small muted center">🛠️ As an admin you can open every course.</p>}
      {a.paidPlan !== FREE_PLAN && (
        <div className="card stack" style={{ marginTop: 12 }}>
          <div className="small">
            {a.cancelAtPeriodEnd ? `Your ${paid.name} plan ends on ${longDate(a.periodEnd)}.` : `${paid.name} renews on ${longDate(a.periodEnd)}.`}
            {a.priceCents ? ` You pay ${money(a.priceCents)} a ${a.interval === 'year' ? 'year' : 'month'}${a.code ? ` (code ${a.code})` : ''}.` : ''}
            {a.status === 'trialing' && ' 🎁 You are in your free trial.'}
            {a.status === 'past_due' && ' ⚠️ The last payment did not go through. Please update the card.'}
          </div>
          <div className="row">
            <button className="btn secondary grow" disabled={busy} onClick={manage}>
              💳 Billing & receipts
            </button>
            {a.cancelAtPeriodEnd && (
              <button className="btn grow" disabled={busy} onClick={() => cancelPlan(true).catch((e) => setMsg(e.message))}>
                Keep my plan
              </button>
            )}
          </div>
        </div>
      )}
      <p className="small muted center" style={{ marginTop: 10 }}>
        Payments are handled securely by Stripe. A parent or guardian should complete the payment. Cancel anytime and keep
        access until the end of the period you paid for.
      </p>

      <CoursePicker />
      {user.guest && <p className="small muted center">As a guest your course choice is saved on this device only.</p>}
      <Trademark className="tiny muted center" style={{ marginTop: 16 }} />
    </div>
  )
}

export function CoursePicker() {
  const a = useAccount()
  const pricing = usePricing()
  const [err, setErr] = useState<string | null>(null)
  const limit = pickLimit(pricing, a.plan)
  const all = unlimited(pricing, a.plan)
  const promo = promoCourses(pricing)

  async function toggle(id: string) {
    setErr(null)
    const next = a.courses.includes(id) ? a.courses.filter((c) => c !== id) : [...a.courses, id]
    const problem = pickProblem(a, next, pricing)
    if (problem) return setErr(problem)
    try {
      await setPicks(next)
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  return (
    <>
      <div className="section-title">{all ? 'Every course is included' : `Your courses · ${a.courses.length} of ${limit}`}</div>
      {!all && (
        <p className="small muted" style={{ marginTop: -4 }}>
          Tap a course to add it. You can swap a course out once every 30 days.
          {a.switchAvailableAt && ` Next swap: ${longDate(a.switchAvailableAt)}.`}
        </p>
      )}
      {!all && promo.size > 0 && (
        <p className="small" style={{ marginTop: -4 }}>
          🎁 Free for everyone right now, without using a slot:{' '}
          {[...promo].map(([id, until]) => `${courseTitle(id)} (until ${shortDate(until)})`).join(', ')}. Add one to keep it after that.
        </p>
      )}
      {err && <p className="small" style={{ color: 'var(--oops)' }}>{err}</p>}
      {CATEGORIES.map((cat) => (
        <div key={cat} className="stack" style={{ gap: 8, marginBottom: 14 }}>
          <div className="small muted" style={{ fontWeight: 800 }}>
            {cat}
          </div>
          <div className="chips">
            {CATALOG.filter((c) => c.category === cat).map((c) => {
              const built = BUILT.has(c.id)
              const on = all || a.courses.includes(c.id)
              if (!built)
                return (
                  <button
                    key={c.id}
                    className={`chip soon ${a.interest.includes(c.id) ? 'want' : ''}`}
                    onClick={() => toggleInterest(c.id)}
                    title="Coming soon. Tap if you'd like this one next."
                  >
                    {c.emoji} {c.short} <small>{a.interest.includes(c.id) ? '★ wanted' : 'soon'}</small>
                  </button>
                )
              return (
                <button key={c.id} className={`chip ${on ? 'on' : ''}`} disabled={all} onClick={() => toggle(c.id)}>
                  {c.emoji} {c.short} {on ? '✓' : promo.has(c.id) ? '🎁' : ''}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <p className="small muted">
        ★ Courses marked "soon" are being written now. Tap one to tell us you want it next; the most-wanted ones come first.
      </p>
    </>
  )
}
