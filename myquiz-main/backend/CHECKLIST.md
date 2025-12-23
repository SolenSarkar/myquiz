# Pre-Deployment Checklist

Use this checklist before deploying to production.

---

## ✅ Code & Security

- [x] Password hashing implemented (bcrypt)
- [x] Rate limiting configured (5 attempts/15min)
- [x] Input validation added (express-validator)
- [x] Security headers configured
- [x] JWT secret is secure (512-bit)
- [x] No hardcoded credentials in code
- [x] .env file in .gitignore
- [x] .env.example sanitized
- [x] All npm vulnerabilities fixed
- [x] No errors in code

---

## ⚠️ Configuration (DO BEFORE DEPLOY!)

- [ ] Update ADMIN_PASSWORD in .env (change from "admin123")
- [ ] Update ADMIN_EMAIL in .env
- [ ] Update ALLOWED_ORIGINS with production frontend domain
- [ ] Verify MONGODB_URI is correct for production
- [ ] Set NODE_ENV=production
- [ ] JWT_SECRET is secure (already generated ✅)

---

## 🧪 Testing

- [ ] Test admin login locally
- [ ] Test quiz CRUD operations
- [ ] Test score submission
- [ ] Test rate limiting (6 failed attempts)
- [ ] Test CORS with frontend
- [ ] Verify security headers are present
- [ ] Test with invalid inputs

---

## 📦 Platform Setup

Choose one platform and complete its setup:

### Option A: Railway
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Set root directory to "backend"
- [ ] Add all environment variables
- [ ] Deploy and note backend URL

### Option B: Render
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect repository
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Add environment variables
- [ ] Deploy and note backend URL

### Option C: Heroku
- [ ] Install Heroku CLI
- [ ] Run `heroku login`
- [ ] Create app: `heroku create myquiz-backend`
- [ ] Set all config vars with `heroku config:set`
- [ ] Deploy: `git push heroku main`
- [ ] Note backend URL

---

## 🗄️ Database

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string tested
- [ ] Sample data seeded
- [ ] Backup strategy documented

---

## 🌐 Frontend Integration

- [ ] Update API_BASE_URL in frontend (src/api.js)
- [ ] Update ALLOWED_ORIGINS in backend .env
- [ ] Test CORS from frontend
- [ ] Test all API calls from frontend
- [ ] Verify authentication flow works

---

## 📊 Post-Deployment

- [ ] Backend URL is accessible
- [ ] /api/health endpoint responds
- [ ] Admin can log in
- [ ] Quizzes load correctly
- [ ] Scores can be submitted
- [ ] Rate limiting works (test 6 failed logins)
- [ ] HTTPS is working
- [ ] SSL certificate is valid

---

## 🔍 Monitoring & Logs

- [ ] Platform logs accessible
- [ ] Error tracking configured (optional: Sentry)
- [ ] Uptime monitoring set up (optional: UptimeRobot)
- [ ] Performance monitoring (optional: New Relic)

---

## 📱 Documentation

- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide available

---

## 🔐 Security Final Check

- [ ] Admin password is NOT "admin123"
- [ ] JWT_SECRET is NOT default value
- [ ] MongoDB credentials are NOT exposed
- [ ] CORS only allows your domains
- [ ] HTTPS is enforced
- [ ] Rate limiting is active
- [ ] Security headers are present

---

## ✅ Ready to Deploy!

When all items above are checked:

1. **Deploy Backend:**
   ```bash
   # Follow instructions in QUICK-START.md
   ```

2. **Test Production:**
   ```bash
   curl https://your-backend-url/api/health
   curl -X POST https://your-backend-url/api/auth/admin-login \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email","password":"your-password"}'
   ```

3. **Deploy Frontend:**
   - Update API URL
   - Deploy to Vercel/Netlify
   - Test full application

---

## 🎉 Congratulations!

Your MyQuiz application is now fully deployed!

**Backend URL:** https://myquiz-zvai.onrender.com/
**Backend Platform:** Render

**Frontend URL:** https://myquiz-omega.vercel.app/
**Frontend Platform:** Vercel

**Deployed Date:** December 23, 2025

**Deployment Status:** ✅ FULLY LIVE AND CONNECTED

---

**Need Help?**
- See [QUICK-START.md](./QUICK-START.md) for step-by-step guide
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- See [SECURITY-IMPROVEMENTS.md](./SECURITY-IMPROVEMENTS.md) for security details
