import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import config from './config.js'

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
})

// Rate limiter for general API requests
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Middleware to verify admin role
export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Middleware to handle CORS
export const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin

  // Allow all configured origins and any Vercel deployment URLs
  const isAllowed = config.ALLOWED_ORIGINS.includes(origin) || 
                    (origin && origin.includes('.vercel.app'))

  if (isAllowed && origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
}

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.header('X-Frame-Options', 'DENY')
  // Prevent MIME type sniffing
  res.header('X-Content-Type-Options', 'nosniff')
  // Enable XSS protection
  res.header('X-XSS-Protection', '1; mode=block')
  // Referrer policy
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  // Content Security Policy
  if (config.NODE_ENV === 'production') {
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  next()
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
}
