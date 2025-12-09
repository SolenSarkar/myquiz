import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Quiz() {
  const navigate = useNavigate()
  const cards = [
    { id: '1', title: 'General Knowledge', meta: '12 questions' },
    { id: '2', title: 'Web Development', meta: '8 questions' },
    { id: '3', title: 'History', meta: '10 questions' }
  ]

  return (
    <section className="quiz-landing" aria-labelledby="choose-quiz">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 id="choose-quiz">Choose a quiz</h1>
        <p className="muted">Pick any quiz below to begin. Each card opens the sample quiz.</p>

        <div className="quiz-cards" role="list" >
          {cards.map((c) => (
            <div key={c.id} className="card-circle" role="listitem">
              <button
                className="card-btn"
                onClick={() => navigate(`/quizq${c.id}`, { state: { title: c.title } })}
                aria-label={`Start ${c.title} quiz ${c.id}`}
              >
                <span className="card-title">{c.title}</span>
                <span className="card-meta">{c.meta}</span>
                <span className="card-start">Start</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}