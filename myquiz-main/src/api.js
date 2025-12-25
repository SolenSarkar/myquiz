import axios from 'axios'

// Production backend URL
const API_BASE = import.meta.env.VITE_API_BASE || 'https://myquiz-1-zvjx.onrender.com/api'

// Debug logging for deployment troubleshooting
console.log('API Configuration:')
console.log('- VITE_API_BASE:', import.meta.env.VITE_API_BASE)
console.log('- Using API_BASE:', API_BASE)
console.log('- Environment:', import.meta.env.MODE)

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // Increased timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url)
  return config
})

// Response interceptor for better error logging
client.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)

export async function postScore(payload) {
  return client.post('/scores', payload)
}

export async function fetchQuizzes() {
  return client.get('/quizzes')
}

export async function getQuiz(id) {
  return client.get(`/quizzes/${id}`)
}

export async function adminLogin(email, password) {
  return client.post('/auth/admin-login', { email, password })
}

export async function adminUpdateCredentials(currentPassword, newEmail, newPassword) {
  return client.put('/auth/admin/credentials', { currentPassword, newEmail, newPassword })
}

export async function addQuestionsToQuiz(quizId, questions) {
  return client.post(`/quizzes/${quizId}/questions`, { questions })
}

export async function deleteQuestion(quizId, questionId) {
  return client.delete(`/quizzes/${quizId}/questions/${questionId}`)
}

export async function createQuiz(title, description, questions = []) {
  return client.post('/quizzes', { title, description, questions })
}

export async function deleteQuiz(quizId) {
  return client.delete(`/quizzes/${quizId}`)
}

export async function getScores(email) {
  return client.get(`/scores/${email}`)
}

export async function getAllScores() {
  return client.get('/scores')
}

export default client
