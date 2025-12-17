// In-memory database with helper functions
// In production, replace with MongoDB, PostgreSQL, etc.

let quizzes = [
  {
    id: '1',
    title: 'Web Development Basics',
    description: 'Test your knowledge of HTML, CSS, and JavaScript',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    questions: [
      {
        id: 'q1',
        quizId: '1',
        text: 'Which language runs in a web browser?',
        type: 'mc',
        choices: ['Java', 'C', 'Python', 'JavaScript'],
        correct: 3,
        createdAt: new Date()
      },
      {
        id: 'q2',
        quizId: '1',
        text: 'What does CSS stand for?',
        type: 'mc',
        choices: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Syntax'],
        correct: 0,
        createdAt: new Date()
      },
      {
        id: 'q3',
        quizId: '1',
        text: 'Which HTML element do we put the JavaScript in?',
        type: 'mc',
        choices: ['<js>', '<script>', '<javascript>', '<code>'],
        correct: 1,
        createdAt: new Date()
      }
    ]
  },
  {
    id: '2',
    title: 'General Knowledge',
    description: 'Test your general knowledge across various topics',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
    questions: [
      {
        id: 'q1',
        quizId: '2',
        text: 'What is the capital of France?',
        type: 'text',
        correct: 'Paris',
        createdAt: new Date()
      },
      {
        id: 'q2',
        quizId: '2',
        text: 'In which year did World War II end?',
        type: 'number',
        correct: 1945,
        createdAt: new Date()
      }
    ]
  }
]

let scores = []
let nextScoreId = 1

// Quiz operations
export const getAllQuizzes = () => {
  return quizzes.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    questionCount: q.questions.length,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt
  }))
}

export const getQuizById = (id) => {
  return quizzes.find(q => q.id === id)
}

export const createQuiz = (title, description, questions = []) => {
  const id = String(quizzes.length + 1)
  const newQuiz = {
    id,
    title,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: questions.map((q, idx) => ({
      id: `q${idx + 1}`,
      quizId: id,
      ...q,
      createdAt: new Date()
    }))
  }
  quizzes.push(newQuiz)
  return newQuiz
}

export const updateQuiz = (id, title, description, questions) => {
  const quiz = quizzes.find(q => q.id === id)
  if (!quiz) return null

  quiz.title = title
  quiz.description = description
  quiz.updatedAt = new Date()
  quiz.questions = questions.map((q, idx) => ({
    id: q.id || `q${idx + 1}`,
    quizId: id,
    text: q.text,
    type: q.type,
    ...(q.type === 'mc' && { choices: q.choices }),
    correct: q.correct,
    createdAt: q.createdAt || new Date()
  }))
  return quiz
}

export const deleteQuiz = (id) => {
  const idx = quizzes.findIndex(q => q.id === id)
  if (idx === -1) return false
  quizzes.splice(idx, 1)
  return true
}

// Question operations
export const addQuestionsToQuiz = (quizId, newQuestions) => {
  const quiz = quizzes.find(q => q.id === quizId)
  if (!quiz) return 0

  const startIdx = quiz.questions.length
  const added = newQuestions.map((q, idx) => ({
    id: `q${startIdx + idx + 1}`,
    quizId,
    text: q.text,
    type: q.type,
    ...(q.type === 'mc' && { choices: q.choices }),
    correct: q.correct,
    createdAt: new Date()
  }))

  quiz.questions.push(...added)
  quiz.updatedAt = new Date()
  return added.length
}

export const deleteQuestion = (quizId, questionId) => {
  const quiz = quizzes.find(q => q.id === quizId)
  if (!quiz) return false

  const idx = quiz.questions.findIndex(q => q.id === questionId)
  if (idx === -1) return false

  quiz.questions.splice(idx, 1)
  quiz.updatedAt = new Date()
  return true
}

// Score operations
export const getAllScores = () => {
  return scores.map(s => ({
    ...s,
    date: new Date(s.date)
  }))
}

export const getScoresByEmail = (email) => {
  return scores
    .filter(s => s.email.toLowerCase() === email.toLowerCase())
    .map(s => ({
      ...s,
      date: new Date(s.date)
    }))
}

export const addScore = (email, quizId, quizTitle, score, total) => {
  const id = String(nextScoreId++)
  const newScore = {
    id,
    email,
    quizId,
    quizTitle,
    score,
    total,
    date: new Date()
  }
  scores.push(newScore)
  return newScore
}

// Admin credentials (in production, use hashed passwords in database)
let adminCredentials = {
  email: process.env.ADMIN_EMAIL || 'admin@myquiz.com',
  password: process.env.ADMIN_PASSWORD || 'admin123'
}

export const getAdminCredentials = () => adminCredentials

export const updateAdminCredentials = (newEmail, newPassword) => {
  adminCredentials = {
    email: newEmail,
    password: newPassword
  }
  return true
}

// Reset database (for testing)
export const resetDatabase = () => {
  quizzes = quizzes.slice(0, 2) // Keep initial data
  scores = []
  nextScoreId = 1
}
