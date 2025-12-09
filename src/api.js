import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

const client = axios.create({
  baseURL: API_BASE || undefined,
  timeout: 5000,
})

export async function postScore(payload) {
  if (!API_BASE) throw new Error('No API base configured')
  return client.post('/scores', payload)
}

export async function fetchQuizzes() {
  if (!API_BASE) throw new Error('No API base configured')
  return client.get('/quizzes')
}

export default client
