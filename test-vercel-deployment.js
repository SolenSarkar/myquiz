const https = require('https');

const VERCEL_URL = 'https://myquiz-omega.vercel.app';

console.log('Testing Vercel deployment...\n');

// Test 1: Root URL
testURL('/', 'Root page');

// Test 2: Admin Index
testURL('/admin-index', 'Admin login page');

// Test 3: Check if it returns HTML
testURL('/admin-index', 'Admin page content check', true);

function testURL(path, description, checkContent = false) {
  const url = VERCEL_URL + path;
  
  https.get(url, (res) => {
    console.log(`✓ ${description}`);
    console.log(`  URL: ${url}`);
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  Content-Type: ${res.headers['content-type']}`);
    
    if (checkContent) {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.includes('root')) {
          console.log('  ✓ Contains root div');
        } else {
          console.log('  ✗ Missing root div - might not be loading React');
        }
        console.log('');
      });
    } else {
      console.log('');
    }
  }).on('error', (err) => {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${err.message}`);
    console.log('');
  });
}
