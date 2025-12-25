const BACKEND_URL = 'https://myquiz-1-zvjx.onrender.com'

async function testAdminLogin() {
  console.log('Testing admin login...')
  console.log('Backend URL:', BACKEND_URL)
  
  const credentials = {
    email: 'admin@example.com',
    password: 'admin123'
  }
  
  console.log('Credentials:', credentials)
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data.authenticated) {
      console.log('✅ Login successful!')
      console.log('Token:', data.token)
    } else {
      console.log('❌ Login failed:', data.error)
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

testAdminLogin()
