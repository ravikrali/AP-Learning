import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findLesson } from '../content'
import { useApp } from '../lib/app'
import { NoteEditor, TopBar } from '../components/bits'

export function NotesPage() {
  const { db } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const rows = db
    .all('SELECT lesson_id, body, updated_at FROM notes ORDER BY updated_at DESC')
    .map((r) => ({ id: String(r.lesson_id), body: String(r.body), at: String(r.updated_at), ref: findLesson(String(r.lesson_id)) }))
    .filter((r) => r.ref)
    .filter((r) => !q || (r.body + r.ref!.lesson.title).toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <TopBar title="My notes" />
      <input
        className="note-area"
        style={{ minHeight: 0, marginBottom: 12 }}
        placeholder="🔍 Search notes"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {rows.length === 0 && (
        <div className="empty">
          <div className="e">📝</div>
          <p>{q ? 'No notes match.' : 'Notes you write in lessons (tap 📝) show up here. Writing ideas in your own words is one of the best ways to remember them.'}</p>
        </div>
      )}
      <div className="stack">
        {rows.map((r) => (
          <div key={r.id} className="card">
            <div className="row" onClick={() => setOpen(open === r.id ? null : r.id)} style={{ cursor: 'pointer' }}>
              <div className="grow">
                <b>{r.ref!.lesson.title}</b>
                <div className="small muted">
                  {r.ref!.unit.number === 0 ? r.ref!.unit.title : `Unit ${r.ref!.unit.number}`} · edited {new Date(r.at).toLocaleDateString()}
                </div>
              </div>
              <span className="muted">{open === r.id ? '▾' : '▸'}</span>
            </div>
            {open === r.id ? (
              <div style={{ marginTop: 10 }}>
                <NoteEditor lessonId={r.id} />
                <Link to={`/lesson/${r.id}`} className="small">
                  Open lesson →
                </Link>
              </div>
            ) : (
              <p className="small" style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', maxHeight: 66, overflow: 'hidden' }}>
                {r.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
