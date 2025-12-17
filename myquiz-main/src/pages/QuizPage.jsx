import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import client from '../api'

export default function QuizPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const quizId = location?.state?.quizId
  const title = location?.state?.title ?? 'Quiz'
  
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // Fetch quiz questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await client.get(`/quizzes/${quizId}`)
        const fetchedQuestions = response.data?.questions || []
        setQuestions(fetchedQuestions)
        setAnswers(Array(fetchedQuestions.length).fill(null))
      } catch (err) {
        console.error('Failed to fetch quiz:', err)
        setError('Failed to load quiz questions')
        // Use fallback sample questions if quizId not provided or API fails
        const fallbackQuestions = [
          {
            id: 1,
            text: 'Which language runs in a web browser?',
            choices: ['Java', 'C', 'Python', 'JavaScript'],
            correct: 3,
            type: 'mc'
          },
          {
            id: 2,
            text: 'What does CSS stand for?',
            choices: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Syntax'],
            correct: 0,
            type: 'mc'
          },
          {
            id: 3,
            text: 'Which HTML element do we put the JavaScript in?',
            choices: ['<js>', '<script>', '<javascript>', '<code>'],
            correct: 1,
            type: 'mc'
          },
          {
            id: 4,
            text: 'Which company developed the React library?',
            choices: ['Google', 'Facebook (Meta)', 'Microsoft', 'Twitter'],
            correct: 1,
            type: 'mc'
          },
          {
            id: 5,
            text: 'Which of these is a JavaScript package manager?',
            choices: ['npm', 'rails', 'composer', 'pip'],
            correct: 0,
            type: 'mc'
          }
        ]
        setQuestions(fallbackQuestions)
        setAnswers(Array(fallbackQuestions.length).fill(null))
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuestions()
    }
  }, [quizId])

  function selectChoice(choiceIndex) {
    const copy = answers.slice()
    copy[index] = choiceIndex
    setAnswers(copy)
  }

  function inputAnswer(value) {
    const copy = answers.slice()
    copy[index] = value
    setAnswers(copy)
  }

  function isAnswered(qIndex) {
    const val = answers[qIndex]
    return val !== null && val !== ''
  }

  function isCorrectAnswer(q, ans) {
    if (q.type === 'text') {
      if (ans == null) return false
      return String(ans).trim().toLowerCase() === String(q.correct).trim().toLowerCase()
    }
    if (q.type === 'number') {
      if (ans == null || ans === '') return false
      return Number(ans) === Number(q.correct)
    }
    // default: multiple choice index
    return ans === q.correct
  }

  function gotoNext() {
    if (showFeedback) {
      // Already showed feedback, now advance
      setShowFeedback(false)
      if (index < questions.length - 1) {
        setIndex(index + 1)
      } else {
        // save result and finish
        saveResult()
        setFinished(true)
      }
    } else {
      // Show feedback first
      setShowFeedback(true)
    }
  }

  function gotoPrev() {
    if (index > 0) {
      setShowFeedback(false)
      setIndex(index - 1)
    }
  }

  function restart() {
    setAnswers(Array(questions.length).fill(null))
    setIndex(0)
    setFinished(false)
    setShowFeedback(false)
  }

  async function saveResult() {
    const score = questions.reduce((acc, q, i) => {
      return isCorrectAnswer(q, answers[i]) ? acc + 1 : acc
    }, 0)

    const payload = {
      email: auth && auth.currentUser ? auth.currentUser.email : 'guest',
      quizId: quizId || 'unknown',
      quizTitle: title,
      score,
      total: questions.length,
      date: new Date().toISOString()
    }

    // Try to send to backend; fallback to localStorage when no backend configured
    try {
      await client.post('/scores', payload)
    } catch (e) {
      try {
        const all = JSON.parse(localStorage.getItem('quizScores') || '[]')
        all.push(payload)
        localStorage.setItem('quizScores', JSON.stringify(all))
      } catch (err) {
        console.error('Failed to save score locally', err)
      }
    }
  }

  const score = questions.reduce((acc, q, i) => (isCorrectAnswer(q, answers[i]) ? acc + 1 : acc), 0)

  if (loading) {
    return (
      <section className="quiz">
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '45px' }}>{title}</h1>
          <p style={{ textAlign: 'center' }}>Loading quiz questions...</p>
        </div>
      </section>
    )
  }

  if (error && questions.length === 0) {
    return (
      <section className="quiz">
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '45px' }}>{title}</h1>
          <p style={{ textAlign: 'center', color: '#ff6b6b' }}>⚠ {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="quiz">
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '45px' }}>{title}</h1>

        {!finished ? (
          <article className="question" aria-live="polite">
            <h2>{questions[index]?.text}</h2>

            {questions[index]?.type === 'mc' && (
              <ul>
                {questions[index]?.choices?.map((c, i) => {
                  const selected = answers[index] === i
                  const isCorrect = i === questions[index]?.correct
                  let btnStyle = {}
                  if (showFeedback && selected) {
                    btnStyle = isCorrect ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
                  }
                  return (
                    <li key={i} style={{ marginBottom: 8 }}>
                      <button
                        className={`choice ${selected ? 'selected' : ''}`}
                        onClick={() => !showFeedback && selectChoice(i)}
                        aria-pressed={selected}
                        style={btnStyle}
                        disabled={showFeedback}
                      >
                        {c}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {questions[index]?.type === 'text' && (
              <div>
                <label htmlFor={`q-${questions[index]?.id}`} className="sr-only">Answer</label>
                <input
                  id={`q-${questions[index]?.id}`}
                  type="text"
                  className="choice-input"
                  value={answers[index] ?? ''}
                  onChange={(e) => inputAnswer(e.target.value)}
                  placeholder="Type your answer"
                  disabled={showFeedback}
                  style={showFeedback ? (isCorrectAnswer(questions[index], answers[index]) ? { borderColor: '#52c41a', backgroundColor: 'rgba(82, 196, 26, 0.1)' } : { borderColor: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.1)' }) : {}}
                />
              </div>
            )}

            {questions[index]?.type === 'number' && (
              <div>
                <label htmlFor={`q-${questions[index]?.id}`} className="sr-only">Numeric answer</label>
                <input
                  id={`q-${questions[index]?.id}`}
                  type="number"
                  className="choice-input"
                  value={answers[index] ?? ''}
                  onChange={(e) => inputAnswer(e.target.value)}
                  placeholder="Enter a number"
                  disabled={showFeedback}
                  style={showFeedback ? (isCorrectAnswer(questions[index], answers[index]) ? { borderColor: '#52c41a', backgroundColor: 'rgba(82, 196, 26, 0.1)' } : { borderColor: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.1)' }) : {}}
                />
              </div>
            )}

            <div className="controls" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn" onClick={gotoPrev} disabled={index === 0}>Back</button>
              <button
                className="btn primary"
                onClick={gotoNext}
                aria-disabled={!isAnswered(index)}
                disabled={!isAnswered(index)}
              >
                {showFeedback ? (index === questions.length - 1 ? 'Finish' : 'Next Question') : 'Submit Answer'}
              </button>
            </div>

            <div style={{ marginTop: 12, color: 'var(--muted)' }}>
              Question {index + 1} of {questions.length}
            </div>
          </article>
        ) : (
          <section className="results" aria-live="polite">
            <h2>Results</h2>
            <p>
              You scored {score} / {questions.length}
            </p>

            <ul>
              {questions.map((q, i) => (
                <li key={q.id} style={{ marginBottom: 10 }}>
                  <strong>{q.text}</strong>
                  <div>
                    Your answer: {answers[i] != null ? String(answers[i]) : 'No answer'}
                  </div>
                  <div style={{ color: isCorrectAnswer(q, answers[i]) ? 'var(--accent)' : '#ff6b6b' }}>
                    {isCorrectAnswer(q, answers[i]) ? 'Correct' : `Correct: ${q.correct}`}
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn" onClick={restart}>Retry</button>
              <button className="btn" onClick={() => navigate('/quiz')}>Back to Quiz</button>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}
