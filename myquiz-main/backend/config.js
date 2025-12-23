import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@myquiz.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',')
const MONGODB_URI = process.env.MONGODB_URI

// Validate critical environment variables
if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
  console.warn('⚠️  WARNING: JWT_SECRET not set or using default value. Generate a secure secret for production!')
  if (NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production')
  }
}

if (!MONGODB_URI || MONGODB_URI.includes('your_username') || MONGODB_URI.includes('your_password')) {
  console.warn('⚠️  WARNING: MONGODB_URI not properly configured')
  if (NODE_ENV === 'production') {
    throw new Error('MONGODB_URI must be set in production')
  }
}

  


export default {
  PORT,
  NODE_ENV,
  JWT_SECRET: JWT_SECRET || 'your-secret-key-change-in-production',
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ALLOWED_ORIGINS,
  MONGODB_URI: MONGODB_URI || 'mongodb://localhost:27017/quizdb'
}
