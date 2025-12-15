import express from 'express'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import { getAdminCredentials, updateAdminCredentials } from '../mongodb.js'
import { verifyToken, verifyAdmin } from '../middleware.js'

const router = express.Router()

// Admin login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const adminCreds = await getAdminCredentials()

    if (email.toLowerCase() === adminCreds.email.toLowerCase() && password === adminCreds.password) {
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
})

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
router.put('/admin/credentials', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body

    if (!currentPassword || !newEmail || !newPassword) {
      return res.status(400).json({ error: 'All fields required' })
    }

    const adminCreds = await getAdminCredentials()

    if (currentPassword !== adminCreds.password) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    await updateAdminCredentials(newEmail, newPassword)

    res.json({
      updated: true,
      email: newEmail,
      message: 'Admin credentials updated successfully'
    })
  } catch (err) {
    console.error('Update credentials error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
