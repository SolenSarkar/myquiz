import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api'
import '../admin/css/admin.css'

export default function AdminManageUser() {
  const navigate = useNavigate()
  const [currentEmail, setCurrentEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    // Check session authentication
    try {
      const isAuth = sessionStorage.getItem('myquiz_admin_auth') === '1'
      if (!isAuth) {
        window.location.href = '/admin-index.html'
      }
    } catch (e) {
      window.location.href = '/admin-index.html'
    }

    // Load current credentials from session first, then env fallback
    try {
      const stored = sessionStorage.getItem('admin_email')
      if (stored) {
        setCurrentEmail(stored)
        return
      }
    } catch (e) {
      // ignore and fallback
    }

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'
    setCurrentEmail(adminEmail)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('')

    // Validate new email
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setMessage('Please enter a valid email address')
      setMessageType('error')
      return
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      setMessage('New password must be at least 6 characters')
      setMessageType('error')
      return
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match')
      setMessageType('error')
      return
    }

    try {
      // Call backend API to update credentials
      const response = await client.put('/auth/admin/credentials', {
        currentPassword,
        newEmail,
        newPassword
      })

      if (response.data.updated) {
        const updatedEmail = response.data.email || newEmail
        setMessage(`✓ Admin credentials updated successfully!\n\nNew email: ${updatedEmail}\n\nPlease use these new credentials for future logins.`)
        setMessageType('success')
        
        // Update session with new email
        sessionStorage.setItem('admin_email', updatedEmail)
        
        // Clear form
        setCurrentPassword('')
        setNewEmail('')
        setNewPassword('')
        setConfirmPassword('')
        setCurrentEmail(updatedEmail)
      }
    } catch (err) {
      console.error('Update credentials error:', err)
      setMessage(err.response?.data?.error || 'Failed to update credentials. Please try again.')
      setMessageType('error')
    }
  }

  return (
    <div className="admin-dashboard" style={{ boxSizing: 'border-box', fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif', background: '#221636', color: '#e6eef8', minHeight: '100vh' }}>
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <a className="brand" href="/admin-dashboard" style={{ fontWeight: '700', textDecoration: 'none', fontSize: '18px', color: '#4f9cff' }}>
            MyQuiz Admin
          </a>
        </div>
        <div className="nav-right">
          <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ background: 'transparent', border: '2px solid rgba(79, 156, 255, 0.22)', color: '#4f9cff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="container" style={{ maxWidth: '700px', margin: '28px auto', padding: '0 20px' }}>
        <section className="hero" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))', padding: '36px', borderRadius: '10px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6)', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#e6eef8' }}>Manage Admin User</h1>
          <p style={{ color: '#9aa3b2', marginBottom: '0' }}>Update admin email and password credentials</p>
        </section>

        <div className="card" style={{ background: '#022b45', padding: '24px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(2, 6, 23, 0.6)' }}>
          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(79, 156, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(79, 156, 255, 0.15)' }}>
            <h3 style={{ color: '#4f9cff', marginBottom: '8px', fontSize: '1rem' }}>Current Admin Email</h3>
            <p style={{ color: '#e6eef8', margin: 0, fontFamily: 'monospace', fontSize: '1.05rem' }}>{currentEmail}</p>
          </div>

          {message && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '16px', 
              background: messageType === 'success' ? 'rgba(82, 196, 26, 0.1)' : 'rgba(255, 77, 79, 0.1)', 
              borderRadius: '8px',
              border: `1px solid ${messageType === 'success' ? 'rgba(82, 196, 26, 0.3)' : 'rgba(255, 77, 79, 0.3)'}`,
              whiteSpace: 'pre-line'
            }}>
              <p style={{ color: messageType === 'success' ? '#52c41a' : '#ff4d4f', margin: 0 }}>
                {message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ marginBottom: '16px' }}>
              <label htmlFor="currentPassword" style={{ color: '#e6eef8', display: 'block', marginBottom: '8px' }}>
                Current Password <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '40px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: '#e6eef8',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#9aa3b2',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: '1.2rem'
                  }}
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)', margin: '24px 0' }}></div>

            <div className="form-row" style={{ marginBottom: '16px' }}>
              <label htmlFor="newEmail" style={{ color: '#e6eef8', display: 'block', marginBottom: '8px' }}>
                New Email Address <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                placeholder="Enter new email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: '#e6eef8',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div className="form-row" style={{ marginBottom: '16px' }}>
              <label htmlFor="newPassword" style={{ color: '#e6eef8', display: 'block', marginBottom: '8px' }}>
                New Password <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 characters)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '40px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: '#e6eef8',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#9aa3b2',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: '1.2rem'
                  }}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: '24px' }}>
              <label htmlFor="confirmPassword" style={{ color: '#e6eef8', display: 'block', marginBottom: '8px' }}>
                Confirm New Password <span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '40px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: '#e6eef8',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#9aa3b2',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: '1.2rem'
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  background: '#4f9cff',
                  border: 'none',
                  color: '#042',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Update Credentials
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(79, 156, 255, 0.22)',
                  color: '#4f9cff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="site-footer" style={{ margin: '28px auto', textAlign: 'center', color: '#9aa3b2', padding: '12px' }}>
        <small>© MyQuiz — Admin Panel</small>
      </footer>
    </div>
  )
}
