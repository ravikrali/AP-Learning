// Corrections: every mistake found in a lesson and what was changed. Public, so it is shown on
// the welcome page (no sign-in) as well as under More.
import { useEffect, useState } from 'react'
import { findLesson } from '../content'
import { TopBar } from '../components/bits'
import { Trademark } from '../components/Legal'

interface Erratum {
  id: number
  lesson_id: string
  card: string | null
  note: string
  published_at: string
}

/** "card:3" → "card 4", "check:1" → "quick check 2". */
export function cardRefLabel(ref: string | null): string {
  if (!ref) return ''
  if (ref === 'video') return 'video'
  const [kind, n] = ref.split(':')
  return `${kind === 'check' ? 'quick check' : 'card'} ${Number(n) + 1}`
}

export function ErrataList() {
  const [items, setItems] = useState<Erratum[] | null>(null)
  const [err, setErr] = useState(false)
  useEffect(() => {
    fetch('/api/errata')
      .then((r) => (r.ok ? (r.json() as Promise<{ items: Erratum[] }>) : Promise.reject(new Error())))
      .then((d) => setItems(d.items))
      .catch(() => setErr(true))
  }, [])

  return (
    <div className="stack">
      <p className="small muted" style={{ margin: 0 }}>
        When someone finds a mistake in a lesson, we fix it and list it here. Spotted one? Tap <b>Report an error</b> under any lesson card.
      </p>
      {err ? (
        <div className="card small">The list needs an internet connection. Please try again when you are online.</div>
      ) : !items ? (
        <div className="card small muted">Loading…</div>
      ) : !items.length ? (
        <div className="card small">No corrections so far.</div>
      ) : (
        items.map((e) => {
          const ref = findLesson(e.lesson_id)
          return (
            <div key={e.id} className="card small">
              <div className="row">
                <b className="grow">{ref ? ref.lesson.title : e.lesson_id}</b>
                <span className="muted">{new Date(e.published_at).toLocaleDateString()}</span>
              </div>
              <div className="muted">
                {[ref?.course.title, ref && ref.lesson.ced.length ? `CED ${ref.lesson.ced.join(', ')}` : '', cardRefLabel(e.card)].filter(Boolean).join(' · ')}
              </div>
              <p style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{e.note}</p>
            </div>
          )
        })
      )}
      <Trademark />
    </div>
  )
}

export function ErrataPage() {
  return (
    <div>
      <TopBar title="Corrections" back="/more" />
      <ErrataList />
    </div>
  )
}
