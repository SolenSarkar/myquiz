import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api'

export default function AdminLogin({ show = false, onClose = () => {} }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  function openAdminPanel() {
    // Navigate to admin dashboard in the same window
    try {
      sessionStorage.setItem('myquiz_admin_auth', '1')
      onClose()
      navigate('/admin-dashboard')
    } catch (e) {
      console.error('Navigation failed:', e)
      setAuthenticated(true)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!password) {
      setError('Please enter the admin password')
      return
    }

    // Backend API authentication
    client.post('/auth/admin-login', { email, password })
      .then((res) => {
        if (res.data && res.data.authenticated) {
          // Store JWT token for authenticated requests
          sessionStorage.setItem('admin_token', res.data.token)
          sessionStorage.setItem('myquiz_admin_auth', '1')
          sessionStorage.setItem('admin_email', res.data.email)
          setPassword('')
          openAdminPanel()
        } else {
          setError('Invalid admin credentials')
        }
      })
      .catch((err) => {
        console.error('Admin login error:', err)
        setError(err.response?.data?.error || 'Failed to authenticate. Please check your credentials.')
      })
  }

  function handleLogout() {
    setEmail('')
    setPassword('')
    setError('')
    setAuthenticated(false)
    try { sessionStorage.removeItem('myquiz_admin_auth') } catch(e){}
    onClose()
  }

  if (!show) return null

  if (authenticated) {
    return (
      <section className="admin-login-modal">
        <div className="modal-overlay" onClick={handleLogout}></div>
        <article className="modal-content">
          <button
            type="button"
            className="modal-close"
            onClick={handleLogout}
            aria-label="Close admin panel"
            title="Close"
          >
            ✕
          </button>
          <div style={{ textAlign: 'center' }}>
            <h2>✓ Admin Access Granted</h2>
            <p style={{ color: 'var(--accent)', marginBottom: 16 }}>
              Authenticated as {email}
            </p>
            <div style={{ 
              backgroundColor: 'var(--card)', 
              padding: 16, 
              borderRadius: 'var(--radius)',
              marginBottom: 16,
              border: '1px solid rgba(110, 231, 183, 0.2)'
            }}>
              <p style={{ marginBottom: 8 }}>You now have admin access to manage quiz content and user data.</p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>Admin Dashboard features coming soon...</p>
            </div>
            <button className="btn primary" onClick={handleLogout} style={{ width: '100%' }}>
              Sign Out
            </button>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section className="admin-login-modal">
      <div className="modal-overlay" onClick={handleLogout}></div>
      <article className="modal-content">
        <button
          type="button"
          className="modal-close"
          onClick={handleLogout}
          aria-label="Close login form"
          title="Close"
        >
          ✕
        </button>
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="admin-email" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="choice-input"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
              Enter the authorized admin email address
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="admin-password" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="choice-input"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
              Enter the secure admin password
            </p>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid #ff6b6b',
              color: '#ff6b6b',
              padding: 10,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 14
            }}>
              ✗ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Login as Admin
          </button>
        </form>

        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: 'rgba(96, 165, 250, 0.05)',
          borderRadius: 8,
          fontSize: 12,
          color: 'var(--muted)',
          border: '1px solid rgba(96, 165, 250, 0.1)'
        }}>
          <p style={{ margin: '0 0 6px' }}>
            <strong>Specification:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>Only one authorized admin email is allowed</li>
            <li>Password is case-sensitive</li>
            <li>All credentials are validated manually (no external authentication)</li>
          </ul>
        </div>
      </article>
    </section>
  )
}
