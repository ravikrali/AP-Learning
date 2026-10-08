import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../lib/app'
import { getNote, saveNote, dueCount } from '../lib/progress'

export function TopBar({ title, back, right }: { title: string; back?: string | true; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <header className="topbar">
      {back && (
        <button className="icon-btn" aria-label="Back" onClick={() => (back === true ? nav(-1) : nav(back))}>
          ←
        </button>
      )}
      <h1>{title}</h1>
      {right}
    </header>
  )
}

export function TabBar() {
  const { db } = useApp()
  const { pathname } = useLocation()
  const due = dueCount(db)
  // Focus mode: no tab bar while inside a lesson or checkpoint.
  if (pathname.startsWith('/lesson/') || pathname.endsWith('/checkpoint') || pathname.startsWith('/exam/')) return null
  const tabs = [
    { to: '/', ico: '🏠', label: 'Home', end: true },
    { to: '/learn', ico: '🗺️', label: 'Learn' },
    { to: '/review', ico: '🃏', label: 'Review', dot: due },
    { to: '/notes', ico: '📝', label: 'Notes' },
    { to: '/me', ico: '🏅', label: 'Me' },
  ]
  return (
    <div className="tabbar">
      <nav>
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="ico" aria-hidden>
              {t.ico}
            </span>
            {t.label}
            {!!t.dot && <span className="dot">{t.dot}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Progress({ pct }: { pct: number }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  )
}

export function Confetti() {
  const pieces = useMemo(() => {
    const colors = ['#5b5bd6', '#13a89e', '#f2994a', '#e0a400', '#8e44ad', '#1f9d55']
    return Array.from({ length: 60 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: colors[i % colors.length],
      dur: 1.8 + Math.random() * 1.2,
    }))
  }, [])
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <i key={i} style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  )
}

/** Autosaving note editor (used in the lesson sheet and on the Notes page). */
export function NoteEditor({ lessonId, autoFocus }: { lessonId: string; autoFocus?: boolean }) {
  const { db } = useApp()
  const [text, setText] = useState(() => getNote(db, lessonId))
  const [saved, setSaved] = useState(true)
  const timer = useRef<number | undefined>(undefined)
  const latest = useRef(text)

  useEffect(() => {
    setText(getNote(db, lessonId))
    // flush pending note when switching lessons/unmounting
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current)
        saveNote(db, lessonId, latest.current)
      }
    }
  }, [db, lessonId])

  function onChange(v: string) {
    setText(v)
    latest.current = v
    setSaved(false)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      saveNote(db, lessonId, v)
      timer.current = undefined
      setSaved(true)
    }, 500)
  }

  return (
    <div>
      <textarea
        className="note-area"
        value={text}
        autoFocus={autoFocus}
        placeholder={'Write it in your own words: the key idea, a trick that helped, or a question to ask your teacher.'}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="small muted" style={{ textAlign: 'right' }}>
        {saved ? 'Saved on this device ✓' : 'Saving…'}
      </div>
    </div>
  )
}

export function NotesSheet({ lessonId, title, onClose }: { lessonId: string; title: string; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="My notes">
        <div className="row">
          <h3 className="grow">📝 My notes: {title}</h3>
          <button className="btn secondary" onClick={onClose}>
            Done
          </button>
        </div>
        <NoteEditor lessonId={lessonId} autoFocus />
      </div>
    </div>
  )
}

// ---------- optional lesson videos (configured in public/videos.json) ----------

export interface VideoEntry {
  url?: string
  src?: string
  title?: string
}

let videoCache: Promise<Record<string, VideoEntry>> | null = null
export function loadVideos(): Promise<Record<string, VideoEntry>> {
  if (!videoCache)
    videoCache = fetch(`${import.meta.env.BASE_URL}videos.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : {}))
      .then((j) => {
        const out: Record<string, VideoEntry> = {}
        for (const [k, v] of Object.entries(j as Record<string, VideoEntry>)) if (!k.startsWith('_') && (v.url || v.src)) out[k] = v
        return out
      })
      .catch(() => ({}))
  return videoCache
}

export function useVideo(lessonId: string): VideoEntry | undefined {
  const [v, setV] = useState<VideoEntry | undefined>()
  useEffect(() => {
    let live = true
    loadVideos().then((all) => live && setV(all[lessonId]))
    return () => {
      live = false
    }
  }, [lessonId])
  return v
}

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/)
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null
}

export function VideoPlayer({ video }: { video: VideoEntry }) {
  const src = video.src ? `${import.meta.env.BASE_URL}${video.src.replace(/^\//, '')}` : undefined
  const yt = video.url ? youtubeEmbed(video.url) : null
  return (
    <div className="video-wrap">
      {src ? (
        <video src={src} controls playsInline preload="metadata" />
      ) : (
        <iframe
          src={yt ?? video.url}
          title={video.title ?? 'Lesson video'}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  )
}
