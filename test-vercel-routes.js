const https = require('https');

const urls = [
  'https://myquiz-omega.vercel.app',
  'https://myquiz-omega.vercel.app/admin-index',
  'https://myquiz-omega.vercel.app/test-api.html'
];

console.log('Testing Vercel deployment...\n');

urls.forEach((url, index) => {
  setTimeout(() => {
    https.get(url, (res) => {
      console.log(`\n${url}`);
      console.log(`Status: ${res.statusCode}`);
      
      if (res.statusCode === 404) {
        console.log('❌ NOT FOUND - Route not working');
      } else if (res.statusCode === 200) {
        console.log('✅ OK - Page loads');
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
          console.log('Contains HTML: YES');
        } else {
          console.log('Response:', data.substring(0, 100));
        }
      });
    }).on('error', (e) => {
      console.error(`\n${url}`);
      console.error(`❌ Error:`, e.message);
    });
  }, index * 1000);
});
