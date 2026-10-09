import { useState } from 'react'
import { TopBar } from '../components/bits'
import { Mascot } from '../components/Mascot'
import { useMascotLook } from '../components/Cheer'
import { useApp } from '../lib/app'

/** Where feedback goes until the app has its own server. */
export const FEEDBACK_EMAIL = 'devt309@gmail.com'

const HOW_IT_WORKS: { e: string; t: string; d: string }[] = [
  { e: '🗺️', t: 'Follow the map', d: 'Learn → AP Chemistry shows every unit. Each unit goes Foundation → Core → Advanced. Nothing is locked, so you can jump to whatever your class is on.' },
  { e: '📖', t: 'Short lessons', d: 'Each lesson is a few small cards: a key idea, a worked example (tap to reveal one step at a time), a smart trick, a common trap, then a quick check.' },
  { e: '💡', t: 'Hints before answers', d: 'Wrong answer in a lesson? You get a hint and another try first. Only then is the full explanation shown.' },
  { e: '🃏', t: 'Daily review', d: 'Finishing a lesson adds its flashcards to Review. Cards you know come back later and later (1, 3, 7, 14, 30, then 60 days); ones you miss come back tomorrow. At most 15 a day.' },
  { e: '🎯', t: 'Unit checkpoints', d: '10 mixed questions from a unit, one try each, no timer. 90%+ earns 3 stars, 70%+ earns 2.' },
  { e: '📝', t: 'Practice exams', d: 'Multiple-choice sets weighted like the real exam, plus free-response questions you score yourself with a rubric.' },
  { e: '✏️', t: 'Notes', d: 'Tap 📝 in any lesson to write notes in your own words. Find them all in the Notes tab.' },
  { e: '🔥', t: 'XP, levels and streaks', d: 'Earn XP for lessons, first-try answers and reviews. XP is never taken away. Missing one day never breaks your streak; only two missed days in a row do.' },
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
    a: 'In a private database on this device only. Use Me → Save a backup file now and then, and Restore to move your progress to another device.',
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

  function send() {
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
          <p className="small muted" style={{ maxWidth: 340 }}>
            Your email app should have opened with the message ready. Just tap Send there.
          </p>
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
          <button className="btn block" disabled={!text.trim()} onClick={send}>
            Send ✉️
          </button>
          <p className="small muted" style={{ margin: 0 }}>
            This opens your email app with the message ready to send.
          </p>
        </div>
      )}
    </div>
  )
}
