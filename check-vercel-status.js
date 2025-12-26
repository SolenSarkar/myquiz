const https = require('https');

const urls = [
  'https://myquiz-omega.vercel.app',
  'https://myquiz-omega.vercel.app/admin-index',
  'https://myquiz-omega.vercel.app/index.html'
];

console.log('Checking Vercel deployment status...\n');

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url}`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    console.log('---\n');
  }).on('error', (e) => {
    console.error(`Error for ${url}:`, e.message);
    console.log('---\n');
  });
});
