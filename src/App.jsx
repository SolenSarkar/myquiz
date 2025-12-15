import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import AdminEdit from './pages/AdminEdit'
import AdminIndex from './pages/AdminIndex'
import AdminManageUser from './pages/AdminManageUser'
import AdminScores from './pages/AdminScores'
import Landing from './pages/Landing'
import QuizQ1 from './pages/QuizQ1'
import QuizQ2 from './pages/QuizQ2'
import QuizQ3 from './pages/QuizQ3'
import Quiz from './pages/Quiz'
import SignIn from './pages/SignIn'
import AdminLogin from './pages/AdminLogin'
import ScoreHistory from './pages/ScoreHistory'
import Header from './components/Header'
import Footer from './components/Footer'
import { auth } from './firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'

export default function App() {
  const [user, setUser] = useState(null)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (u) => {
      setUser(u || null)
    })
  }, [])

  async function handleSignOut() {
    if (!auth) return
    await firebaseSignOut(auth)
  }

  const isAdminRoute = location.pathname === '/admin-index' || location.pathname === '/admin-dashboard' || location.pathname === '/admin-edit' || location.pathname === '/admin-manage-user' || location.pathname === '/admin-scores'

  return (
    <div className="app-root">
      {!isAdminRoute && <Header user={user} onSignOut={handleSignOut} />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin-index" element={<AdminIndex />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-edit" element={<AdminEdit />} />
          <Route path="/admin-manage-user" element={<AdminManageUser />} />
          <Route path="/admin-scores" element={<AdminScores />} />
          <Route path="/quizq1" element={<QuizQ1 />} />
          <Route path="/quizq2" element={<QuizQ2 />} />
          <Route path="/quizq3" element={<QuizQ3 />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/score-history" element={<ScoreHistory />} />
          {/* Admin modal is rendered globally and opened from the header; remove navigation route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}

      <AdminLogin show={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  )
}
