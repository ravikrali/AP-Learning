import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CourseGate } from './pages/Plans'
import { useStudyTimer } from './lib/track'
import { useApp } from './lib/app'
import { clearSession, loadSession, saveSession, type User } from './lib/auth'
import { api } from './lib/api'
import { startSync } from './lib/sync'
import { contentStore } from './lib/overrides'
import { LocalDB } from './lib/db'
import { AppContext } from './lib/app'
import { TabBar } from './components/bits'
import { LoginPage } from './pages/Login'
import { HomePage } from './pages/Home'
import { LearnPage, CoursePage } from './pages/Learn'
import { UnitPage } from './pages/Unit'
import { LessonPage } from './pages/Lesson'
import { CheckpointPage } from './pages/Checkpoint'
import { ReviewPage } from './pages/Review'
import { NotesPage } from './pages/Notes'
import { MePage } from './pages/Me'
import { FaqPage, FeedbackPage, HelpPage, PrivacyPage } from './pages/Support'
import { PlansPage } from './pages/Plans'
import { SchedulePage } from './pages/Schedule'
import { loadAccount, refreshAccount, accountStore, setPicks } from './lib/account'
import { COURSES } from './content'
import { ExamHub, FrqPage, McExamPage } from './pages/Exam'
import { SyllabusPage } from './pages/Syllabus'
import { getSetting } from './lib/progress'
import { applyTheme } from './lib/theme'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Only for courses in her plan, and counts active study time on practice screens. */
function Gated({ course, kind, children }: { course?: string; kind?: string; children: ReactNode }) {
  const { courseId, unitId } = useParams()
  const id = course ?? courseId ?? ''
  return (
    <CourseGate courseId={id}>
      {kind ? <Timed kind={kind} course={id} lesson={unitId ? `unit:${unitId}` : undefined}>{children}</Timed> : children}
    </CourseGate>
  )
}

function Timed({ kind, course, lesson, children }: { kind: string; course?: string; lesson?: string; children: ReactNode }) {
  const { db } = useApp()
  useStudyTimer(db, { kind, course, lesson })
  return <>{children}</>
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => loadSession())
  const [db, setDb] = useState<LocalDB | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let live = true
    loadAccount(user.sub)
    LocalDB.open(user.sub)
      .then((d) => {
        if (!live) return
        applyTheme(getSetting(d, 'theme', 'dark'))
        setDb(d)
      })
      .catch((e) => setError(String(e?.message ?? e)))
    return () => {
      live = false
    }
    // reopen only when a different person signs in, not when their session details change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.sub])

  // Re-render when admin content edits arrive.
  useSyncExternalStore(contentStore.subscribe, contentStore.get)

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((u) => {
      if (!u) return u
      const next = { ...u, ...patch }
      saveSession(next)
      return next
    })
  }, [])

  // Sync with the account whenever this device has a server session.
  const token = user?.token
  useEffect(() => {
    if (!db || !token) return
    return startSync(
      db,
      () => updateUser({ token: undefined }),
      () => applyTheme(getSetting(db, 'theme', 'dark')),
    )
  }, [db, token, updateUser])

  // Pick up admin changes (being added or removed as an admin) and the plan on each launch.
  useEffect(() => {
    if (!token) return
    api<{ isAdmin: boolean }>('/api/me')
      .then((r) => updateUser({ isAdmin: r.isAdmin }))
      .catch((e) => e?.status === 401 && updateUser({ token: undefined, isAdmin: false }))
    refreshAccount().catch(() => undefined)
  }, [token, updateUser])

  // Someone who already studied a course before plans existed keeps it as their free course.
  useEffect(() => {
    if (!db) return
    const a = accountStore.get()
    if (a.courses.length || a.plan === 'all') return
    const started = COURSES.find((c) => c.units.some((u) => u.lessons.some((l) => db.get('SELECT 1 AS x FROM lesson_progress WHERE lesson_id=?', [l.id]))))
    if (started) setPicks([started.id]).catch(() => undefined)
  }, [db, token])

  if (!user) return <LoginPage onUser={setUser} />
  if (error) return <div className="login"><h1>😕</h1><p>Couldn't open your saved data: {error}</p></div>
  if (!db) return <div className="login"><div className="logo">⚗️</div><p className="muted">Getting your stuff ready…</p></div>

  const signOut = () => {
    if (user.token) void api('/api/auth/logout', { body: {} }).catch(() => undefined)
    void db.flush().then(() => {
      clearSession()
      applyTheme('dark')
      setDb(null)
      setUser(null)
    })
  }

  return (
    <AppContext.Provider value={{ user, db, signOut, updateUser }}>
      <HashRouter>
        <ScrollTop />
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/course/:courseId/unit/:unitId" element={<Gated><UnitPage /></Gated>} />
            <Route path="/course/:courseId/unit/:unitId/checkpoint" element={<Gated kind="checkpoint"><CheckpointPage /></Gated>} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/review" element={<Timed kind="review"><ReviewPage /></Timed>} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/me" element={<MePage />} />
            <Route path="/me/help" element={<HelpPage />} />
            <Route path="/me/faq" element={<FaqPage />} />
            <Route path="/me/feedback" element={<FeedbackPage />} />
            <Route path="/me/privacy" element={<PrivacyPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/plan/:courseId" element={<SchedulePage />} />
            <Route path="/exam" element={<Gated course="chem"><ExamHub /></Gated>} />
            <Route path="/exam/mc/:format" element={<Gated course="chem" kind="exam"><McExamPage /></Gated>} />
            <Route path="/exam/frq/:frqId" element={<Gated course="chem" kind="exam"><FrqPage /></Gated>} />
            <Route path="/course/:courseId/syllabus" element={<Gated><SyllabusPage /></Gated>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <TabBar />
      </HashRouter>
    </AppContext.Provider>
  )
}
