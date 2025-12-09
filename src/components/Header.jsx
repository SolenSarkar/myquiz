import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Header({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [scores, setScores] = useState([])
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
    try {
      const all = JSON.parse(localStorage.getItem('quizScores') || '[]')
      const filtered = user && user.email ? all.filter(s => s.email === user.email) : all
      // sort by date desc
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
      setScores(filtered)
    } catch (e) {
      setScores([])
    }
  }, [open, user])

  function clearHistory() {
    try {
      const all = JSON.parse(localStorage.getItem('quizScores') || '[]')
      const remaining = user && user.email ? all.filter(s => s.email !== user.email) : []
      localStorage.setItem('quizScores', JSON.stringify(remaining))
      setScores([])
    } catch (e) {
      console.error(e)
    }
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
                    <button className="btn small" onClick={() => setShowTable(true)} aria-label="Open full score history">Score history</button>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn small" onClick={clearHistory} aria-label="Clear history">Clear</button>
                    </div>
                  </div>

                  {scores.length === 0 ? (
                    <div className="no-scores">No score history yet.</div>
                  ) : showTable ? (
                    <div className="score-table-container">
                      <table className="score-table" role="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Quiz</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scores.map((s, i) => (
                            <tr key={i}>
                              <td>{new Date(s.date).toLocaleString()}</td>
                              <td>{s.quizTitle || 'Quiz'}</td>
                              <td>{s.score} / {s.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button className="btn small" onClick={() => setShowTable(false)}>Close</button>
                      </div>
                    </div>
                  ) : (
                    <div className="score-grid" role="list">
                      {scores.map((s, i) => (
                        <div key={i} className="score-card" role="listitem">
                          <div className="score-title">{s.quizTitle || 'Quiz'}</div>
                          <div className="score-value">{s.score} / {s.total}</div>
                          <div className="score-date">{new Date(s.date).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
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
