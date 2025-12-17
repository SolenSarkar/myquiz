import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllScores } from '../api'
import '../admin/css/admin.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [editMode, setEditMode] = useState(null)
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [loading, setLoading] = useState(true)
  const [usingLocalScores, setUsingLocalScores] = useState(false)

  useEffect(() => {
    // Check session authentication
    try {
      const isAuth = sessionStorage.getItem('myquiz_admin_auth') === '1'
      if (!isAuth) {
        // Not authenticated - redirect to admin login
        navigate('/admin-index')
        return
      }
    } catch (e) {
      navigate('/admin-index')
      return
    }

    // Load scores from backend API
    const fetchScores = async () => {
      try {
        setLoading(true)
        setUsingLocalScores(false)
        const response = await getAllScores()
        const payload = response?.data
        const apiScores = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.scores)
            ? payload.scores
            : Array.isArray(payload?.data)
              ? payload.data
              : []
        const sorted = [...apiScores].sort((a, b) => new Date(b.date) - new Date(a.date))
        setScores(sorted)
      } catch (err) {
        console.error('Failed to load scores:', err)
        // Fallback to localStorage if backend unavailable
        try {
          const storedScores = JSON.parse(localStorage.getItem('quizScores') || '[]')
          storedScores.sort((a, b) => new Date(b.date) - new Date(a.date))
          setScores(storedScores)
          setUsingLocalScores(true)
        } catch (e) {
          console.error('Failed to load local scores:', e)
          setScores([])
          setUsingLocalScores(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchScores()
  }, [])

  function handleSignOut() {
    try {
      sessionStorage.removeItem('myquiz_admin_auth')
      sessionStorage.removeItem('admin_token')
      sessionStorage.removeItem('admin_email')
    } catch (e) {
      console.error(e)
    }
    navigate('/')
  }

  return (
    <div className="admin-dashboard" style={{ boxSizing: 'border-box', fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif', background: '#221636', color: '#e6eef8' }}>
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <a className="brand" href="#home" style={{ fontWeight: '700', textDecoration: 'none', fontSize: '18px', color: '#4f9cff' }}>
            MyQuiz Admin
          </a>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="/admin-edit">Edit</a>
            <a href="/admin-scores">Scores</a>
          </div>
        </div>
        <div className="nav-right">
          <button onClick={handleSignOut} className="btn" style={{ background: 'transparent', border: '2px solid rgba(79, 156, 255, 0.22)', color: '#4f9cff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }} >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="container" style={{ maxWidth: '1100px', margin: '28px auto', padding: '0 20px' }}>
        <section className="hero" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))', padding: '36px', borderRadius: '10px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6)', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#e6eef8' }}>Welcome, Admin</h1>
          <p style={{ color: '#9aa3b2', marginBottom: '16px' }}>Use the links in the navigation to manage quizzes and view scores.</p>
          <div className="actions" style={{ display: 'inline-block', marginRight: '10px', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none' }}>
            <a href="/admin-edit" className="primary" style={{ background: '#4f9cff', color: '#07102b' }}>
              Go to Edit
            </a>
            <a href="/admin-scores" className="secondary" style={{ background: 'transparent', color: '#4f9cff', border: '2px solid rgba(79, 156, 255, 0.12)' }}>
              View Scores
            </a>
          </div>
        </section>

        <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '8px' }}>
          <div className="card" style={{ background: '#022b45', padding: '18px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)' }}>
            <h3 style={{ marginBottom: '8px', color: '#e6eef8' }}>Create / Edit Quizzes</h3>
            <p style={{ color: '#7b8593', marginBottom: '12px' }}>Manage quizzes, add questions, and configure timing.</p>
            <a href="/admin-edit" className="btn-link" style={{ display: 'inline-block', padding: '8px 12px', background: 'transparent', border: '2px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', textDecoration: 'none', color: '#4f9cff' }}>
              Open Editor
            </a>
          </div>
          <div className="card" style={{ background: '#022b45', padding: '18px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)' }}>
            <h3 style={{ marginBottom: '8px', color: '#e6eef8' }}>Manage Users</h3>
            <p style={{ color: '#7b8593', marginBottom: '12px' }}>Update admin email and password credentials.</p>
            <a href="/admin-manage-user" className="btn-link" style={{ display: 'inline-block', padding: '8px 12px', background: 'transparent', border: '2px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', textDecoration: 'none', color: '#4f9cff' }}>
              Manage Users
            </a>
          </div>
        </div>

        <section id="scores" className="card" style={{ background: '#022b45', marginTop: '18px', padding: '18px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)' }}>
          <h3 style={{ marginBottom: '8px', color: '#e6eef8' }}>Leaderboard & Scores</h3>
          <p style={{ color: '#7b8593', marginBottom: '12px' }}>
            Review player scores and export leaderboard data.
          </p>
          <p style={{ color: '#9aa3b2', marginBottom: '16px', fontSize: '0.9rem' }}>
            Source: {usingLocalScores ? 'Local cache (API unavailable)' : 'Database API'}
          </p>

          {loading ? (
            <div style={{ color: '#9aa3b2', padding: '20px', textAlign: 'center' }}>
              Loading scores...
            </div>
          ) : scores.length === 0 ? (
            <div style={{ color: '#9aa3b2' }}>No scores yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Rank</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>User</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Quiz</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Score</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.slice(0, 5).map((s, i) => (
                  <tr key={s._id || s.id || i}>
                    <td style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{i + 1}</td>
                    <td style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      {s.email || 'guest'}
                    </td>
                    <td style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      {s.quizTitle || 'Quiz'}
                    </td>
                    <td style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      {s.score} / {s.total || ''}
                    </td>
                    <td style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      {s.date ? new Date(s.date).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {scores.length > 5 && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <a 
                href="/admin-scores" 
                style={{ 
                  color: '#4f9cff', 
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}
              >
                View all {scores.length} scores →
              </a>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer" style={{ margin: '28px auto', textAlign: 'center', color: '#9aa3b2', padding: '12px' }}>
        <small>© MyQuiz — Admin Panel</small>
      </footer>
    </div>
  )
}