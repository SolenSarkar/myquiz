import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../admin/css/admin.css'

export default function AdminEdit() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(null) // 'add' | 'delete' | null
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [selectedQuestionNum, setSelectedQuestionNum] = useState('')
  const [questions, setQuestions] = useState([
    { id: Date.now(), type: 'mc', text: '', choices: ['', '', '', ''], correct: 0 }
  ])

  useEffect(() => {
    try {
      const isAuth = sessionStorage.getItem('myquiz_admin_auth') === '1'
      if (!isAuth) window.location.href = '/admin-index.html'
    } catch (e) {
      window.location.href = '/admin-index.html'
    }
  }, [])

  const handleAdd = () => {
    if (!selectedQuiz) return alert('Please select a quiz first')
    setMode('add')
  }

  const handleDelete = () => {
    if (!selectedQuiz) return alert('Please select a quiz first')
    setMode('delete')
  }

  const handleCancel = () => {
    setMode(null)
    setSelectedQuiz('')
    setSelectedQuestionNum('')
    setQuestions([{ id: Date.now(), type: 'mc', text: '', choices: ['', '', '', ''], correct: 0 }])
  }

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now(), 
      type: 'mc', 
      text: '', 
      choices: ['', '', '', ''], 
      correct: 0 
    }])
  }

  const removeQuestion = (id) => {
    if (questions.length === 1) return alert('You must have at least one question')
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const updateChoice = (id, index, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const newChoices = [...q.choices]
        newChoices[index] = value
        return { ...q, choices: newChoices }
      }
      return q
    }))
  }

  const handleSubmitAll = (e) => {
    e.preventDefault()
    // Validate all questions
    for (let q of questions) {
      if (!q.text.trim()) {
        alert('All questions must have text')
        return
      }
      if (q.type === 'mc') {
        if (q.choices.some(c => !c.trim())) {
          alert('All multiple choice options must be filled')
          return
        }
      }
      if ((q.type === 'text' || q.type === 'number') && !q.correct) {
        alert('All text/number questions must have a correct answer')
        return
      }
    }
    
    alert(`${questions.length} question(s) added successfully! (Feature in development)`)
    console.log('Questions to add:', questions)
    handleCancel()
  }

  // Add form view
  if (mode === 'add') {
    return (
      <div className="admin-dashboard" style={{boxSizing: 'border-box',fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif',background: '#221636',color: '#e6eef8'}}>
        <nav className="navbar" style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '14px 20px',background: 'rgba(255, 255, 255, 0.03)',borderBottom: '1px solid rgba(255, 255, 255, 0.04)'}}>
          <div className="nav-left" style={{display: 'flex',alignItems: 'center',gap: '18px'}}>
            <a className="brand" href="/admin-dashboard" style={{fontWeight: '700',textDecoration: 'none',fontSize: '18px',color:'#4f9cff'}}>MyQuiz Admin</a>
          </div>
          <div className="nav-right">
            <button className="btn" onClick={() => navigate('/admin-dashboard')} style={{background: 'transparent',border: '2px solid rgba(79, 156, 255, 0.22)',color: '#4f9cff',padding: '8px 12px',borderRadius: '6px',cursor: 'pointer'}} >Back</button>
          </div>
        </nav>

        <main className="container" style={{ maxWidth: '1100px',margin: '28px auto',padding: '0 20px'}}>
          <section className="hero" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))',padding: '36px',borderRadius: '10px',boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6)',marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.03)'}}>
            <h1 style={{fontSize: '28px',marginBottom: '8px',color: '#e6eef8'}}>Add Questions</h1>
            <p style={{color: '#9aa3b2',marginBottom: '16px'}}>Add multiple questions to: <strong>{selectedQuiz}</strong></p>
          </section>

          <form onSubmit={handleSubmitAll}>
            {questions.map((question, qIndex) => (
              <div key={question.id} className="card" style={{background: '#022b45',padding: '18px',borderRadius: '10px',boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)', marginBottom: '16px'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{color: '#e6eef8', margin: 0}}>Question {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                        color: '#ff6b6b',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-row" style={{ marginTop: 12 }}>
                  <label style={{color: '#e6eef8'}}>Question Type</label>
                  <select 
                    value={question.type} 
                    onChange={(e) => {
                      const newType = e.target.value
                      setQuestions(questions.map(q => {
                        if (q.id === question.id) {
                          if (newType === 'mc') {
                            return { ...q, type: newType, choices: ['', '', '', ''], correct: 0 }
                          } else {
                            return { ...q, type: newType, correct: '' }
                          }
                        }
                        return q
                      }))
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      background: 'transparent',
                      color: '#e6eef8',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="mc" style={{ background: '#221636' }}>Multiple Choice</option>
                    <option value="text" style={{ background: '#221636' }}>Text Input</option>
                    <option value="number" style={{ background: '#221636' }}>Numeric Input</option>
                  </select>
                </div>

                <div className="form-row" style={{ marginTop: 12 }}>
                  <label style={{color: '#e6eef8'}}>Question Text</label>
                  <textarea 
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    rows={3} 
                    required 
                    placeholder="Enter your question here"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      background: 'transparent',
                      color: '#e6eef8',
                      fontFamily: 'inherit',
                      width: '100%'
                    }}
                  />
                </div>

                {question.type === 'mc' && (
                  <>
                    {question.choices.map((choice, idx) => (
                      <div key={idx} className="form-row" style={{ marginTop: 12 }}>
                        <label style={{color: '#e6eef8'}}>Option {idx + 1}</label>
                        <input 
                          value={choice}
                          onChange={(e) => updateChoice(question.id, idx, e.target.value)}
                          required 
                          placeholder={`Option ${idx + 1}`}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            background: 'transparent',
                            color: '#e6eef8',
                            width: '100%'
                          }}
                        />
                      </div>
                    ))}
                    <div className="form-row" style={{ marginTop: 12 }}>
                      <label style={{color: '#e6eef8'}}>Correct Answer</label>
                      <select 
                        value={question.correct}
                        onChange={(e) => updateQuestion(question.id, 'correct', parseInt(e.target.value))}
                        required
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          background: 'transparent',
                          color: '#e6eef8',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="0" style={{ background: '#221636' }}>Option 1</option>
                        <option value="1" style={{ background: '#221636' }}>Option 2</option>
                        <option value="2" style={{ background: '#221636' }}>Option 3</option>
                        <option value="3" style={{ background: '#221636' }}>Option 4</option>
                      </select>
                    </div>
                  </>
                )}

                {question.type === 'text' && (
                  <div className="form-row" style={{ marginTop: 12 }}>
                    <label style={{color: '#e6eef8'}}>Correct Answer (text)</label>
                    <input 
                      value={question.correct || ''}
                      onChange={(e) => updateQuestion(question.id, 'correct', e.target.value)}
                      type="text"
                      required 
                      placeholder="Exact text answer (case-insensitive)"
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        background: 'transparent',
                        color: '#e6eef8',
                        width: '100%'
                      }}
                    />
                    <small style={{ color: '#9aa3b2', marginTop: 4, display: 'block' }}>
                      Answer will be compared case-insensitively
                    </small>
                  </div>
                )}

                {question.type === 'number' && (
                  <div className="form-row" style={{ marginTop: 12 }}>
                    <label style={{color: '#e6eef8'}}>Correct Answer (number)</label>
                    <input 
                      value={question.correct || ''}
                      onChange={(e) => updateQuestion(question.id, 'correct', e.target.value)}
                      type="number"
                      required 
                      placeholder="Numeric answer"
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        background: 'transparent',
                        color: '#e6eef8',
                        width: '100%'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(79, 156, 255, 0.3)',
                  color: '#4f9cff',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ➕ Add Another Question
              </button>
              
              <button 
                type="submit"
                className="btn-primary" 
                style={{
                  background: '#4f9cff',
                  border: 'none',
                  color: '#042',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Submit All ({questions.length} question{questions.length !== 1 ? 's' : ''})
              </button>
              
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(79, 156, 255, 0.22)',
                  color: '#4f9cff',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </main>

        <footer className="site-footer"><small>© MyQuiz — Admin Panel</small></footer>
      </div>
    )
  }

  // Delete view
  if (mode === 'delete') {
    // Sample questions for different quizzes
    const quizQuestions = {
      'General Knowledge': [
        { id: 1, text: 'Which language runs in a web browser?', choices: ['Java', 'C', 'Python', 'JavaScript'], correct: 3, type: 'mc' },
        { id: 2, text: 'What does CSS stand for?', choices: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Syntax'], correct: 0, type: 'mc' },
        { id: 3, text: 'Which HTML element do we put the JavaScript in?', choices: ['<js>', '<script>', '<javascript>', '<code>'], correct: 1, type: 'mc' },
        { id: 4, text: 'Which company developed the React library?', choices: ['Google', 'Facebook (Meta)', 'Microsoft', 'Twitter'], correct: 1, type: 'mc' },
        { id: 5, text: 'Which of these is a JavaScript package manager?', choices: ['npm', 'rails', 'composer', 'pip'], correct: 0, type: 'mc' }
      ],
      'Web Development': [
        { id: 1, text: 'What is the capital of France?', type: 'text', correct: 'Paris' },
        { id: 2, text: 'What is 15 + 27?', type: 'number', correct: 42 },
        { id: 3, text: 'Who wrote "Romeo and Juliet"?', type: 'text', correct: 'Shakespeare' }
      ],
      'History': [
        { id: 1, text: 'In which year did World War II end?', type: 'number', correct: 1945 },
        { id: 2, text: 'Who was the first President of the United States?', type: 'text', correct: 'George Washington' }
      ]
    }

    const currentQuestions = quizQuestions[selectedQuiz] || []
    const selectedQuestion = currentQuestions.find((q, idx) => (idx + 1).toString() === selectedQuestionNum)

    const handleDeleteQuestion = () => {
      if (!selectedQuestion) return
      if (confirm(`Are you sure you want to delete Question ${selectedQuestionNum}?\n\n"${selectedQuestion.text}"`)) {
        console.log('Deleting question:', selectedQuestion)
        alert('Question deleted (API call would happen here)')
        handleCancel()
      }
    }

    const renderAnswer = (question) => {
      if (question.type === 'mc') {
        return (
          <div style={{ marginTop: 8 }}>
            <strong style={{ color: '#4f9cff' }}>Options:</strong>
            <ul style={{ marginTop: 4, paddingLeft: 20 }}>
              {question.choices.map((choice, idx) => (
                <li key={idx} style={{ 
                  color: idx === question.correct ? '#52c41a' : '#e6eef8',
                  fontWeight: idx === question.correct ? '600' : 'normal'
                }}>
                  {choice} {idx === question.correct && '✓'}
                </li>
              ))}
            </ul>
          </div>
        )
      } else if (question.type === 'text') {
        return (
          <div style={{ marginTop: 8 }}>
            <strong style={{ color: '#4f9cff' }}>Correct Answer:</strong> 
            <span style={{ color: '#52c41a', fontWeight: '600', marginLeft: 8 }}>{question.correct}</span>
          </div>
        )
      } else if (question.type === 'number') {
        return (
          <div style={{ marginTop: 8 }}>
            <strong style={{ color: '#4f9cff' }}>Correct Answer:</strong> 
            <span style={{ color: '#52c41a', fontWeight: '600', marginLeft: 8 }}>{question.correct}</span>
          </div>
        )
      }
    }

    return (
      <div className="admin-dashboard" style={{boxSizing: 'border-box',fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif',background: '#221636',color: '#e6eef8'}}>
        <nav className="navbar" style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '14px 20px',background: 'rgba(255, 255, 255, 0.03)',borderBottom: '1px solid rgba(255, 255, 255, 0.04)'}}>
          <div className="nav-left" style={{display: 'flex',alignItems: 'center',gap: '18px'}}>
            <a className="brand" href="/admin-dashboard" style={{fontWeight: '700',textDecoration: 'none',fontSize: '18px',color:'#4f9cff'}}>MyQuiz Admin</a>
          </div>
          <div className="nav-right">
            <button className="btn" onClick={() => navigate('/admin-dashboard')} style={{background: 'transparent',border: '2px solid rgba(79, 156, 255, 0.22)',color: '#4f9cff',padding: '8px 12px',borderRadius: '6px',cursor: 'pointer'}} >Back</button>
          </div>
        </nav>

        <main className="container" style={{ maxWidth: '1100px',margin: '28px auto',padding: '0 20px'}}>
          <section className="hero" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))',padding: '36px',borderRadius: '10px',boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6)',marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.03)'}}>
            <h1 style={{fontSize: '28px',marginBottom: '8px',color: '#e6eef8'}}>Delete Question</h1>
            <p style={{color: '#9aa3b2',marginBottom: '16px'}}>Quiz: <strong>{selectedQuiz}</strong></p>
          </section>

          <div className="card" style={{background: '#022b45',padding: '18px',borderRadius: '10px',boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)', marginBottom: '16px'}}>
            <h3 style={{ color: '#e6eef8', marginBottom: 16 }}>Select Question to Delete</h3>
            <div className="form-row" style={{ marginTop: 12 }}>
              <label style={{color: '#e6eef8'}}>Question Number</label>
              <select 
                value={selectedQuestionNum}
                onChange={(e) => setSelectedQuestionNum(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  background: 'transparent',
                  color: '#e6eef8',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="" style={{ background: '#221636' }}>-- Select Question --</option>
                {currentQuestions.map((q, idx) => (
                  <option key={idx} value={idx + 1} style={{ background: '#221636' }}>
                    Question {idx + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedQuestion && (
            <div className="card" style={{
              background: '#022b45',
              padding: '18px',
              borderRadius: '10px',
              boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)',
              marginBottom: '16px',
              border: '2px solid rgba(255, 193, 7, 0.3)'
            }}>
              <h3 style={{ color: '#ffc107', marginBottom: 12 }}>⚠️ Confirm Deletion</h3>
              <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                padding: 16, 
                borderRadius: 8,
                marginBottom: 16
              }}>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ color: '#4f9cff' }}>Question {selectedQuestionNum}:</strong>
                </div>
                <div style={{ color: '#e6eef8', fontSize: '1.05rem', marginBottom: 12 }}>
                  {selectedQuestion.text}
                </div>
                {renderAnswer(selectedQuestion)}
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button
                  onClick={handleDeleteQuestion}
                  style={{
                    background: '#ff4d4f',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Delete Question
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(79, 156, 255, 0.22)',
                    color: '#4f9cff',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!selectedQuestion && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleCancel}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(79, 156, 255, 0.22)',
                  color: '#4f9cff',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </main>

        <footer className="site-footer" style={{margin: '28px auto',textAlign: 'center',color: '#9aa3b2',padding: '12px'}}><small>© MyQuiz — Admin Panel</small></footer>
      </div>
    )
  }

  // Main selection view
  return (
    <div className="admin-dashboard" style={{boxSizing: 'border-box',fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif',background: '#221636',color: '#e6eef8'}}>
      <nav className="navbar" style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '14px 20px',background: 'rgba(255, 255, 255, 0.03)',borderBottom: '1px solid rgba(255, 255, 255, 0.04)'}}>
        <div className="nav-left" style={{display: 'flex',alignItems: 'center',gap: '18px'}}>
          <a className="brand" href="/admin-dashboard" style={{fontWeight: '700',textDecoration: 'none',fontSize: '18px',color:'#4f9cff'}}>MyQuiz Admin</a>
        </div>
        <div className="nav-right" >
          <button className="btn"  onClick={() => navigate('/admin-dashboard')} style={{background: 'transparent',border: '2px solid rgba(79, 156, 255, 0.22)',color: '#4f9cff',padding: '8px 12px',borderRadius: '6px',cursor: 'pointer'}}>Back</button>
        </div>
      </nav>

      <main className="container" style={{ maxWidth: '1100px',margin: '28px auto',padding: '0 20px'}}>
        <section className="hero" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))',padding: '36px',borderRadius: '10px',boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6)',marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.03)'}}>
          <h1 style={{fontSize: '28px',marginBottom: '8px',color: '#e6eef8'}}>Edit Quizzes</h1>
          <p style={{ marginTop: '8px', color: '#9aa3b2' }}>Choose a quiz and then add or delete questions.</p>
        </section>

        <div className="cards" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          <div className="card" style={{background: '#022b45',padding: '18px',borderRadius: '10px',boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)'}}>
            <h3 >Select Quiz</h3>
            <div className="form-row" style={{ marginTop: 12 }}>
              <label htmlFor="quizSelect" style={{color: '#e6eef8',}}>Quiz</label>
              <select id="quizSelect" value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)} style={{background: '#f4f6f7ff',color: '#131313ff',border: '1px solid #4f9cff',borderRadius: '6px',padding: '8px 12px'}}>
                <option value="">-- Select a Quiz --</option>
                <option value="General Knowledge">General Knowledge</option>
                <option value="Web Development">Web Development</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>
        </div>

        <section style={{ marginTop: 20 }}>
          <div className="cards">
            <div className="card">
              <h3>➕ Add Question</h3>
              <p style={{ color: 'var(--muted)' }}>Add a new question to the selected quiz.</p>
              <button className="btn-link" onClick={handleAdd} style={{background: 'transparent',border: '2px solid rgba(79, 156, 255, 0.22)',color: '#4f9cff',padding: '8px 12px',borderRadius: '6px',cursor: 'pointer'}}>Add Question</button>
            </div>
            <div className="card">
              <h3>➖ Delete Question</h3>
              <p style={{ color: 'var(--muted)' }}>Remove an existing question from the selected quiz.</p>
              <button className="btn-link" onClick={handleDelete} style={{background: 'transparent',border: '2px solid rgba(79, 156, 255, 0.22)',color: '#4f9cff',padding: '8px 12px',borderRadius: '6px',cursor: 'pointer'}}>Delete Question</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" style={{margin: '28px auto',textAlign: 'center',color: '#9aa3b2',padding: '12px'}}><small>© MyQuiz — Admin Panel</small></footer>
    </div>
  )
}
