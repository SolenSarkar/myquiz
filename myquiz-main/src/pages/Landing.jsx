import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Landing() {
  const navigate = useNavigate()
  return (
    <><section className="landing" >
          <div className="hero" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '400px' }}>
              <div className="hero-content" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                  <h1>Sharpen your knowledge. Have fun. Compete.</h1>
                  <p className="sub">Take quick, engaging quizzes on topics you love. Track progress and improve daily.</p>
                  <div className="cta">
                      <button className="btn primary" onClick={() => navigate('/quiz')} aria-label="Start quiz">Start Quiz</button>
                      <button className="btn" onClick={() => navigate('/signin')} aria-label="Sign in">Sign In</button>
                      
                  </div>
              </div>
          </div>

          <section className="features" aria-labelledby="features-heading" style={{ marginTop: '40px' }}>
              <h2 id="features-heading" style={{ textAlign: 'center', marginBottom:'35px' }}>Why players love it</h2>
              <ul className="feature-list" style={{ padding: '20px 10px', display: 'flex', justifyContent: 'space-around' }}>
                  <li>
                      <h3>Short & focused</h3>
                      <p style={{marginTop:'15px'}}>5-10 minute quizzes that fit your schedule.</p>
                  </li>
                  <li>
                      <h3>Track progress</h3>
                      <p style={{marginTop:'15px'}}>See improvement with detailed stats.</p>
                  </li>
                  <li>
                      <h3>Wide topics</h3>
                      <p style={{marginTop:'15px'}}>Choose from science, history, code, and more.</p>
                  </li>
              </ul>
          </section>

          <section className="how" aria-labelledby="how-heading">
              <h2 id="how-heading" style={{ textAlign: 'center',marginBottom:'35px' }}>How it works</h2>
              <ol className="how-steps" style={{ listStylePosition: 'inside', display: 'inline-block', textAlign: 'left', padding: '0 40px' }}>
                  <li style={{marginTop:'15px'}}>Select a topic and difficulty.</li>
                  <li style={{marginTop:'15px'}}>Answer questions under time pressure.</li>
                  <li style={{marginTop:'15px'}}>Review results and retry to improve.</li>
              </ol>
          </section>

          <section className="testimonials" aria-labelledby="testimonials-heading">
              <h2 id="testimonials-heading" style={{ textAlign: 'center', marginBottom:'35px' }}>What players say</h2>
              <blockquote style={{ textAlign: 'left', padding: '0 40px', backgroundColor: '#201f1fff', fontStyle: 'italic', color: '#ffffff' }}>
                  "Quick, addictive quizzes — I learn while I play!" — Sam
              </blockquote>
          </section>
      </section><hr style={{margin:'20px'}}/></>
  )
}
