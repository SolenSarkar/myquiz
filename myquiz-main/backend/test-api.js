#!/usr/bin/env node

// Backend API Test Script
// Run with: node backend/test-api.js

const API_BASE = process.env.API_BASE || 'https://myquiz-1-zvjx.onrender.com'

async function testEndpoint(method, path, data = null) {
  const url = `${API_BASE}${path}`
  console.log(`\nTesting: ${method} ${url}`)
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  if (data) {
    options.body = JSON.stringify(data)
  }
  
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    console.log(`Status: ${response.status}`)
    console.log('Response:', JSON.stringify(result, null, 2))
    return { success: response.ok, data: result }
  } catch (error) {
    console.error(`Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('='.repeat(50))
  console.log('MyQuiz Backend API Tests')
  console.log('='.repeat(50))
  
  // Test 1: Root endpoint
  await testEndpoint('GET', '/')
  
  // Test 2: Health check
  await testEndpoint('GET', '/api/health')
  
  // Test 3: Get all quizzes
  await testEndpoint('GET', '/api/quizzes')
  
  // Test 4: Admin login
  await testEndpoint('POST', '/api/auth/admin-login', {
    email: 'admin@example.com',
    password: 'admin123'
  })
  
  // Test 5: Get all scores (will fail without token, but tests route exists)
  await testEndpoint('GET', '/api/scores')
  
  console.log('\n' + '='.repeat(50))
  console.log('Tests completed!')
  console.log('='.repeat(50))
}

runTests()
