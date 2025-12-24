// New SignIn page with Google Authentication (Firebase)
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function SignIn() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [registered, setRegistered] = useState(false)

  const provider = new GoogleAuthProvider()

  useEffect(() => {
    if (user && user.email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const exists = users.some((u) => u.email === user.email)
      setRegistered(exists)
    } else {
      setRegistered(false)
    }
  }, [user])

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, provider)
      const u = result.user
      setUser({ uid: u.uid, name: u.displayName, email: u.email })
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  function handleRegister() {
    if (!user || !user.email) return
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (!users.some((u) => u.email === user.email)) {
      users.push({ email: user.email, name: user.name || '', uid: user.uid })
      localStorage.setItem('users', JSON.stringify(users))
      setRegistered(true)
    }
  }

  async function handleSignOut() {
    await signOut(auth)
    setUser(null)
    setRegistered(false)
  }

  return (
    <main className="container" style={{ padding: 24 }}>
      <section aria-labelledby="signin-heading">
        <h1 id="signin-heading">Sign in with Google</h1>
        <p className="muted">Use your Google account to sign in. If you're new, register quickly using your Google email.</p>

        <div style={{ marginTop: 18 }}>
          {!user ? (
            <div>
              <button className="btn primary" onClick={handleGoogleSignIn} disabled={loading} aria-busy={loading}>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 8 }}>
                <strong>{user.name}</strong>
                <div style={{ color: 'var(--muted)' }}>{user.email}</div>
              </div>

              {!registered ? (
                <div>
                  <p role="status">We couldn't find an account for this email. Register quickly to continue.</p>
                  <button className="btn primary" onClick={handleRegister}>Register</button>
                </div>
              ) : (
                <div>
                  <p role="status">You are signed in and registered.</p>
                  <button className="btn" onClick={() => navigate('/quiz')}>Go to quizzes</button>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <button className="btn" onClick={handleSignOut}>Sign out</button>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" style={{ color: '#ff6b6b', marginTop: 12 }}>{error}</div>
          )}
        </div>
      </section>
    </main>
  )
}
