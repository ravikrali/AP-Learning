import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ageBlocked, devSignIn, GOOGLE_CLIENT_ID, renderGoogleButton, saveSession, type Birth, type SignInOptions, type User } from '../lib/auth'
import { BRAND } from '../../shared/brand'
import { MIN_AGE } from '../../shared/age'
import { Trademark } from '../components/Legal'
import { ErrataList } from './Errata'
import { BUILT, CATALOG, COURSES, unitQuestions } from '../content'
import { PLAN_ORDER, PLANS } from '../../shared/catalog'
import { planFeatures } from './Plans'
import { DEFAULT_MASCOT, Mascot } from '../components/Mascot'
import { levelInfo } from '../lib/progress'
import { leadVisitor, trackVisit } from '../lib/visit'
import type { VisitEvent } from '../../shared/visit'
import { PrivacyText } from './Support'

// The climb shown on the landing page: foundations at the bottom, exam-ready at the top.
// The words here describe the path, never a result: no promised scores or grades.
// Each time round, the bear climbs a different subject: the same path works for every AP course.
const STEPS = [
  { label: 'Basics', icon: '🌱', caption: 'Start with the basics, even if the subject feels brand new.', xp: 0 },
  { label: 'Get it', icon: '💡', caption: 'Build real understanding, one 5-minute lesson at a time.', xp: 320 },
  { label: 'Practice', icon: '🧩', caption: 'Crack tough questions with tricks great teachers use.', xp: 1050 },
  { label: 'Remember', icon: '🧠', caption: 'Lock it in with quick daily reviews and a study plan.', xp: 2900 },
  { label: 'Ready', icon: '🏆', caption: 'Walk into exam day knowing what to expect.', xp: 5600 },
]
const SUBJECTS = ['chem', 'stats', 'bio', 'calcab', 'apush', 'psych', 'phys1', 'csa', 'macro', 'world'].map((id) => CATALOG.find((c) => c.id === id)!)
const STEP_COLORS = ['#3cc7bc', '#5fb0f0', '#8d8df0', '#c58ee0', '#f2c443']
const VB_W = 360
const VB_H = 250
const stepGeom = (i: number) => {
  const w = 66
  const x = 8 + i * 70
  const top = 200 - i * 34
  return { x, w, top, cx: x + w / 2 }
}

function useReducedMotion() {
  const [reduce] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  return reduce
}

function Journey() {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(reduce ? STEPS.length - 1 : 0)
  const [warp, setWarp] = useState(false)
  const [loop, setLoop] = useState(0)

  useEffect(() => {
    if (reduce) return
    const last = stage === STEPS.length - 1
    const t = window.setTimeout(
      () => {
        if (last) {
          setWarp(true)
          setStage(0)
          setLoop((n) => n + 1)
        } else {
          setWarp(false)
          setStage(stage + 1)
        }
      },
      last ? 3400 : stage === 0 && warp ? 1300 : 1700,
    )
    return () => window.clearTimeout(t)
  }, [stage, reduce, warp])

  const s = STEPS[stage]
  const lv = levelInfo(s.xp)
  const g = stepGeom(stage)
  const top = stage === STEPS.length - 1
  const bearW = 17 // % of scene width
  const subject = SUBJECTS[loop % SUBJECTS.length]

  return (
    <div className="journey" aria-hidden>
      <div className="hud">
        <span className="pill" key={subject.id}>
          {subject.emoji} {subject.short} · Level {lv.level}
        </span>
        <div className="hud-bar">
          <div style={{ width: `${(stage / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      <div className="scene">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="steps">
          <defs>
            {STEP_COLORS.map((c, i) => (
              <linearGradient key={i} id={`stepg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={c} />
                <stop offset="1" stopColor={c} stopOpacity="0.55" />
              </linearGradient>
            ))}
          </defs>
          {STEPS.map((st, i) => {
            const { x, w, top: ty } = stepGeom(i)
            const lit = i <= stage
            return (
              <g key={st.label} className={`step ${lit ? 'lit' : ''}`}>
                <rect x={x} y={ty} width={w} height={VB_H - 8 - ty} rx={10} fill={lit ? `url(#stepg${i})` : 'var(--surface-2)'} stroke={lit ? STEP_COLORS[i] : 'var(--border)'} strokeWidth={2} />
                <text x={x + w / 2} y={VB_H - 34} textAnchor="middle" fontSize={20}>
                  {st.icon}
                </text>
                <text x={x + w / 2} y={VB_H - 16} textAnchor="middle" className="step-label" fill={lit ? '#12141c' : 'var(--muted)'}>
                  {st.label}
                </text>
              </g>
            )
          })}
          {top && (
            <g className="burst">
              {Array.from({ length: 10 }, (_, k) => {
                const a = (k / 10) * Math.PI * 2
                const { cx, top: ty } = stepGeom(4)
                return <circle key={k} cx={cx + Math.cos(a) * 46} cy={ty - 40 + Math.sin(a) * 34} r={3.5} fill={STEP_COLORS[k % 5]} />
              })}
            </g>
          )}
        </svg>

        <div
          className={`bear ${warp && stage === 0 ? 'warp' : ''}`}
          style={{
            width: `${bearW}%`,
            left: `${(g.cx / VB_W) * 100 - bearW / 2}%`,
            bottom: `${((VB_H - g.top) / VB_H) * 100 - 1}%`,
          }}
        >
          <div className="hop" key={stage}>
            <Mascot look={DEFAULT_MASCOT} mood={top ? 'cheer' : 'happy'} size={120} />
          </div>
          {stage > 0 && (
            <span className="xp-float" key={`xp${stage}`}>
              +XP
            </span>
          )}
        </div>
      </div>
      <p className="caption" key={stage}>
        {s.caption}
      </p>
    </div>
  )
}

/** Fades its content in when scrolled into view; `seen` also counts that this part of the page was reached. */
function Reveal({ children, delay = 0, seen }: { children: React.ReactNode; delay?: number; seen?: VisitEvent }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setShown(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          if (seen) trackVisit(seen)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return (
    <div ref={ref} className={`reveal-in ${shown ? 'in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const HOW = [
  { e: '📖', t: 'Learn it', d: 'Five-minute lessons that explain the why, not just the formula.' },
  { e: '🪄', t: 'Crack it', d: 'Smart tricks and common traps, the way great teachers explain them.' },
  { e: '🧠', t: 'Keep it', d: 'Quick flashcard reviews come back right before you would forget.' },
  { e: '🏆', t: 'Practice it', d: 'Checkpoints and practice exams that follow the format of the AP® Exam.' },
]

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 * The age question for a new account. It asks for the month and year only, and does not say
 * which answer is "right", so the honest answer is the easy one. Only the year is saved.
 */
function AgeSheet({ onDone }: { onDone: (b: Birth | null) => void }) {
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const thisYear = new Date().getFullYear()
  return (
    <div className="sheet-backdrop">
      <div className="sheet tip-sheet" role="dialog" aria-label="When were you born?">
        <h3>One quick question</h3>
        <p className="muted" style={{ marginTop: 4 }}>When were you born? We ask so we can follow the rules that protect younger students. Only the year is saved.</p>
        <div className="lead-form">
          <label>
            <span>Month</span>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Pick a month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Year</span>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Pick a year</option>
              {Array.from({ length: 100 }, (_, i) => thisYear - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" disabled={!month || !year} onClick={() => onDone({ year: Number(year), month: Number(month) })}>
            Continue
          </button>
          <button className="btn ghost" onClick={() => onDone(null)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/** "Tell me when my course is ready": the only place a visitor who has not signed in gives a name or email. */
function LeadForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [role, setRole] = useState<'parent' | 'student' | ''>('')
  const [age13, setAge13] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [err, setErr] = useState<string | null>(null)
  const soon = CATALOG.filter((c) => !BUILT.has(c.id))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setState('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined, course: course || undefined, role, age13, vid: (await leadVisitor()) ?? undefined }),
      })
      if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? 'Could not save that. Please try again.')
      trackVisit('lead')
      setState('done')
    } catch (e2) {
      setErr((e2 as Error).message === 'Failed to fetch' ? "Can't reach the server. Check your internet connection." : (e2 as Error).message)
      setState('idle')
    }
  }

  if (state === 'done')
    return (
      <section className="lead">
        <h2>You're on the list 🎉</h2>
        <p className="muted">We'll email {email} when {course ? soon.find((c) => c.id === course)?.title : 'new courses'} {course ? 'is' : 'are'} ready.</p>
        <p className="small muted">
          {role === 'parent' ? `We may also send you news about ${BRAND.name}. You can unsubscribe any time.` : 'That is the only email you will get from us.'}
        </p>
      </section>
    )
  return (
    <section className="lead">
      <h2>Waiting for another course?</h2>
      <p className="muted">Leave your email and we'll tell you the day it's ready. Your vote also decides which course is written next.</p>
      <form className="lead-form" onSubmit={submit}>
        <fieldset className="lead-role">
          <legend>I am a…</legend>
          <label className="check">
            <input type="radio" name="lead-role" required checked={role === 'parent'} onChange={() => setRole('parent')} />
            <span>Parent or guardian</span>
          </label>
          <label className="check">
            <input type="radio" name="lead-role" required checked={role === 'student'} onChange={() => setRole('student')} />
            <span>Student</span>
          </label>
        </fieldset>
        <label>
          <span>First name (optional)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="given-name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} autoComplete="email" inputMode="email" />
        </label>
        <label>
          <span>Course you want (optional)</span>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Any new course</option>
            {soon.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" required checked={age13} onChange={(e) => setAge13(e.target.checked)} />
          <span>I am {MIN_AGE} or older</span>
        </label>
        {err && <p className="small" style={{ color: 'var(--oops)', margin: 0 }}>{err}</p>}
        <button className="btn" disabled={state === 'sending'}>
          {state === 'sending' ? 'Saving…' : 'Tell me when it’s ready'}
        </button>
        <p className="tiny muted" style={{ margin: 0 }}>
          Students get one email, when the course they asked for is ready. Parents may also get news about {BRAND.name}, and can unsubscribe
          any time. Under {MIN_AGE}? Please ask a parent to fill this in.
        </p>
      </form>
    </section>
  )
}

export function LoginPage({ onUser }: { onUser: (u: User) => void }) {
  const btn = useRef<HTMLDivElement>(null)
  const [err, setErr] = useState<string | null>(null)
  const [privacy, setPrivacy] = useState(false)
  const [errata, setErrata] = useState(false)
  const [blocked, setBlocked] = useState(() => ageBlocked())
  // the age question, open while a new student is signing up
  const [ageAsk, setAgeAsk] = useState<((b: Birth | null) => void) | null>(null)

  // Count the visit (anonymous; see lib/visit.ts).
  useEffect(() => trackVisit('view'), [])

  const signedIn = useCallback(
    (u: User) => {
      trackVisit('signin', u.token)
      onUser(u)
    },
    [onUser],
  )
  const signInOpts = useMemo<SignInOptions>(
    () => ({
      askAge: () => new Promise<Birth | null>((resolve) => setAgeAsk(() => resolve)),
      onBlocked: () => setBlocked(true),
    }),
    [],
  )

  useEffect(() => {
    if (!btn.current || !GOOGLE_CLIENT_ID || blocked) return
    renderGoogleButton(btn.current, signedIn, signInOpts).catch((e) => setErr(String(e.message ?? e)))
  }, [signedIn, signInOpts, blocked])

  const guest = () => {
    const u: User = { sub: 'guest', email: 'guest@local', name: 'Friend', guest: true }
    saveSession(u)
    onUser(u)
  }

  const lessons = COURSES.reduce((n, c) => n + c.units.reduce((m, u) => m + u.lessons.length, 0), 0)
  const questions = COURSES.reduce((n, c) => n + c.units.reduce((m, u) => m + unitQuestions(u).length, 0), 0)

  const signIn = blocked ? (
    <div className="signin">
      <p className="card small" style={{ margin: 0, maxWidth: 360 }}>
        Sorry, {BRAND.name} is for students aged {MIN_AGE} and older for now, so we can't make an account yet. A parent or guardian can write to{' '}
        {BRAND.email} with any questions.
      </p>
    </div>
  ) : (
    <div className="signin">
      {GOOGLE_CLIENT_ID ? <div ref={btn} className="gbtn" /> : null}
      {err && <p className="small" style={{ color: 'var(--oops)', margin: 0 }}>{err}</p>}
      {(!GOOGLE_CLIENT_ID || import.meta.env.DEV) && (
        <button className="btn secondary" onClick={guest}>
          Continue without Google {import.meta.env.DEV ? '(dev)' : ''}
        </button>
      )}
      {import.meta.env.DEV && (
        // local testing: a brand-new account each time, so the age question can be tried
        <button className="btn ghost" onClick={() => void devSignIn(`student${Date.now()}@example.com`, signedIn, signInOpts)}>
          Sign up as a new student (dev)
        </button>
      )}
    </div>
  )

  return (
    <div className="landing">
      <div className="glow g1" />
      <div className="glow g2" />
      <header className="brand">
        <span className="brand-mark">{BRAND.mark}</span> {BRAND.name}
      </header>

      <section className="hero">
        <h1>
          From <span className="huh">“huh?”</span> to <span className="grad">“I’ve got this”</span>
        </h1>
        <p className="lede">Bite-size lessons, teacher tricks, a study plan built around your exam date and friendly practice for your AP® courses. One small step at a time.</p>
        <Journey />
        {signIn}
        <p className="small muted privacy">🔒 Sign in with Google and your progress follows you to every device. It works offline, too.</p>
      </section>

      <section className="how">
        <h2>How it works</h2>
        <div className="how-list">
          {HOW.map((h, i) => (
            <Reveal key={h.t} delay={i * 90} seen={i === 0 ? 'see_how' : undefined}>
              <div className="how-item">
                <span className="how-n">{i + 1}</span>
                <span className="how-e">{h.e}</span>
                <div>
                  <b>{h.t}</b>
                  <p>{h.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal seen="see_courses">
        <section className="numbers">
          <div>
            <b>{CATALOG.length}</b>
            <span>AP® courses</span>
          </div>
          <div>
            <b>{BUILT.size}</b>
            <span>ready now</span>
          </div>
          <div>
            <b>{lessons}</b>
            <span>lessons</span>
          </div>
          <div>
            <b>{questions}</b>
            <span>practice questions</span>
          </div>
        </section>
        <p className="small muted" style={{ textAlign: 'center', marginTop: 8 }}>
          Every course follows the College Board's published Course and Exam Description. Ready now: {COURSES.map((c) => c.title).join(', ')}.
          The rest are being written and checked one by one.
        </p>
        <div className="subjects">
          {CATALOG.map((c) => (
            <span key={c.id} className={BUILT.has(c.id) ? 'live' : ''}>
              {c.emoji} {c.short}
              {BUILT.has(c.id) ? ' ✓' : ''}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal seen="see_pricing">
        <section className="pricing">
          <h2>Start free</h2>
          <div className="plans" style={{ marginTop: 14 }}>
            {PLAN_ORDER.map((id) => (
              <div key={id} className={`plan-card ${id}`}>
                <div className="plan-name">{PLANS[id].name}</div>
                <div className="plan-price">
                  {PLANS[id].price ? `$${PLANS[id].price}` : 'Free'}
                  {PLANS[id].price > 0 && <span>/month</span>}
                </div>
                <ul>
                  {planFeatures(id).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="small muted center">No card needed for the free plan. Cancel a paid plan anytime.</p>
        </section>
      </Reveal>

      <Reveal>
        <LeadForm />
      </Reveal>

      <Reveal seen="see_final">
        <section className="final">
          <Mascot look={DEFAULT_MASCOT} mood="cheer" size={110} />
          <h2>Ready for your first small step?</h2>
          <button className="btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Start learning ↑
          </button>
        </section>
      </Reveal>
      <footer className="small muted foot">
        <Trademark className="" />
        We count visits anonymously to improve this page (not in the EU or UK).{' '}
        <button className="link-btn" onClick={() => setPrivacy(true)}>
          Privacy
        </button>
        {' · '}
        <button className="link-btn" onClick={() => setErrata(true)}>
          Corrections
        </button>
      </footer>
      {ageAsk && (
        <AgeSheet
          onDone={(b) => {
            ageAsk(b)
            setAgeAsk(null)
          }}
        />
      )}
      {errata && (
        <div className="sheet-backdrop" onClick={() => setErrata(false)}>
          <div className="sheet tip-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Corrections">
            <div className="row">
              <h3 className="grow">Corrections</h3>
              <button className="btn secondary" onClick={() => setErrata(false)}>
                Close
              </button>
            </div>
            <ErrataList />
          </div>
        </div>
      )}
      {privacy && (
        <div className="sheet-backdrop" onClick={() => setPrivacy(false)}>
          <div className="sheet tip-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Privacy">
            <div className="row">
              <h3 className="grow">Privacy & terms</h3>
              <button className="btn secondary" onClick={() => setPrivacy(false)}>
                Close
              </button>
            </div>
            <PrivacyText />
          </div>
        </div>
      )}
    </div>
  )
}
