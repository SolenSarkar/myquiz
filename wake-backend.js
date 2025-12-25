#!/usr/bin/env node

// Quick script to wake up Render backend and test connectivity

const BACKEND_URL = 'https://myquiz-1-zvjx.onrender.com'

async function wakeUpBackend() {
  console.log('\n🔄 Attempting to wake up Render backend...')
  console.log(`URL: ${BACKEND_URL}`)
  console.log('⏱️  This may take 30-60 seconds if service is sleeping...\n')

  const startTime = Date.now()

  try {
    // Try root endpoint
    console.log('Testing: GET /')
    const rootResponse = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    
    if (rootResponse.ok) {
      const data = await rootResponse.json()
      console.log('✅ Root endpoint OK:', data)
    } else {
      console.log(`⚠️  Root endpoint returned: ${rootResponse.status}`)
    }

    // Try health check
    console.log('\nTesting: GET /api/health')
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    
    if (healthResponse.ok) {
      const health = await healthResponse.json()
      console.log('✅ Health check OK:', health)
    } else {
      console.log(`⚠️  Health check returned: ${healthResponse.status}`)
      const text = await healthResponse.text()
      console.log('Response:', text)
    }

    // Try quizzes endpoint
    console.log('\nTesting: GET /api/quizzes')
    const quizzesResponse = await fetch(`${BACKEND_URL}/api/quizzes`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    
    if (quizzesResponse.ok) {
      const quizzes = await quizzesResponse.json()
      console.log(`✅ Quizzes endpoint OK: Found ${quizzes.length} quizzes`)
    } else {
      console.log(`⚠️  Quizzes endpoint returned: ${quizzesResponse.status}`)
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`\n✨ Backend is awake! (took ${elapsed}s)`)
    console.log('\n📋 Next steps:')
    console.log('1. Backend is running at:', BACKEND_URL)
    console.log('2. Set VITE_API_BASE in Vercel to:', `${BACKEND_URL}/api`)
    console.log('3. Redeploy your Vercel frontend')

  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error(`\n❌ Connection failed after ${elapsed}s`)
    console.error('Error:', error.message)
    console.log('\n🔍 Troubleshooting:')
    console.log('1. Check if Render service is running: https://dashboard.render.com')
    console.log('2. Verify root directory is set to: myquiz-main/backend')
    console.log('3. Check Render logs for startup errors')
    console.log('4. Ensure all environment variables are set')
    console.log('\n📖 See RENDER_FIX.md for detailed instructions')
  }
}

wakeUpBackend()
