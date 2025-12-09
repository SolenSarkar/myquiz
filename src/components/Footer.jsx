import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer-bottom" style={{ textAlign: 'center', padding: '10px 0', backgroundColor: '#484747ff', marginTop: '100px' }}>
      <div className="container">
        <small>© {new Date().getFullYear()} QuizApp — Built with React + Vite</small>
      </div>
    </footer>
  )
}
