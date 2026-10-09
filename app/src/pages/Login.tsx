import { useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID, renderGoogleButton, saveSession, type User } from '../lib/auth'
import { COURSES, unitQuestions } from '../content'
import { CED_TOPICS } from '../content/chem/ced'
import { DEFAULT_MASCOT, Mascot } from '../components/Mascot'
import { levelInfo } from '../lib/progress'

// The climb shown on the landing page: foundations at the bottom, exam-ready expert at the top.
const STEPS = [
  { label: 'Atoms', icon: '⚛️', caption: 'Start with the basics: atoms, moles and the periodic table.', xp: 0 },
  { label: 'Bonds', icon: '🔗', caption: 'Build real understanding, one 5-minute lesson at a time.', xp: 320 },
  { label: 'Reactions', icon: '⚗️', caption: 'Crack tough problems with tricks great teachers use.', xp: 1050 },
  { label: 'Equilibrium', icon: '⚖️', caption: 'Lock it all in with quick daily reviews.', xp: 2900 },
  { label: 'Expert', icon: '🏆', caption: 'Walk into the AP exam feeling like an expert.', xp: 5600 },
]
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

  useEffect(() => {
    if (reduce) return
    const last = stage === STEPS.length - 1
    const t = window.setTimeout(
      () => {
        if (last) {
          setWarp(true)
          setStage(0)
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

  return (
    <div className="journey" aria-hidden>
      <div className="hud">
        <span className="pill">
          ⭐ Level {lv.level} · {lv.title}
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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setShown(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
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
  { e: '🏆', t: 'Prove it', d: 'Checkpoints and practice exams built like the real AP exam.' },
]

export function LoginPage({ onUser }: { onUser: (u: User) => void }) {
  const btn = useRef<HTMLDivElement>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!btn.current || !GOOGLE_CLIENT_ID) return
    renderGoogleButton(btn.current, onUser).catch((e) => setErr(String(e.message ?? e)))
  }, [onUser])

  const guest = () => {
    const u: User = { sub: 'guest', email: 'guest@local', name: 'Friend', guest: true }
    saveSession(u)
    onUser(u)
  }

  const chem = COURSES[0]
  const units = chem.units.filter((u) => u.number > 0).length
  const lessons = chem.units.reduce((n, u) => n + u.lessons.length, 0)
  const questions = chem.units.reduce((n, u) => n + unitQuestions(u).length, 0)

  const signIn = (
    <div className="signin">
      {GOOGLE_CLIENT_ID ? <div ref={btn} className="gbtn" /> : null}
      {err && <p className="small" style={{ color: 'var(--oops)', margin: 0 }}>{err}</p>}
      {(!GOOGLE_CLIENT_ID || import.meta.env.DEV) && (
        <button className="btn secondary" onClick={guest}>
          Continue without Google {import.meta.env.DEV ? '(dev)' : ''}
        </button>
      )}
    </div>
  )

  return (
    <div className="landing">
      <div className="glow g1" />
      <div className="glow g2" />
      <header className="brand">
        <span className="brand-mark">⚗️</span> AP Learning
      </header>

      <section className="hero">
        <h1>
          From <span className="huh">“huh?”</span> to <span className="grad">AP expert</span>
        </h1>
        <p className="lede">Bite-size lessons, teacher tricks and friendly practice for AP Chemistry. One small step at a time.</p>
        <Journey />
        {signIn}
        <p className="small muted privacy">🔒 Sign in with Google and your progress follows you to every device. It works offline, too.</p>
      </section>

      <section className="how">
        <h2>How you become an expert</h2>
        <div className="how-list">
          {HOW.map((h, i) => (
            <Reveal key={h.t} delay={i * 90}>
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

      <Reveal>
        <section className="numbers">
          <div>
            <b>{units}</b>
            <span>units</span>
          </div>
          <div>
            <b>{Object.keys(CED_TOPICS).length}</b>
            <span>CED topics</span>
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
          Covers the full College Board AP Chemistry course (CED, effective Fall 2024). AP Statistics is coming next.
        </p>
      </Reveal>

      <Reveal>
        <section className="final">
          <Mascot look={DEFAULT_MASCOT} mood="cheer" size={110} />
          <h2>Ready for your first small step?</h2>
          <button className="btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Start learning ↑
          </button>
        </section>
      </Reveal>
      <footer className="small muted foot">AP® is a trademark of College Board, which is not affiliated with this app.</footer>
    </div>
  )
}
