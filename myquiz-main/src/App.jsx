import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import AdminEdit from './pages/AdminEdit'
import AdminIndex from './pages/AdminIndex'
import AdminManageUser from './pages/AdminManageUser'
import AdminScores from './pages/AdminScores'
import Landing from './pages/Landing'
import QuizPage from './pages/QuizPage'
import Quiz from './pages/Quiz'
import SignIn from './pages/SignIn'
import AdminLogin from './pages/AdminLogin'
import ScoreHistory from './pages/ScoreHistory'
import NotFound from './pages/NotFound'
import Diagnostic from './pages/Diagnostic'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
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
          <Route path="/admin-dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-edit" element={
            <ProtectedRoute>
              <AdminEdit />
            </ProtectedRoute>
          } />
          <Route path="/admin-manage-user" element={
            <ProtectedRoute>
              <AdminManageUser />
            </ProtectedRoute>
          } />
          <Route path="/admin-scores" element={
            <ProtectedRoute>
              <AdminScores />
            </ProtectedRoute>
          } />
          <Route path="/quiz-player" element={<QuizPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/score-history" element={<ScoreHistory />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}

      <AdminLogin show={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  )
}
