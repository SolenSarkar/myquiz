import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { auth } from '../firebase'
import { postScore } from '../api'

export default function QuizQ3() {
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
    {
      id: 8,
      text: 'What is the chemical symbol for Gold? (text answer)',
      correct: 'au',
      type: 'text'
    },
    {
      id: 9,
      text: 'How many continents are there? (numeric answer)',
      correct: 7,
      type: 'number'
    },
    {
      id: 10,
      text: 'Who is the author of "The Great Gatsby"? (text answer)',
      correct: 'f. scott fitzgerald',
      type: 'text'
    }
  ]

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

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
    return ans === q.correct
  }

  async function saveResult(finalScore, total, quizTitle) {
    const payload = {
      email: auth.currentUser?.email || 'guest',
      quizTitle,
      score: finalScore,
      total,
      date: new Date().toISOString()
    }

    try {
      await postScore(payload)
    } catch (e) {
      try {
        const quizScores = JSON.parse(localStorage.getItem('quizScores') || '[]')
        quizScores.push(payload)
        localStorage.setItem('quizScores', JSON.stringify(quizScores))
      } catch (err) {
        console.error('Failed to save score locally', err)
      }
    }
  }

  function gotoNext() {
    if (index < questions.length - 1) {
      setIndex(index + 1)
    } else {
      // calculate score
      let score = 0
      for (let i = 0; i < questions.length; i++) {
        if (isCorrectAnswer(questions[i], answers[i])) {
          score++
        }
      }
      saveResult(score, questions.length, title)
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

  return (
    <section className="quiz">
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '45px' }}>{title}</h1>

        {!finished ? (
          <article className="question" aria-live="polite">
            <h2>{questions[index].text}</h2>
            
            {questions[index].type === 'mc' || !questions[index].type ? (
              <ul>
                {questions[index].choices?.map((c, i) => {
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
            ) : questions[index].type === 'text' ? (
              <input
                type="text"
                className="choice-input"
                placeholder="Enter your answer..."
                value={answers[index] || ''}
                onChange={(e) => inputAnswer(e.target.value)}
                aria-label="Text answer"
              />
            ) : questions[index].type === 'number' ? (
              <input
                type="number"
                className="choice-input"
                placeholder="Enter a number..."
                value={answers[index] || ''}
                onChange={(e) => inputAnswer(e.target.value)}
                aria-label="Numeric answer"
              />
            ) : null}

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
                    {isCorrectAnswer(q, answers[i]) ? 'Correct' : `Correct: ${String(q.correct)}`}
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
