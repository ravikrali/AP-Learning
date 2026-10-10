import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { contentStore, videoOverride } from '../lib/overrides'
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
  // Icons only: each one has a spoken label and a tooltip instead of visible text.
  const tabs: { to: string; icon: ReactNode; label: string; end?: boolean; dot?: number; also?: string[] }[] = [
    { to: '/', icon: <HomeIcon />, label: 'Home', end: true },
    { to: '/learn', icon: <LearnIcon />, label: 'Learn', also: ['/course', '/plan/', '/exam'] },
    { to: '/review', icon: <ReviewIcon />, label: 'Review: flashcards, bookmarks and notes', dot: due },
    { to: '/more', icon: <MoreIcon />, label: 'More: periodic table, glossary and your profile', also: ['/me', '/plans'] },
  ]
  return (
    <div className="tabbar">
      <nav aria-label="Main">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            aria-label={t.dot ? `${t.label} (${t.dot} cards due)` : t.label}
            title={t.label.split(':')[0]}
            className={({ isActive }) => (isActive || t.also?.some((p) => pathname.startsWith(p)) ? 'active' : '')}
          >
            <span className="ico" aria-hidden>
              {t.icon}
            </span>
            {!!t.dot && (
              <span className="dot" aria-hidden>
                {t.dot}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

// ---------- icons (simple line drawings that take the text color) ----------

function Svg({ children, size = 26 }: { children: ReactNode; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}

/** A house. */
export const HomeIcon = () => (
  <Svg>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5h4.5v-5.5h4v5.5h4.5V10" />
  </Svg>
)

/** An open book. */
export const LearnIcon = () => (
  <Svg>
    <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z" />
    <path d="M12 6.5V19.5" />
  </Svg>
)

/** Flashcards: two stacked cards. */
export const ReviewIcon = () => (
  <Svg>
    <rect x="3.5" y="7.5" width="13" height="12" rx="2.5" />
    <path d="M8 4.5h10a2.5 2.5 0 0 1 2.5 2.5v9" />
    <path d="m7.5 13.5 2 2 3.5-4" />
  </Svg>
)

/** Three dots. */
export const MoreIcon = () => (
  <Svg>
    <circle cx="5" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="19" cy="12" r="1.6" fill="currentColor" />
  </Svg>
)

export const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
    <path d="M6.5 3.5h11v17l-5.5-4-5.5 4Z" />
  </svg>
)

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

/** A lesson's video: one published from the Admin area wins over public/videos.json. */
export function useVideo(lessonId: string): VideoEntry | undefined {
  const [v, setV] = useState<VideoEntry | undefined>()
  const contentVersion = useSyncExternalStore(contentStore.subscribe, contentStore.get)
  useEffect(() => {
    const o = videoOverride(lessonId)
    if (o) {
      setV(o.url || o.src ? o : undefined)
      return
    }
    let live = true
    loadVideos().then((all) => live && setV(all[lessonId]))
    return () => {
      live = false
    }
  }, [lessonId, contentVersion])
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
