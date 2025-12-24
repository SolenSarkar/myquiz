import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    try {
      const isAuth = sessionStorage.getItem('myquiz_admin_auth') === '1'
      const token = sessionStorage.getItem('admin_token')
      setIsAuthenticated(isAuth && token)
    } catch (e) {
      setIsAuthenticated(false)
    }
  }, [])

  if (isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-index" replace />
  }

  return children
}
