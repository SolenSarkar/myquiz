// Express middleware to require admin access.
// Reads ADMIN_EMAILS and ADMIN_PASSWORD from environment variables.
// Usage: const requireAdmin = require('./adminMiddleware'); app.use('/admin', requireAdmin, adminRouter)

function requireAdmin(req, res, next) {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || ''
  const adminPassword = process.env.ADMIN_PASSWORD || ''
  const adminEmailList = adminEmailsEnv
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  const headerPassword = (req.headers['x-admin-password'] || '')

  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const userEmail = (req.user.email || '').toLowerCase()

  if (req.user.role === 'admin') {
    return next()
  }

  if (adminEmailList.includes(userEmail) && adminPassword && headerPassword === adminPassword) {
    return next()
  }

  return res.status(403).json({ error: 'Admin privileges required' })
}

module.exports = requireAdmin
