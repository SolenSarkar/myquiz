import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { auth } from '../firebase'
import { postScore } from '../api'

export default function QuizQ1() {
  const location = useLocation()
  const title = location?.state?.title ?? 'Sample Quiz'
  const questions = [
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
    },
    {
      id: 6,
      text: 'Which data structure uses LIFO ordering?',
      choices: ['Queue', 'Stack', 'Tree', 'Graph'],
      correct: 1,
      type: 'mc'
    },
    {
      id: 7,
      text: 'What does HTTP stand for?',
      choices: ['Hyper Transfer Text Protocol', 'HyperText Transfer Protocol', 'HighText Transfer Protocol', 'Hyperlink Transfer Protocol'],
      correct: 1,
      type: 'mc'
    },
    // Text input question
    {
      id: 8,
      text: 'Who wrote "Pride and Prejudice"? (text answer)',
      correct: 'jane austen',
      type: 'text'
    },
    // Numeric question
    {
      id: 9,
      text: 'What is 7 × 8? (numeric answer)',
      correct: 56,
      type: 'number'
    }
    ,
    {
      id: 10,
      text: 'Who wrote "1984"? (text answer)',
      correct: 'george orwell',
      type: 'text'
    },
    {
      id: 11,
      text: 'What is the square root of 144? (numeric answer)',
      correct: 12,
      type: 'number'
    },
    {
      id: 12,
      text: 'What is the capital of France? (text answer)',
      correct: 'paris',
      type: 'text'
    }
  ]

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [finished, setFinished] = useState(false)

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
    if (index < questions.length - 1) {
      setIndex(index + 1)
    } else {
      // save result and finish
      saveResult()
      setFinished(true)
    }
  }

  function gotoPrev() {
    if (index > 0) setIndex(index - 1)
  }

  function restart() {
    setAnswers(Array(questions.length).fill(null))
    setIndex(0)
    setFinished(false)
  }

  async function saveResult() {
    const score = questions.reduce((acc, q, i) => {
      return isCorrectAnswer(q, answers[i]) ? acc + 1 : acc
    }, 0)

    const payload = {
      email: auth && auth.currentUser ? auth.currentUser.email : 'guest',
      quizTitle: title,
      score,
      total: questions.length,
      date: new Date().toISOString()
    }

    // Try to send to backend; fallback to localStorage when no backend configured
    try {
      await postScore(payload)
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

  return (
    <section className="quiz">
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '45px' }}>{title}</h1>

        {!finished ? (
          <article className="question" aria-live="polite">
            <h2>{questions[index].text}</h2>

            {questions[index].type === 'mc' && (
              <ul>
                {questions[index].choices.map((c, i) => {
                  const selected = answers[index] === i
                  return (
                    <li key={i} style={{ marginBottom: 8 }}>
                      <button
                        className={`choice ${selected ? 'selected' : ''}`}
                        onClick={() => selectChoice(i)}
                        aria-pressed={selected}
                      >
                        {c}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {questions[index].type === 'text' && (
              <div>
                <label htmlFor={`q-${questions[index].id}`} className="sr-only">Answer</label>
                <input
                  id={`q-${questions[index].id}`}
                  type="text"
                  className="choice-input"
                  value={answers[index] ?? ''}
                  onChange={(e) => inputAnswer(e.target.value)}
                  placeholder="Type your answer"
                />
              </div>
            )}

            {questions[index].type === 'number' && (
              <div>
                <label htmlFor={`q-${questions[index].id}`} className="sr-only">Numeric answer</label>
                <input
                  id={`q-${questions[index].id}`}
                  type="number"
                  className="choice-input"
                  value={answers[index] ?? ''}
                  onChange={(e) => inputAnswer(e.target.value)}
                  placeholder="Enter a number"
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
                {index < questions.length - 1 ? 'Next' : 'Finish'}
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
            </div>
          </section>
        )}
      </div>
    </section>
  )
}
