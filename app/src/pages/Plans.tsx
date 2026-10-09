import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CATALOG, CATEGORIES, PLAN_ORDER, PLANS, pickLimit, type PlanId } from '../../shared/catalog'
import { BUILT } from '../content'
import { useApp } from '../lib/app'
import {
  addCourse,
  billingPortal,
  cancelPlan,
  choosePlan,
  courseTitle,
  openable,
  pickProblem,
  refreshAccount,
  setPicks,
  toggleInterest,
  useAccount,
  type Account,
} from '../lib/account'
import { TopBar } from '../components/bits'

const money = (n: number) => (n === 0 ? 'Free' : `$${n.toFixed(2)}`)
const longDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '')

export function planFeatures(id: PlanId): string[] {
  const n = PLANS[id].courses
  return [
    n === null ? 'Every AP course, including new ones as they arrive' : `Any ${n} course${n === 1 ? '' : 's'} you choose`,
    'Every lesson, checkpoint and practice exam',
    'Study plan with calendar reminders',
    'Sync across your devices',
  ]
}

/** Shown instead of a course's screens when the plan doesn't include it. */
export function CourseGate({ courseId, children }: { courseId: string; children: ReactNode }) {
  const a = useAccount()
  const [err, setErr] = useState<string | null>(null)
  if (openable(a, courseId)) return <>{children}</>
  const limit = pickLimit(a.plan)
  const hasSlot = a.courses.length < limit
  const title = courseTitle(courseId)
  return (
    <div>
      <TopBar title={title} back="/learn" />
      <div className="empty">
        <div className="e">🔓</div>
        {hasSlot ? (
          <>
            <p>
              {a.plan === 'free' ? (
                <>
                  Your free plan includes <b>one course</b>. Make <b>{title}</b> yours?
                </>
              ) : (
                <>
                  You have {limit - a.courses.length} course slot{limit - a.courses.length === 1 ? '' : 's'} left. Add <b>{title}</b>?
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

function PlanCard({ id, a, busy, onChoose }: { id: PlanId; a: Account; busy: boolean; onChoose: (p: PlanId) => void }) {
  const { user } = useApp()
  const p = PLANS[id]
  const current = a.ownPlan === id
  let action: ReactNode
  if (current) action = <span className="pill">✓ Your plan</span>
  else if (id === 'free')
    action = a.paidPlan !== 'free' && !a.cancelAtPeriodEnd ? (
      <button className="btn ghost" disabled={busy} onClick={() => onChoose('free')}>
        Switch to free
      </button>
    ) : null
  else if (user.guest || !user.token) action = <span className="small muted">Sign in with Google to subscribe</span>
  else if (!a.billing) action = <span className="small muted">Coming soon</span>
  else
    action = (
      <button className="btn" disabled={busy} onClick={() => onChoose(id)}>
        {a.paidPlan !== 'free' ? `Switch to ${p.name}` : `Choose ${p.name}`}
      </button>
    )
  return (
    <div className={`plan-card ${id} ${current ? 'current' : ''}`}>
      <div className="plan-name">{p.name}</div>
      <div className="plan-price">
        {money(p.price)}
        {p.price > 0 && <span>/month</span>}
      </div>
      <ul>
        {planFeatures(id).map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="plan-action">{action}</div>
    </div>
  )
}

export function PlansPage() {
  const a = useAccount()
  const { user } = useApp()
  const nav = useNavigate()
  const { search } = useLocation()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const checkout = new URLSearchParams(search).get('checkout')

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
      if ((fresh && fresh.paidPlan !== 'free') || n > 10) {
        window.clearInterval(t)
        setMsg(fresh && fresh.paidPlan !== 'free' ? `🎉 You're on ${PLANS[fresh.paidPlan].name}. Pick your courses below.` : 'Payment received. Your plan will appear in a minute.')
        nav('/plans', { replace: true })
      }
    }, 2000)
    return () => window.clearInterval(t)
  }, [checkout, nav])

  async function choose(p: PlanId) {
    setBusy(true)
    setMsg(null)
    try {
      if (p === 'free') {
        await cancelPlan(false)
        setMsg(`Done. You keep ${PLANS[a.paidPlan].name} until ${longDate(a.periodEnd)}, then move to Free.`)
      } else {
        const url = await choosePlan(p)
        if (url) window.location.href = url
        else setMsg(`🎉 Switched to ${PLANS[p].name}. Any difference is prorated on your next bill.`)
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

  return (
    <div>
      <TopBar title="Plans & courses" back="/me" />
      {msg && <div className="card notice">{msg}</div>}

      <div className="plans">
        {PLAN_ORDER.map((id) => (
          <PlanCard key={id} id={id} a={a} busy={busy} onChoose={choose} />
        ))}
      </div>

      {a.compPlan && <p className="small muted center">🎁 {PLANS[a.compPlan].name} was given to you by AP Learning.</p>}
      {a.admin && <p className="small muted center">🛠️ As an admin you can open every course.</p>}
      {a.paidPlan !== 'free' && (
        <div className="card stack" style={{ marginTop: 12 }}>
          <div className="small">
            {a.cancelAtPeriodEnd
              ? `Your ${PLANS[a.paidPlan].name} plan ends on ${longDate(a.periodEnd)}.`
              : `${PLANS[a.paidPlan].name} renews on ${longDate(a.periodEnd)}.`}
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
        access until the end of the month you paid for.
      </p>

      <CoursePicker />
      {user.guest && (
        <p className="small muted center">As a guest your course choice is saved on this device only.</p>
      )}
    </div>
  )
}

export function CoursePicker() {
  const a = useAccount()
  const [err, setErr] = useState<string | null>(null)
  const limit = pickLimit(a.plan)
  const all = a.plan === 'all'

  async function toggle(id: string) {
    setErr(null)
    const next = a.courses.includes(id) ? a.courses.filter((c) => c !== id) : [...a.courses, id]
    const problem = pickProblem(a, next)
    if (problem) return setErr(problem)
    try {
      await setPicks(next)
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  return (
    <>
      <div className="section-title">
        {all ? 'Every course is included' : `Your courses · ${a.courses.length} of ${limit}`}
      </div>
      {!all && (
        <p className="small muted" style={{ marginTop: -4 }}>
          Tap a course to add it. You can swap a course out once every 30 days.
          {a.switchAvailableAt && ` Next swap: ${longDate(a.switchAvailableAt)}.`}
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
                  {c.emoji} {c.short} {on && '✓'}
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
