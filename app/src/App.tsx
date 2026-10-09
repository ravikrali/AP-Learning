import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import { FaqPage, FeedbackPage, HelpPage } from './pages/Support'
import { ExamHub, FrqPage, McExamPage } from './pages/Exam'
import { SyllabusPage } from './pages/Syllabus'
import { AdminPage } from './pages/Admin'
import { getSetting } from './lib/progress'
import { applyTheme } from './lib/theme'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => loadSession())
  const [db, setDb] = useState<LocalDB | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let live = true
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

  // Pick up admin changes (being added or removed as an admin) on each launch.
  useEffect(() => {
    if (!token) return
    api<{ isAdmin: boolean }>('/api/me')
      .then((r) => updateUser({ isAdmin: r.isAdmin }))
      .catch((e) => e?.status === 401 && updateUser({ token: undefined, isAdmin: false }))
  }, [token, updateUser])

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
            <Route path="/course/:courseId/unit/:unitId" element={<UnitPage />} />
            <Route path="/course/:courseId/unit/:unitId/checkpoint" element={<CheckpointPage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/me" element={<MePage />} />
            <Route path="/me/help" element={<HelpPage />} />
            <Route path="/me/faq" element={<FaqPage />} />
            <Route path="/me/feedback" element={<FeedbackPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/exam" element={<ExamHub />} />
            <Route path="/exam/mc/:format" element={<McExamPage />} />
            <Route path="/exam/frq/:frqId" element={<FrqPage />} />
            <Route path="/course/:courseId/syllabus" element={<SyllabusPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <TabBar />
      </HashRouter>
    </AppContext.Provider>
  )
}
