import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../admin/css/admin.css'
export default function AdminIndex() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    // Validate credentials against env values
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem('myquiz_admin_auth', '1')
      } catch (e) {
        console.error(e)
      }
      // Navigate to admin dashboard
      navigate('/admin-dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div>
      <header className="landing-header">
        <a href="/" className="landing-brand">
          MyQuiz
        </a>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Back
        </button>
      </header>

      <main className="landing-container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 24 }} className="admin-index-grid">
          <section>
            <h1>MyQuiz Admin</h1>
            <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
              Manage quizzes, review scores, and invite admins. Sign in with your admin credentials to access the dashboard.
            </p>
            <ul style={{ color: 'var(--muted-2)', lineHeight: 1.8 }}>
              <li>Default admin email: <strong>admin@example.com</strong></li>
              <li>Default admin password: <strong>admin123</strong></li>
            </ul>
          </section>

          <aside className="landing-login">
            <h2 style={{ marginBottom: 12 }}>Admin Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-row">
                <label htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 8 }}>
                  ✗ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '30%', marginTop: 8, }}
              >
                Sign In
              </button>

              <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 8 }}>
                This form validates credentials from your environment configuration.
              </div>
            </form>
          </aside>
        </div>

        <section style={{ marginTop: 32, textAlign: 'center' }}>
          <h2>Welcome to MyQuiz</h2>
          <p style={{ color: 'var(--muted)' }}>
            Sign in with your admin credentials to manage quizzes, view scores, and more.
          </p>
        </section>
      </main>
    </div>
  )
}
