import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@myquiz.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb'

export default {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ALLOWED_ORIGINS,
  MONGODB_URI
}
