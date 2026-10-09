// Admin tools: edit lesson content, lesson videos and YouTube links, feedback inbox, admins.
import { useEffect, useMemo, useState } from 'react'
import { builtInYoutube, COURSES } from '../content'
import type { Card, Lesson, Question } from '../content/types'
import { useAdmin } from './context'
import { api } from '../lib/api'
import { RichText } from '../lib/RichText'
import { checkBalanced } from '../lib/chem'
import {
  contentItem,
  contentItems,
  contentTarget,
  editableFields,
  originalOf,
  refreshContent,
  videoOverride,
  youtubeOverride,
  type YoutubeLink,
} from '../lib/overrides'
import { loadVideos, type VideoEntry } from '../components/bits'

// ---------- lesson picker ----------

function useLessonPicker() {
  const course = COURSES[0]
  const [unitId, setUnitId] = useState(course.units[0].id)
  const unit = course.units.find((u) => u.id === unitId) ?? course.units[0]
  const [lessonId, setLessonId] = useState(unit.lessons[0].id)
  const lesson = unit.lessons.find((l) => l.id === lessonId) ?? unit.lessons[0]
  const picker = (
    <div className="card stack">
      <label className="field">
        <span>Unit</span>
        <select
          value={unit.id}
          onChange={(e) => {
            const u = course.units.find((x) => x.id === e.target.value)!
            setUnitId(u.id)
            setLessonId(u.lessons[0].id)
          }}
        >
          {course.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.number === 0 ? u.title : `Unit ${u.number}: ${u.title}`}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Lesson</span>
        <select value={lesson.id} onChange={(e) => setLessonId(e.target.value)}>
          {unit.lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
  return { lesson, picker }
}

// ---------- content ----------

const CARD_LABEL: Record<Card['kind'], string> = {
  hook: '🤔 Hook',
  concept: '💡 Concept',
  example: '🧪 Worked example',
  try: '✋ Your turn',
  hack: '🪄 Trick',
  trap: '⚠️ Trap',
  frq: '✍️ FRQ corner',
  summary: '📌 Summary',
}

function preview(o: Record<string, unknown>): string {
  const s = String(o.title ?? o.prompt ?? o.front ?? o.body ?? o.problem ?? (o.points as string[] | undefined)?.[0] ?? '')
  return s.length > 70 ? `${s.slice(0, 70)}…` : s
}

export function ContentTab() {
  const { lesson, picker } = useLessonPicker()
  const [editing, setEditing] = useState<string | null>(null)

  if (editing) return <Editor key={editing} itemKey={editing} onClose={() => setEditing(null)} />

  const rows: { key: string; label: string; text: string }[] = [
    { key: `lesson:${lesson.id}`, label: '📘 Lesson title', text: lesson.title },
    ...lesson.cards.map((c, i) => ({
      key: `card:${lesson.id}:${i}`,
      label: CARD_LABEL[c.kind],
      text: preview(c.kind === 'try' ? (c.question as unknown as Record<string, unknown>) : (c as unknown as Record<string, unknown>)),
    })),
    ...lesson.check.map((q, i) => ({ key: `check:${lesson.id}:${i}`, label: `✅ Quick check ${i + 1}`, text: preview(q as never) })),
    ...lesson.flashcards.map((f, i) => ({ key: `flash:${lesson.id}:${i}`, label: `🃏 Flashcard ${i + 1}`, text: preview(f as never) })),
  ]

  return (
    <div className="stack">
      {picker}
      <p className="small muted" style={{ margin: 0 }}>
        Edits are published to everyone right away. Equations are balance-checked before saving, and you can always revert to the
        original text.
      </p>
      <div className="stack" style={{ gap: 8 }}>
        {rows.map((r) => (
          <button key={r.key} className="lesson-item admin-row" onClick={() => setEditing(r.key)}>
            <span className="grow" style={{ textAlign: 'left', minWidth: 0 }}>
              <span className="ced">{r.label}</span>
              <span style={{ display: 'block' }} className="ellipsis">
                {r.text}
              </span>
            </span>
            {contentItem(r.key) && <span className="weight">edited</span>}
            <span className="muted">✎</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const FIELD_LABEL: Record<string, string> = {
  title: 'Title',
  body: 'Text',
  problem: 'Problem',
  steps: 'Steps (one per box)',
  answer: 'Answer',
  points: 'Points (one per box)',
  prompt: 'Question',
  hint: 'Hint (shown after a wrong first try)',
  explain: 'Explanation',
  choices: 'Choices',
  front: 'Front',
  back: 'Back',
}

const NUMBERS = /\d+(?:[.,]\d+)?(?:\s*[×x]\s*10\^\{?[−-]?\d+\}?)?/g
const numbersIn = (s: string) => (s.match(NUMBERS) ?? []).join(' ')

type Draft = Record<string, unknown>

function textOf(d: Draft): string[] {
  const out: string[] = []
  for (const v of Object.values(d)) {
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) out.push(...v.filter((x): x is string => typeof x === 'string'))
    else if (v && typeof v === 'object') out.push(...textOf(v as Draft))
  }
  return out
}

/** What would stop a save, and what deserves a second look. */
function review(key: string, draft: Draft, original: Draft, target: Record<string, unknown>) {
  const errors: string[] = []
  const warnings: string[] = []
  for (const t of textOf(draft)) {
    for (const m of t.matchAll(/\[\[eq:([^\]]+)\]\]/g)) {
      try {
        if (!checkBalanced(m[1].trim()).ok) errors.push(`This equation is not balanced: ${m[1].trim()}`)
      } catch (e) {
        errors.push(`Can't read this equation: ${m[1].trim()} (${(e as Error).message})`)
      }
    }
  }
  const q = (key.startsWith('check:') ? target : (target.question as Record<string, unknown> | undefined)) as Question | undefined
  const qDraft = (key.startsWith('check:') ? draft : (draft.question as Draft | undefined)) ?? {}
  const qOrig = (key.startsWith('check:') ? original : (original.question as Draft | undefined)) ?? {}
  if (q?.type === 'mcq') {
    const ch = (qDraft.choices as string[]) ?? []
    if (ch.some((c) => !c.trim())) errors.push('Every choice needs text.')
    if (new Set(ch.map((c) => c.trim())).size !== ch.length) errors.push('Two choices are the same.')
  }
  if (q?.type === 'num' && numbersIn(String(qDraft.prompt ?? '')) !== numbersIn(String(qOrig.prompt ?? '')))
    errors.push(
      "This question's answer is calculated from the numbers in the question, so the numbers can't be changed here. Wording changes are fine.",
    )
  for (const [f, v] of Object.entries(draft)) {
    if (f === 'question') continue
    const before = original[f]
    const a = Array.isArray(v) ? v.join(' ') : String(v ?? '')
    const b = Array.isArray(before) ? before.join(' ') : String(before ?? '')
    if (typeof v === 'string' && !v.trim() && f !== 'hint' && f !== 'title') errors.push(`${FIELD_LABEL[f] ?? f} can't be empty.`)
    if (numbersIn(a) !== numbersIn(b))
      warnings.push(`Numbers changed in "${FIELD_LABEL[f] ?? f}". Please double-check every number and unit; the app can only re-check equations automatically.`)
  }
  if (target.kind === 'example' && JSON.stringify(draft) !== JSON.stringify(original))
    warnings.push('Worked examples are checked against independent calculations. If you changed the math, tell the developer so the check can be updated.')
  return { errors, warnings: [...new Set(warnings)] }
}

function currentValues(target: Record<string, unknown>): Draft {
  const d: Draft = {}
  for (const f of editableFields(target)) d[f] = Array.isArray(target[f]) ? [...(target[f] as string[])] : (target[f] ?? '')
  if (target.question) d.question = currentValues(target.question as Record<string, unknown>)
  return d
}

function FieldEditor({ name, value, onChange, choicesAnswer }: {
  name: string
  value: unknown
  onChange: (v: unknown) => void
  choicesAnswer?: { answer: number; setAnswer: (i: number) => void }
}) {
  const label = FIELD_LABEL[name] ?? name
  if (Array.isArray(value))
    return (
      <div className="field">
        <span>{label}</span>
        {(value as string[]).map((v, i) => (
          <div key={i} className="row" style={{ alignItems: 'flex-start', gap: 8 }}>
            {choicesAnswer && (
              <label className="small" style={{ paddingTop: 10, whiteSpace: 'nowrap' }} title="Correct answer">
                <input type="radio" checked={choicesAnswer.answer === i} onChange={() => choicesAnswer.setAnswer(i)} /> ✓
              </label>
            )}
            <textarea
              className="admin-input"
              rows={2}
              value={v}
              onChange={(e) => onChange((value as string[]).map((x, j) => (j === i ? e.target.value : x)))}
            />
          </div>
        ))}
        {(name === 'steps' || name === 'points') && (
          <div className="row" style={{ gap: 8 }}>
            <button className="btn secondary" onClick={() => onChange([...(value as string[]), ''])}>
              + Add
            </button>
            {(value as string[]).length > 1 && (
              <button className="btn ghost" onClick={() => onChange((value as string[]).slice(0, -1))}>
                Remove last
              </button>
            )}
          </div>
        )}
      </div>
    )
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        className="admin-input"
        rows={name === 'title' ? 1 : Math.min(10, Math.max(3, String(value).split('\n').length + 1))}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function Editor({ itemKey, onClose }: { itemKey: string; onClose: () => void }) {
  const target = contentTarget(itemKey)
  const original = useMemo(() => (originalOf(itemKey) ?? {}) as Draft, [itemKey])
  const [draft, setDraft] = useState<Draft>(() => (target ? currentValues(target) : {}))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [history, setHistory] = useState<{ id: number; changed_by: string; changed_at: string; data: string | null }[]>([])
  const edited = !!contentItem(itemKey)

  const loadHistory = () =>
    api<{ items: typeof history }>(`/api/admin/history?key=${encodeURIComponent(itemKey)}`)
      .then((r) => setHistory(r.items))
      .catch(() => undefined)
  useEffect(() => {
    void loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKey])

  if (!target) return <p>That item no longer exists.</p>
  const { errors, warnings } = review(itemKey, draft, original, target)
  const q = (itemKey.startsWith('check:') ? target : target.question) as Question | undefined

  async function save() {
    setBusy(true)
    setMsg(null)
    try {
      await api('/api/admin/content', { method: 'PUT', body: { key: itemKey, data: draft } })
      await refreshContent()
      setMsg('Published ✓')
      void loadHistory()
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function revert() {
    if (!confirm('Go back to the original built-in text?')) return
    setBusy(true)
    try {
      await api(`/api/admin/content?key=${encodeURIComponent(itemKey)}`, { method: 'DELETE' })
      await refreshContent()
      setDraft(currentValues(contentTarget(itemKey)!))
      setMsg('Back to the original ✓')
      void loadHistory()
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const fields = (d: Draft, set: (d: Draft) => void, question?: Question) =>
    Object.entries(d)
      .filter(([f]) => f !== 'question' && !(f === 'answer' && typeof d[f] === 'number'))
      .map(([f, v]) => (
        <FieldEditor
          key={f}
          name={f}
          value={v}
          onChange={(nv) => set({ ...d, [f]: nv })}
          choicesAnswer={
            f === 'choices' && question?.type === 'mcq'
              ? { answer: Number(d.answer), setAnswer: (i) => set({ ...d, answer: i }) }
              : undefined
          }
        />
      ))

  const previewText = textOf(draft).join('\n\n')

  return (
    <div className="stack">
      <div className="row">
        <button className="btn secondary" onClick={onClose}>
          ← Back
        </button>
        <span className="grow small muted ellipsis">{itemKey}</span>
        {edited && <span className="weight">edited</span>}
      </div>
      <div className="card stack">
        {fields(draft, setDraft, itemKey.startsWith('check:') ? q : undefined)}
        {draft.question !== undefined && (
          <>
            <b>Question</b>
            {fields(draft.question as Draft, (qd) => setDraft({ ...draft, question: qd }), q)}
          </>
        )}
        {q?.type === 'num' && (
          <p className="small muted" style={{ margin: 0 }}>
            Correct answer: {q.answer}
            {q.unit ? ` ${q.unit}` : ''} (calculated in code; not editable here)
          </p>
        )}
        <p className="small muted" style={{ margin: 0 }}>
          Formatting: **bold**, *italic*, {'{{H2SO4}}'} for formulas, [[eq: 2H2 + O2 -&gt; 2H2O]] for equations (balance-checked),
          x^{'{2}'} and K_{'{a}'}. A blank line starts a new paragraph; lines starting with "- " make a list.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="feedback hint">
          {errors.map((e) => (
            <div key={e}>⛔ {e}</div>
          ))}
        </div>
      )}
      {warnings.length > 0 && (
        <div className="feedback show">
          {warnings.map((w) => (
            <div key={w}>⚠️ {w}</div>
          ))}
        </div>
      )}

      <div className="section-title">Preview</div>
      <div className="card">
        <RichText text={previewText} />
      </div>

      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <button className="btn" disabled={busy || errors.length > 0} onClick={save}>
          {busy ? 'Saving…' : 'Publish'}
        </button>
        {edited && (
          <button className="btn secondary" disabled={busy} onClick={revert}>
            Revert to original
          </button>
        )}
      </div>
      {msg && <p className="small">{msg}</p>}

      {history.length > 0 && (
        <>
          <div className="section-title">History</div>
          <div className="card small stack" style={{ gap: 6 }}>
            {history.map((h) => (
              <div key={h.id} className="row">
                <span className="grow">{h.data === null ? '↩️ Reverted to original' : '✎ Edited'}</span>
                <span className="muted">
                  {h.changed_by} · {new Date(h.changed_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ---------- videos ----------

export function VideosTab() {
  const { lesson, picker } = useLessonPicker()
  return (
    <div className="stack">
      {picker}
      <VideoForm key={lesson.id} lesson={lesson} />
      <YoutubeForm key={`yt-${lesson.id}`} lesson={lesson} />
      <VideoList />
    </div>
  )
}

function VideoForm({ lesson }: { lesson: Lesson }) {
  const [base, setBase] = useState<VideoEntry | undefined>()
  const o = videoOverride(lesson.id)
  const [url, setUrl] = useState(o?.url ?? '')
  const [title, setTitle] = useState(o?.title ?? '')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    loadVideos().then((all) => {
      setBase(all[lesson.id])
      if (!videoOverride(lesson.id)) {
        setUrl(all[lesson.id]?.url ?? '')
        setTitle(all[lesson.id]?.title ?? '')
      }
    })
  }, [lesson.id])

  async function save(remove = false) {
    setMsg(null)
    const u = remove ? '' : url.trim()
    if (u && !/^https:\/\/\S+$/.test(u)) return setMsg('Use a full https:// link (YouTube links work best).')
    try {
      await api('/api/admin/content', { method: 'PUT', body: { key: `video:${lesson.id}`, data: { url: u, title: remove ? '' : title.trim() } } })
      await refreshContent()
      if (remove) setUrl('')
      setMsg(remove ? 'Video removed from this lesson ✓' : 'Video published ✓')
    } catch (e) {
      setMsg((e as Error).message)
    }
  }

  return (
    <div className="card stack">
      <b>Video for "{lesson.title}"</b>
      <label className="field">
        <span>Video link (YouTube or any https video URL)</span>
        <input className="admin-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtu.be/…" />
      </label>
      <label className="field">
        <span>Title (optional)</span>
        <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <p className="small muted" style={{ margin: 0 }}>
        It appears right after the lesson's first key-idea card. Tip: upload to YouTube as "Unlisted".
        {base && !o ? ' (Currently set in videos.json.)' : ''}
      </p>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn" onClick={() => save()} disabled={!url.trim()}>
          Publish video
        </button>
        {(o?.url || base) && (
          <button className="btn secondary" onClick={() => save(true)}>
            Remove video
          </button>
        )}
      </div>
      {msg && <p className="small">{msg}</p>}
    </div>
  )
}

function VideoList() {
  const items = contentItems().filter((c) => c.key.startsWith('video:') && (c.data as { url?: string }).url)
  if (!items.length) return null
  return (
    <>
      <div className="section-title">Lessons with videos</div>
      <div className="card small stack" style={{ gap: 6 }}>
        {items.map((c) => (
          <div key={c.key} className="row">
            <span className="grow">{c.key.slice(6)}</span>
            <span className="muted ellipsis" style={{ maxWidth: '60%' }}>
              {String((c.data as { url?: string }).url)}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function youtubeId(s: string): string | null {
  const t = s.trim()
  if (/^[\w-]{11}$/.test(t)) return t
  const m = t.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}

/** The "More ways to learn it" YouTube links under a lesson. */
function YoutubeForm({ lesson }: { lesson: Lesson }) {
  const custom = youtubeOverride(lesson.id)
  const [list, setList] = useState<YoutubeLink[]>(() => custom ?? builtInYoutube(lesson.id))
  const [link, setLink] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function add() {
    setMsg(null)
    const id = youtubeId(link)
    if (!id) return setMsg('That does not look like a YouTube video link.')
    if (list.some((v) => v.id === id)) return setMsg('Already in the list.')
    setBusy(true)
    try {
      // looks the video up on YouTube, so a wrong or private link is caught here
      const info = await api<{ title: string; channel: string }>(`/api/admin/youtube?id=${id}`)
      setList([...list, { id, title: info.title, channel: info.channel }])
      setLink('')
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function publish(reset = false) {
    setMsg(null)
    try {
      if (reset) await api(`/api/admin/content?key=${encodeURIComponent(`yt:${lesson.id}`)}`, { method: 'DELETE' })
      else await api('/api/admin/content', { method: 'PUT', body: { key: `yt:${lesson.id}`, data: { videos: list } } })
      await refreshContent()
      if (reset) setList(builtInYoutube(lesson.id))
      setMsg(reset ? 'Back to the built-in list ✓' : 'YouTube links published ✓')
    } catch (e) {
      setMsg((e as Error).message)
    }
  }

  return (
    <div className="card stack">
      <b>YouTube links: "More ways to learn it"</b>
      <p className="small muted" style={{ margin: 0 }}>
        Shown on the lesson's finish screen and in its quick tips. {custom ? 'Using your custom list.' : 'Using the built-in list.'}
      </p>
      {list.map((v, i) => (
        <div key={v.id} className="row" style={{ gap: 8 }}>
          <img src={`https://i.ytimg.com/vi/${v.id}/default.jpg`} alt="" width={64} height={48} style={{ borderRadius: 6 }} />
          <a className="grow small" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">
            <b>{v.title}</b>
            <span className="muted" style={{ display: 'block' }}>{v.channel}</span>
          </a>
          <button className="btn ghost" disabled={i === 0} onClick={() => setList([v, ...list.filter((x) => x.id !== v.id)])} aria-label="Move to top">
            ↑
          </button>
          <button className="btn ghost" onClick={() => setList(list.filter((x) => x.id !== v.id))} aria-label="Remove">
            ✕
          </button>
        </div>
      ))}
      <div className="row" style={{ gap: 8 }}>
        <input className="admin-input grow" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste a YouTube link" />
        <button className="btn secondary" disabled={busy || !link.trim()} onClick={add}>
          Add
        </button>
      </div>
      <p className="small muted" style={{ margin: 0 }}>Watch a video all the way through before adding it. Popular doesn't always mean correct.</p>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn" onClick={() => publish()}>
          Publish links
        </button>
        {custom && (
          <button className="btn secondary" onClick={() => publish(true)}>
            Use built-in list
          </button>
        )}
      </div>
      {msg && <p className="small" style={{ margin: 0 }}>{msg}</p>}
    </div>
  )
}

// ---------- feedback ----------

interface FeedbackRow {
  id: number
  email: string | null
  name: string | null
  kind: string
  mood: string | null
  body: string
  created_at: string
  resolved: number
}

export function FeedbackTab() {
  const [items, setItems] = useState<FeedbackRow[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const load = () =>
    api<{ items: FeedbackRow[] }>('/api/admin/feedback')
      .then((r) => setItems(r.items))
      .catch((e) => setErr(e.message))
  useEffect(() => {
    void load()
  }, [])

  async function toggle(f: FeedbackRow) {
    await api('/api/admin/feedback', { body: { id: f.id, resolved: !f.resolved } })
    void load()
  }

  if (err) return <p className="small">{err}</p>
  if (!items) return <p className="small muted">Loading…</p>
  if (!items.length) return <div className="empty">No feedback yet.</div>
  return (
    <div className="stack">
      {items.map((f) => (
        <div key={f.id} className="card" style={{ opacity: f.resolved ? 0.55 : 1 }}>
          <div className="row small">
            <b className="grow">
              {f.kind} {f.mood ?? ''}
            </b>
            <span className="muted">{new Date(f.created_at).toLocaleString()}</span>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', margin: '8px 0' }}>{f.body}</p>
          <div className="row small">
            <span className="grow muted">
              {f.name} · {f.email}
            </span>
            <button className="btn secondary" onClick={() => toggle(f)}>
              {f.resolved ? 'Reopen' : 'Mark done ✓'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------- admins ----------

export function AdminsTab() {
  const { user } = useAdmin()
  const [items, setItems] = useState<{ email: string; added_by: string; added_at: string; owner: boolean }[]>([])
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const load = () =>
    api<{ items: typeof items }>('/api/admin/admins')
      .then((r) => setItems(r.items))
      .catch((e) => setMsg(e.message))
  useEffect(() => {
    void load()
  }, [])

  async function add() {
    setMsg(null)
    try {
      await api('/api/admin/admins', { body: { email } })
      setEmail('')
      setMsg('Added ✓ They get admin access the next time they open the app.')
      void load()
    } catch (e) {
      setMsg((e as Error).message)
    }
  }

  async function remove(e: string) {
    if (!confirm(`Remove ${e} as an admin?`)) return
    try {
      await api(`/api/admin/admins?email=${encodeURIComponent(e)}`, { method: 'DELETE' })
      void load()
    } catch (err) {
      setMsg((err as Error).message)
    }
  }

  return (
    <div className="stack">
      <div className="card stack" style={{ gap: 8 }}>
        {items.map((a) => (
          <div key={a.email} className="row">
            <span className="grow">
              <b>{a.email}</b>
              <span className="small muted" style={{ display: 'block' }}>
                {a.owner ? 'Owner (always an admin)' : `Added by ${a.added_by}`}
              </span>
            </span>
            {!a.owner && a.email !== user.email.toLowerCase() && (
              <button className="btn ghost" onClick={() => remove(a.email)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="card stack">
        <label className="field">
          <span>Add an admin (their Google email)</span>
          <input className="admin-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@gmail.com" />
        </label>
        <button className="btn" disabled={!email.includes('@')} onClick={add}>
          Add admin
        </button>
        {msg && <p className="small" style={{ margin: 0 }}>{msg}</p>}
      </div>
    </div>
  )
}
