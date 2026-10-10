import { useState } from 'react'
import { TopBar } from '../components/bits'
import { Mascot } from '../components/Mascot'
import { useMascotLook } from '../components/Cheer'
import { useApp } from '../lib/app'
import { api, type ApiError } from '../lib/api'

/** Where feedback goes until the app has its own server. */
export const FEEDBACK_EMAIL = 'devt309@gmail.com'

const HOW_IT_WORKS: { e: string; t: string; d: string }[] = [
  { e: '🗺️', t: 'Follow the map', d: 'Learn → AP Chemistry shows every unit. Each unit goes Foundation → Core → Advanced. Nothing is locked, so you can jump to whatever your class is on.' },
  { e: '📖', t: 'Short lessons', d: 'Each lesson is a few small cards: a key idea, a worked example (tap to reveal one step at a time), a smart trick, a common trap, then a quick check.' },
  { e: '💡', t: 'Hints before answers', d: 'Wrong answer in a lesson? You get a hint and another try first. Only then is the full explanation shown.' },
  { e: '🃏', t: 'Daily review', d: 'Finishing a lesson adds its flashcards to Review. Cards you know come back later and later (1, 3, 7, 14, 30, then 60 days); ones you miss come back tomorrow. At most 15 a day.' },
  { e: '🎯', t: 'Unit checkpoints', d: '10 mixed questions from a unit, one try each, no timer. 90%+ earns 3 stars, 70%+ earns 2.' },
  { e: '📝', t: 'Practice exams', d: 'Multiple-choice sets weighted like the real exam, plus free-response questions you score yourself with a rubric.' },
  { e: '✏️', t: 'Notes', d: 'Tap 📝 in any lesson to write notes in your own words. Find them all under Review → Notes.' },
  { e: '🔖', t: 'Bookmarks', d: 'Tap the bookmark at the top of any topic to save it for later. Your bookmarks are under Review → Bookmarks.' },
  { e: '🔍', t: 'Search', d: 'Tap 🔍 on a course, unit or topic to search the lessons. Results open at the exact card.' },
  { e: '🧰', t: 'Tips, periodic table and glossary', d: 'The 💡 on a unit page lists every smart trick and trap for that unit. Under More (the three dots) you will find an interactive periodic table and a glossary of key terms.' },
  { e: '🔥', t: 'XP, levels and streaks', d: 'Earn XP for lessons, first-try answers and reviews. XP is never taken away. Missing one day never breaks your streak; only two missed days in a row do.' },
  { e: '🗓️', t: 'Study plan', d: 'Open a course and tap "Make my study plan". Answer six quick questions (exam date, study days, session length, time, where to start, review weeks) and get a day-by-day plan you can add to Google, Apple or Outlook Calendar.' },
  { e: '💪', t: 'Quick tips', d: 'If a topic is being tricky, a "Quick tip" button appears with the lesson’s smart tricks, common traps and popular videos. Tricky topics also show up on the Home screen until you have them.' },
]

export function HelpPage() {
  const look = useMascotLook()
  return (
    <div>
      <TopBar title="Help" back="/me" />
      <div className="card row" style={{ gap: 14 }}>
        <Mascot look={look} mood="happy" size={72} />
        <div className="grow">
          <b>Hi! Here's how to get the most out of the app.</b>
          <div className="small muted">Tip: 10–15 minutes most days beats a long cram session.</div>
        </div>
      </div>
      <div className="card stack" style={{ marginTop: 14 }}>
        {HOW_IT_WORKS.map((s) => (
          <div key={s.t} className="help-step">
            <span className="e">{s.e}</span>
            <div>
              <b>{s.t}</b>
              <p>{s.d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="section-title">Install on your phone</div>
      <div className="card small stack">
        <div>
          <b>iPhone (Safari):</b> tap the Share button, then <b>Add to Home Screen</b>.
        </div>
        <div>
          <b>Android (Chrome):</b> tap the ⋮ menu, then <b>Install app</b> (or Add to Home screen).
        </div>
        <div className="muted">Once installed, lessons work even without internet.</div>
      </div>
    </div>
  )
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is the content accurate?',
    a: "Lessons follow College Board's official AP Chemistry Course and Exam Description (effective Fall 2024), and each lesson lists the CED topics it covers. Every calculated answer and every chemical equation is re-checked by automated tests before each update. If you ever spot something that looks wrong, please tell us through Feedback.",
  },
  {
    q: 'Do I have to do the units in order?',
    a: 'No. The order is a suggestion (foundations first), but everything is open. Jump to the unit your class is studying any time.',
  },
  {
    q: 'What happens if I miss a day?',
    a: 'Nothing bad. One missed day never breaks your streak; only two missed days in a row start it over. XP is never taken away.',
  },
  {
    q: 'Where is my progress saved?',
    a: 'On this device first (so everything works offline), and in your private account when you sign in with Google. Sign in on another phone or computer and your progress, notes and review cards are all there. As a guest, progress stays on this device only.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes. After the app has loaded once (or been installed), lessons, review and practice all work without internet. Videos and Google sign-in need a connection.',
  },
  {
    q: 'How are the practice exams built?',
    a: 'Multiple-choice questions are drawn from every unit in proportion to the official exam weighting (for example, Unit 3 carries 18–22%). The free-response questions are scored with a point-by-point rubric, like the real exam.',
  },
  {
    q: 'Can I use a calculator on the real exam?',
    a: 'Yes. A calculator is allowed on both sections of the AP Chemistry exam, and you get the equations and constants sheet and a periodic table.',
  },
  {
    q: 'Why do flashcards come back on different days?',
    a: 'It is called spaced review. Seeing a fact again just before you would forget it makes it stick much longer than re-reading it many times in one night.',
  },
  {
    q: 'What do the plans include?',
    a: 'Free: any 1 course. Trio ($5.99/month): any 3 courses. Everything ($12.99/month): every course, including new ones as they are added. Every plan includes all lessons, checkpoints, practice exams, study plans and sync. Cancel anytime; you keep access until the end of the month you paid for.',
  },
  {
    q: 'Can I change which courses I picked?',
    a: 'You can add a course into a free slot any time. Swapping a course out is allowed once every 30 days. Your progress in a course is never deleted, so it is all there if you pick it again.',
  },
  {
    q: 'Which courses are coming?',
    a: 'All 21 AP courses listed under Learn. AP Chemistry is ready now. Tap a "coming soon" course to tell us you want it; the most-wanted courses are written first.',
  },
  {
    q: 'What do you do with my study data?',
    a: 'We record which questions you answer and how long you spend on each topic so the app can spot tricky topics, offer tips and show your study time. Combined totals across all students help us find lessons that need improving. We never sell data or show ads. See More → your profile → Privacy & terms.',
  },
  {
    q: 'Is this app made by College Board?',
    a: 'No. AP® is a trademark of College Board, which is not affiliated with this app.',
  },
]

export function FaqPage() {
  return (
    <div>
      <TopBar title="FAQ" back="/me" />
      <div className="card faq">
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

const KINDS = ['💡 Idea', '🐞 Something broke', '🧪 Content mistake', '💬 Other']
const MOODS = ['😍', '🙂', '😐', '🙁']

export function FeedbackPage() {
  const { user } = useApp()
  const look = useMascotLook()
  const [kind, setKind] = useState(KINDS[0])
  const [mood, setMood] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [via, setVia] = useState<'app' | 'email'>('app')
  const [error, setError] = useState<string | null>(null)

  async function send() {
    setError(null)
    if (user.token) {
      setBusy(true)
      try {
        await api('/api/feedback', { body: { kind, mood, body: text.trim() } })
        setVia('app')
        setSent(true)
        setText('')
        return
      } catch (e) {
        // Server unreachable: fall back to email below.
        if ((e as ApiError).status && (e as ApiError).status !== 401) {
          setError((e as Error).message)
          return
        }
      } finally {
        setBusy(false)
      }
    }
    setVia('email')
    const subject = `AP Learning feedback: ${kind.replace(/^\S+\s/, '')}`
    const body = [
      text.trim(),
      '',
      `Type: ${kind}`,
      mood ? `Feeling: ${mood}` : '',
      `From: ${user.name}`,
      `Sent from the AP Learning app, ${new Date().toLocaleDateString()}`,
    ]
      .filter((l, i) => i === 1 || l)
      .join('\n')
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div>
      <TopBar title="Feedback" back="/me" />
      {sent ? (
        <div className="cheer" style={{ paddingTop: 30 }}>
          <Mascot look={look} mood="cheer" size={120} />
          <div className="bubble">Thank you! Every message helps make the app better. 💛</div>
          {via === 'email' && (
            <p className="small muted" style={{ maxWidth: 340 }}>
              Your email app should have opened with the message ready. Tap Send there.
            </p>
          )}
          <button className="btn secondary" onClick={() => setSent(false)}>
            Write another
          </button>
        </div>
      ) : (
        <div className="card stack">
          <div>
            <b>How do you feel about the app?</b>
            <div className="moods" style={{ marginTop: 8 }}>
              {MOODS.map((m) => (
                <button key={m} className={mood === m ? 'on' : ''} onClick={() => setMood(m)} aria-pressed={mood === m}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <b>What is it about?</b>
            <div className="chips" style={{ marginTop: 8 }}>
              {KINDS.map((k) => (
                <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)} aria-pressed={kind === k}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="note-area"
            style={{ minHeight: 140 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              kind.includes('Content')
                ? 'Which lesson, and what looks wrong? A screenshot in the email helps too.'
                : 'Tell us anything: what you love, what is confusing, what you wish it had…'
            }
          />
          <button className="btn block" disabled={!text.trim() || busy} onClick={send}>
            {busy ? 'Sending…' : 'Send ✉️'}
          </button>
          {error && <p className="small" style={{ margin: 0, color: 'var(--oops)' }}>{error}</p>}
          {!user.token && (
            <p className="small muted" style={{ margin: 0 }}>
              This opens your email app with the message ready to send.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function PrivacyPage() {
  return (
    <div>
      <TopBar title="Privacy & terms" back="/me" />
      <PrivacyText />
    </div>
  )
}

/** The privacy summary, shared by the in-app page and the landing page. */
export function PrivacyText() {
  return (
      <div className="card small stack">
        <b>What we keep</b>
        <ul className="rich" style={{ paddingLeft: 20, margin: 0 }}>
          <li>Your Google name, email and profile picture (to sign you in), and the country you signed up from.</li>
          <li>Your progress: lessons, answers, flashcards, notes, settings and study plans, so they sync to your devices.</li>
          <li>Learning statistics: how long you actively study each topic and how often you get questions right, so the app can spot tricky topics and offer tips.</li>
          <li>Your plan and payment status. Card details are handled by Stripe and never reach us.</li>
          <li>
            Before you sign in: an anonymous visit count. A random ID is kept in your browser, with your country, the kind of device, the site or
            link that brought you here and which parts of the welcome page you saw. It holds no name or email unless you type them into the
            "Tell me when my course is ready" form. Browsers that send a "Do Not Track" or Global Privacy Control signal are not counted.
          </li>
        </ul>
        <b>How it is used</b>
        <ul className="rich" style={{ paddingLeft: 20, margin: 0 }}>
          <li>To run the app for you: sync, tips, study plans and calendar reminders.</li>
          <li>Combined totals (for example "most students find 7.7 hard") help us improve lessons. Admins can see account details to help with support.</li>
          <li>We never sell your data, never show ads, and never share it except with the services that run the app (Cloudflare for hosting, Google for sign-in, Stripe for payments).</li>
        </ul>
        <b>Guests</b>
        <p style={{ margin: 0 }}>Without signing in, your study data stays on your device. Only the anonymous visit count described above is sent to us.</p>
        <b>Your choices</b>
        <p style={{ margin: 0 }}>Email {FEEDBACK_EMAIL} to get a copy of your data or to delete your account.</p>
        <b>Subscriptions</b>
        <p style={{ margin: 0 }}>
          Paid plans renew monthly until cancelled. Cancel anytime from Plans; you keep access until the end of the month you paid for.
          A parent or guardian should make the purchase.
        </p>
        <p className="muted" style={{ margin: 0 }}>AP® is a trademark of College Board, which is not affiliated with this app.</p>
      </div>
  )
}
