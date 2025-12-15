import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getScores } from '../api'
import { auth } from '../firebase'

export default function ScoreHistory() {
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingLocalScores, setUsingLocalScores] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!auth?.currentUser) {
      navigate('/signin')
      return
    }
    setUser(auth.currentUser)
  }, [navigate])

  useEffect(() => {
    if (!user) return

    const loadScores = async () => {
      setLoading(true)
      setUsingLocalScores(false)
      try {
        const res = await getScores(user.email)
        const payload = res?.data
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
        // fallback to local history when API unavailable
        try {
          const all = JSON.parse(localStorage.getItem('quizScores') || '[]')
          const filtered = user.email ? all.filter(s => s.email === user.email) : all
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
          setScores(filtered)
          setUsingLocalScores(true)
        } catch (e) {
          setScores([])
          setUsingLocalScores(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadScores()
  }, [user])

  function clearHistory() {
    if (!usingLocalScores) return
    const confirmed = window.confirm('Are you sure you want to clear your score history? This cannot be undone.')
    if (!confirmed) return
    try {
      const all = JSON.parse(localStorage.getItem('quizScores') || '[]')
      const remaining = user?.email ? all.filter(s => s.email !== user.email) : []
      localStorage.setItem('quizScores', JSON.stringify(remaining))
      setScores([])
    } catch (e) {
      console.error('Failed to clear history:', e)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#221636', color: '#e6eef8', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: '#e6eef8' }}>Score History</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            {usingLocalScores && scores.length > 0 && (
              <button 
                onClick={clearHistory} 
                className="btn"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255, 77, 79, 0.3)',
                  color: '#ff6b6b',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Clear History
              </button>
            )}
            <button 
              onClick={() => navigate('/')} 
              className="btn"
              style={{
                background: 'transparent',
                border: '2px solid rgba(97, 228, 160, 0.9)',
                color: '#6ee7b7',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="card" style={{ background: '#022b45', padding: '24px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)' }}>
          <p style={{ color: '#9aa3b2', marginBottom: '16px', fontSize: '0.9rem' }}>
            Source: {usingLocalScores ? 'Local cache (API unavailable)' : 'Database API'}
          </p>

          {loading ? (
            <div style={{ color: '#9aa3b2', padding: '20px', textAlign: 'center' }}>
              Loading scores...
            </div>
          ) : scores.length === 0 ? (
            <div style={{ color: '#9aa3b2', padding: '20px', textAlign: 'center' }}>No score history yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Rank</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Quiz</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Score</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={s._id || s.id || i}>
                    <td style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{i + 1}</td>
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
        </div>
      </div>
    </div>
    )
}
