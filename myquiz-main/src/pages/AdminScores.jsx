import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllScores } from '../api'
import '../admin/css/admin.css'

export default function AdminScores() {
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingLocalScores, setUsingLocalScores] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const scoresPerPage = 10

  useEffect(() => {
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

  // Calculate pagination
  const indexOfLastScore = currentPage * scoresPerPage
  const indexOfFirstScore = indexOfLastScore - scoresPerPage
  const currentScores = scores.slice(indexOfFirstScore, indexOfLastScore)
  const totalPages = Math.ceil(scores.length / scoresPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'transparent',
            border: '1px solid rgba(79, 156, 255, 0.22)',
            color: '#4f9cff',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(<span key="dots1" style={{ margin: '0 4px', color: '#9aa3b2' }}>...</span>)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: currentPage === i ? '#4f9cff' : 'transparent',
            border: '1px solid rgba(79, 156, 255, 0.22)',
            color: currentPage === i ? '#07102b' : '#4f9cff',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: currentPage === i ? '600' : 'normal'
          }}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" style={{ margin: '0 4px', color: '#9aa3b2' }}>...</span>)
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'transparent',
            border: '1px solid rgba(79, 156, 255, 0.22)',
            color: '#4f9cff',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {totalPages}
        </button>
      )
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'transparent',
            border: '1px solid rgba(79, 156, 255, 0.22)',
            color: currentPage === 1 ? '#9aa3b2' : '#4f9cff',
            borderRadius: '6px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'transparent',
            border: '1px solid rgba(79, 156, 255, 0.22)',
            color: currentPage === totalPages ? '#9aa3b2' : '#4f9cff',
            borderRadius: '6px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard" style={{ boxSizing: 'border-box', fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif', background: '#221636', color: '#e6eef8', minHeight: '100vh' }}>
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <a className="brand" onClick={() => navigate('/admin-dashboard')} style={{ fontWeight: '700', textDecoration: 'none', fontSize: '18px', color: '#4f9cff', cursor: 'pointer' }}>
            MyQuiz Admin
          </a>
        </div>
        <div className="nav-right">
          <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ background: 'transparent', border: '2px solid rgba(79, 156, 255, 0.22)', color: '#4f9cff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="container" style={{ maxWidth: '1200px', margin: '28px auto', padding: '0 20px' }}>
        <section className="hero" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))', padding: '36px', borderRadius: '10px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6)', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#e6eef8' }}>Score Leaderboard</h1>
          <p style={{ color: '#9aa3b2', marginBottom: '0' }}>Complete score history for all users</p>
        </section>

        <div className="card" style={{ background: '#022b45', padding: '24px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ color: '#9aa3b2', margin: 0, fontSize: '0.9rem' }}>
              Source: {usingLocalScores ? 'Local cache (API unavailable)' : 'Database API'}
            </p>
            <p style={{ color: '#9aa3b2', margin: 0, fontSize: '0.9rem' }}>
              Total Scores: {scores.length}
            </p>
          </div>

          {loading ? (
            <div style={{ color: '#9aa3b2', padding: '40px', textAlign: 'center' }}>
              Loading scores...
            </div>
          ) : scores.length === 0 ? (
            <div style={{ color: '#9aa3b2', padding: '40px', textAlign: 'center' }}>No scores yet.</div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#4f9cff' }}>Rank</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#4f9cff' }}>User</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#4f9cff' }}>Quiz</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#4f9cff' }}>Score</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#4f9cff' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentScores.map((s, i) => {
                    const globalRank = indexOfFirstScore + i + 1
                    return (
                      <tr key={s._id || s.id || i}>
                        <td style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          {globalRank}
                        </td>
                        <td style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          {s.email || 'guest'}
                        </td>
                        <td style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          {s.quizTitle || 'Quiz'}
                        </td>
                        <td style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          {s.score} / {s.total || ''}
                        </td>
                        <td style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          {s.date ? new Date(s.date).toLocaleString() : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {renderPagination()}

              <div style={{ marginTop: '16px', textAlign: 'center', color: '#9aa3b2', fontSize: '0.9rem' }}>
                Showing {indexOfFirstScore + 1} - {Math.min(indexOfLastScore, scores.length)} of {scores.length} scores
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="site-footer" style={{ margin: '28px auto', textAlign: 'center', color: '#9aa3b2', padding: '12px' }}>
        <small>© MyQuiz — Admin Panel</small>
      </footer>
    </div>
  )
}
