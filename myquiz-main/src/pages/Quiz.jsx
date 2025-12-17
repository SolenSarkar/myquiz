import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api'

export default function Quiz() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        const response = await client.get('/quizzes')
        setQuizzes(response.data || [])
      } catch (err) {
        console.error('Failed to fetch quizzes:', err)
        setError('Failed to load quizzes')
        // Fallback to sample quizzes if API fails
        setQuizzes([
          { id: '1', title: 'General Knowledge' },
          { id: '2', title: 'Web Development' },
          { id: '3', title: 'History' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  const handleStartQuiz = (quiz) => {
    navigate(`/quiz-player`, { state: { quizId: quiz.id || quiz._id, title: quiz.title } })
  }

  if (loading) {
    return (
      <section className="quiz-landing" aria-labelledby="choose-quiz">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 id="choose-quiz">Loading quizzes...</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="quiz-landing" aria-labelledby="choose-quiz">
      <div className="container" style={{ textAlign: 'center',padding:'30px 0' }}>
        <h1 id="choose-quiz" >Choose a quiz</h1>
        <p className="muted">Pick any quiz below to begin.</p>

        {error && <p style={{ color: '#ff6b6b', marginBottom: 16 }}>⚠ {error}</p>}

        <div className="quiz-cards" role="list">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz.id || quiz._id} className="card-circle" role="listitem">
                <button
                  className="card-btn"
                  onClick={() => handleStartQuiz(quiz)}
                  aria-label={`Start ${quiz.title} quiz`}
                >
                  <span className="card-title">{quiz.title}</span>
                  <span className="card-subtitle" style={{padding:'15px 0px',fontSize:'13px'}}>Take the quiz</span>
                  <span className="card-start">Start</span>
                </button>
              </div>
            ))
          ) : (
            <p>No quizzes available</p>
          )}
        </div>
      </div>
    </section>
  )
}