import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getScores, getAllScores } from '../api'

export default function Header({ user, onSignOut }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scores, setScores] = useState([])
  const [loadingScores, setLoadingScores] = useState(false)
  const [usingLocalScores, setUsingLocalScores] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  useEffect(() => {
    if (!open) return
    let active = true

    const loadScores = async () => {
      setLoadingScores(true)
      setUsingLocalScores(false)
      try {
        const res = user && user.email ? await getScores(user.email) : await getAllScores()
        const payload = res?.data
        const apiScores = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.scores)
            ? payload.scores
            : Array.isArray(payload?.data)
              ? payload.data
              : []
        if (!active) return
        const sorted = [...apiScores].sort((a, b) => new Date(b.date) - new Date(a.date))
        setScores(sorted)
      } catch (err) {
        if (!active) return
        // fallback to local history when API unavailable
        try {
          const all = JSON.parse(localStorage.getItem('quizScores') || '[]')
          const filtered = user && user.email ? all.filter(s => s.email === user.email) : all
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
          setScores(filtered)
          setUsingLocalScores(true)
        } catch (e) {
          setScores([])
          setUsingLocalScores(true)
        }
      } finally {
        if (active) setLoadingScores(false)
      }
    }

    loadScores()

    return () => {
      active = false
    }
  }, [open, user])

  function handleShowFullHistory() {
    setOpen(false)
    navigate('/score-history')
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">MyQuizApp</Link>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/quiz">Quiz</Link></li>
            <li>
              <a href="/admin-index" target="_blank" rel="noopener noreferrer" className="btn small">AdminLogin</a>
            </li>
            {user ? null : (<li><Link to="/signin" className="btn small">Sign In</Link></li>)}
          </ul>
        </nav>

        <div className="header-user" ref={ref}>
          {user ? (
            <div className="user-dropdown">
              <button
                className="user-btn"
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
              >
                <span className="user-label">User</span>
                <span className="chev" aria-hidden>▾</span>
              </button>

              <div className={`user-menu ${open ? 'open' : ''}`} role="menu">
                <div className="user-name">{user.displayName}</div>

                <div className="score-section">
                  <div className="score-header">
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#e6eef8' }}>Latest Score</h4>
                  </div>

                  {loadingScores ? (
                    <div className="no-scores">Loading scores...</div>
                  ) : scores.length === 0 ? (
                    <div className="no-scores">No score history yet.</div>
                  ) : (
                    <>
                      <div className="score-card" role="listitem" style={{ marginBottom: '12px' }}>
                        <div className="score-title">{scores[0].quizTitle || 'Quiz'}</div>
                        <div className="score-value">{scores[0].score} / {scores[0].total}</div>
                        <div className="score-date">{new Date(scores[0].date).toLocaleString()}</div>
                      </div>
                      <button 
                        className="btn small" 
                        onClick={handleShowFullHistory}
                        style={{ width: '100%', marginTop: '8px' }}
                        aria-label="Show full score history"
                      >
                        Show Full History
                      </button>
                    </>
                  )}
                </div>

                <div className="user-actions">
                  <button className="btn" onClick={onSignOut}>Sign out</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
