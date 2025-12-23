import express from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import config from '../config.js'
import { getAdminCredentials, updateAdminCredentials } from '../mongodb.js'
import { verifyToken, verifyAdmin, loginLimiter } from '../middleware.js'

const router = express.Router()

// Admin login with rate limiting and input validation
router.post('/admin-login', 
  loginLimiter,
  [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Invalid input', 
          details: errors.array() 
        })
      }

      const { email, password } = req.body

      const adminCreds = await getAdminCredentials()

      // Check if email matches
      if (email.toLowerCase() !== adminCreds.email.toLowerCase()) {
        return res.status(401).json({ error: 'Invalid admin credentials' })
      }

      // Check if password is hashed or plain text
      let isPasswordValid = false
      
      // If password starts with $2a$ or $2b$, it's bcrypt hashed
      if (adminCreds.password.startsWith('$2a$') || adminCreds.password.startsWith('$2b$')) {
        isPasswordValid = await bcryptjs.compare(password, adminCreds.password)
      } else {
        // Legacy: plain text password (should be migrated)
        isPasswordValid = password === adminCreds.password
        
        // Auto-upgrade to hashed password
        if (isPasswordValid) {
          const hashedPassword = await bcryptjs.hash(password, 10)
          await updateAdminCredentials(email, hashedPassword)
          console.log('Auto-upgraded plain text password to hashed version')
        }
      }

      if (isPasswordValid) {
        const token = jwt.sign(
          { email, isAdmin: true },
          config.JWT_SECRET,
          { expiresIn: '24h' }
        )

        return res.json({
          authenticated: true,
          token,
          email
        })
      }

      res.status(401).json({ error: 'Invalid admin credentials' })
    } catch (err) {
      console.error('Admin login error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// User login (Firebase token verification)
router.post('/user-login', (req, res) => {
  const { token } = req.body

  if (!token) {
    return res.status(400).json({ error: 'Token required' })
  }

  try {
    // In production, verify Firebase token here
    // For demo, just accept the token
    res.json({
      authenticated: true,
      message: 'User authenticated'
    })
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Update admin credentials (admin only)
router.put('/admin/credentials', 
  verifyToken, 
  verifyAdmin,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newEmail')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Invalid input', 
          details: errors.array() 
        })
      }

      const { currentPassword, newEmail, newPassword } = req.body

      const adminCreds = await getAdminCredentials()

      // Verify current password
      let isCurrentPasswordValid = false
      if (adminCreds.password.startsWith('$2a$') || adminCreds.password.startsWith('$2b$')) {
        isCurrentPasswordValid = await bcryptjs.compare(currentPassword, adminCreds.password)
      } else {
        isCurrentPasswordValid = currentPassword === adminCreds.password
      }

      if (!isCurrentPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' })
      }

      // Hash new password
      const hashedPassword = await bcryptjs.hash(newPassword, 10)
      await updateAdminCredentials(newEmail, hashedPassword)

      res.json({
        updated: true,
        email: newEmail,
        message: 'Admin credentials updated successfully'
      })
    } catch (err) {
      console.error('Update credentials error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
