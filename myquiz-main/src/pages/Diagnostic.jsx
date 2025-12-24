import React, { useEffect, useState } from 'react'
import client from '../api'

export default function Diagnostic() {
  const [status, setStatus] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = {}

      // Check environment variables
      results.envVars = {
        VITE_API_BASE: import.meta.env.VITE_API_BASE || 'NOT SET',
        VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'NOT SET',
        VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'NOT SET',
        MODE: import.meta.env.MODE
      }

      // Check API base URL being used
      results.apiConfig = {
        baseURL: client.defaults.baseURL,
        timeout: client.defaults.timeout
      }

      // Test backend connectivity
      try {
        const response = await fetch('https://myquiz-zvai.onrender.com/api/health')
        results.backendHealth = {
          status: response.status,
          ok: response.ok,
          data: await response.json()
        }
      } catch (error) {
        results.backendHealth = {
          error: error.message
        }
      }

      // Test API client
      try {
        const response = await client.get('/quizzes')
        results.apiClient = {
          success: true,
          quizzes: response.data.length
        }
      } catch (error) {
        results.apiClient = {
          success: false,
          error: error.message,
          response: error.response?.data
        }
      }

      setStatus(results)
      setLoading(false)
    }

    runDiagnostics()
  }, [])

  if (loading) {
    return <div style={{ padding: '2rem' }}>Running diagnostics...</div>
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h1>MyQuiz Diagnostic Page</h1>
      
      <section style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Environment Variables</h2>
        <pre>{JSON.stringify(status.envVars, null, 2)}</pre>
      </section>

      <section style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>API Configuration</h2>
        <pre>{JSON.stringify(status.apiConfig, null, 2)}</pre>
      </section>

      <section style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Backend Health Check</h2>
        <pre>{JSON.stringify(status.backendHealth, null, 2)}</pre>
      </section>

      <section style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>API Client Test</h2>
        <pre>{JSON.stringify(status.apiClient, null, 2)}</pre>
      </section>

      <div style={{ marginTop: '2rem', padding: '1rem', background: status.apiClient?.success ? '#d4edda' : '#f8d7da', borderRadius: '8px' }}>
        {status.apiClient?.success ? (
          <p style={{ color: '#155724', margin: 0 }}>✅ All systems operational!</p>
        ) : (
          <div>
            <p style={{ color: '#721c24', margin: 0, marginBottom: '1rem' }}>❌ Connection failed</p>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              <strong>Troubleshooting steps:</strong><br/>
              1. Check if VITE_API_BASE is set in Vercel<br/>
              2. Verify environment variables are for Production/Preview/Development<br/>
              3. Redeploy after setting variables<br/>
              4. Check CORS settings on backend
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
