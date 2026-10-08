import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { clearSession, loadSession, type User } from './lib/auth'
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
import { ExamHub, FrqPage, McExamPage } from './pages/Exam'
import { SyllabusPage } from './pages/Syllabus'
import { getSetting } from './lib/progress'

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
        {
          const t = getSetting(d, 'theme', 'auto')
          if (t !== 'auto') document.documentElement.dataset.theme = t
        }
        setDb(d)
      })
      .catch((e) => setError(String(e?.message ?? e)))
    return () => {
      live = false
    }
  }, [user])

  if (!user) return <LoginPage onUser={setUser} />
  if (error) return <div className="login"><h1>😕</h1><p>Couldn't open your saved data: {error}</p></div>
  if (!db) return <div className="login"><div className="logo">⚗️</div><p className="muted">Getting your stuff ready…</p></div>

  const signOut = () => {
    void db.flush().then(() => {
      clearSession()
      setDb(null)
      setUser(null)
    })
  }

  return (
    <AppContext.Provider value={{ user, db, signOut }}>
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
