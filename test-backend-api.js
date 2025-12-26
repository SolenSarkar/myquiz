const https = require('https');

// Test backend API
const backendUrl = 'https://myquiz-1-zvjx.onrender.com';

console.log('Testing backend API connectivity...\n');

// Test 1: Health check
https.get(`${backendUrl}/api`, (res) => {
  console.log('✓ Backend API Health:');
  console.log(`  Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`  Response: ${data}\n`);
  });
}).on('error', (e) => {
  console.error('✗ Backend API Error:', e.message, '\n');
});

// Test 2: Get quizzes
setTimeout(() => {
  https.get(`${backendUrl}/api/quizzes`, (res) => {
    console.log('✓ Quizzes endpoint:');
    console.log(`  Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const quizzes = JSON.parse(data);
        console.log(`  Quizzes found: ${quizzes.length || 0}\n`);
      } catch (e) {
        console.log(`  Response: ${data.substring(0, 200)}\n`);
      }
    });
  }).on('error', (e) => {
    console.error('✗ Quizzes Error:', e.message, '\n');
  });
}, 1000);

// Test 3: Admin login endpoint
setTimeout(() => {
  const postData = JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'myquiz-1-zvjx.onrender.com',
    port: 443,
    path: '/api/auth/admin-login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = https.request(options, (res) => {
    console.log('✓ Admin login endpoint:');
    console.log(`  Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`  Response: ${data}\n`);
    });
  });

  req.on('error', (e) => {
    console.error('✗ Admin login Error:', e.message, '\n');
  });

  req.write(postData);
  req.end();
}, 2000);
