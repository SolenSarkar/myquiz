// Smoke test to verify all endpoints are working
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:5000/api'
let adminToken = null
let passed = 0
let failed = 0

async function test(name, method, url, body, expectedStatus = 200) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
      }
    }

    if (body) options.body = JSON.stringify(body)

    const res = await fetch(`${BASE_URL}${url}`, options)
    const data = await res.json().catch(() => ({}))

    if (res.status === expectedStatus) {
      console.log(`✓ ${name}`)
      passed++
      return data
    } else {
      console.log(`✗ ${name} (expected ${expectedStatus}, got ${res.status})`)
      console.log(`  Response:`, data)
      failed++
    }
  } catch (err) {
    console.log(`✗ ${name} (${err.message})`)
    failed++
  }
}

async function runTests() {
  console.log('\n🧪 MyQuiz Backend Smoke Tests\n')

  // Health check
  await test('Health check', 'GET', '/health')

  // Auth tests
  const adminLoginRes = await test(
    'Admin login',
    'POST',
    '/auth/admin-login',
    { email: 'admin@myquiz.com', password: 'admin123' }
  )
  adminToken = adminLoginRes?.token

  // Quiz tests
  await test('Get all quizzes', 'GET', '/quizzes')
  await test('Get quiz by ID', 'GET', '/quizzes/1')

  // Score tests
  await test(
    'Submit score',
    'POST',
    '/scores',
    { email: 'test@example.com', quizId: '1', quizTitle: 'Web Dev', score: 5, total: 10 }
  )

  await test('Get scores by email', 'GET', '/scores/test@example.com')

  // Admin only tests
  await test(
    'Get all scores (admin)',
    'GET',
    '/scores',
    null,
    200
  )

  // Summary
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`)
  process.exit(failed > 0 ? 1 : 0)
}

// Start server if not running, wait, then test
setTimeout(runTests, 1000)
