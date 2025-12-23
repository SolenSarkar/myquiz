import express from 'express'
import config from './config.js'
import { corsMiddleware, securityHeaders, errorHandler } from './middleware.js'
import { connectDB, disconnectDB } from './mongodb.js'
import authRoutes from './routes/auth.js'
import quizRoutes from './routes/quizzes.js'
import scoreRoutes from './routes/scores.js'

const app = express()

// Trust proxy for production (needed for Heroku, Railway, etc.)
if (config.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

// Middleware
app.use(securityHeaders)
app.use(corsMiddleware)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/scores', scoreRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    environment: config.NODE_ENV
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler (must be last)
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    await connectDB()
    
    app.listen(config.PORT, () => {
      console.log(`✓ MyQuiz Backend running on http://localhost:${config.PORT}`)
      console.log(`✓ Environment: ${config.NODE_ENV}`)
      console.log(`✓ Database: MongoDB Atlas`)
      console.log(`✓ Allowed origins: ${config.ALLOWED_ORIGINS.join(', ')}`)
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n✓ Shutting down...')
      await disconnectDB()
      process.exit(0)
    })
  } catch (err) {
    console.error('✗ Failed to start server:', err)
    process.exit(1)
  }
}

startServer()

export default app
