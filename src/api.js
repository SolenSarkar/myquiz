import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
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
  return config
})

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

export async function getScores(email) {
  return client.get(`/scores/${email}`)
}

export async function getAllScores() {
  return client.get('/scores')
}

export default client
