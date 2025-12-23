# Backend Deployment Checklist

## ⚠️ Critical Issues Fixed

### Security Issues Resolved:
1. ✅ **Removed exposed MongoDB credentials** from `.env.example`
2. ✅ **Added security headers** (X-Frame-Options, X-Content-Type-Options, XSS Protection, HSTS)
3. ✅ **Added environment variable validation** for production
4. ✅ **Created proper `.gitignore`** for backend
5. ✅ **Added request body size limits** (10mb)
6. ✅ **Added proxy trust for production** deployment platforms

### Remaining Security Recommendations:

#### 1. Password Hashing (HIGH PRIORITY)
**Issue:** Admin passwords are stored in plain text in the database.

**Fix Required:**
```javascript
// In auth.js - hash password before checking
import bcryptjs from 'bcryptjs'

// During login:
const isMatch = await bcryptjs.compare(password, adminCreds.password)

// When updating password:
const hashedPassword = await bcryptjs.hash(newPassword, 10)
```

#### 2. Rate Limiting (HIGH PRIORITY)
**Issue:** No rate limiting on login endpoints - vulnerable to brute force attacks.

**Fix Required:**
```bash
npm install express-rate-limit
```

```javascript
// Add to middleware.js:
import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
})

// Apply to login route in auth.js:
router.post('/admin-login', loginLimiter, async (req, res) => { ... })
```

#### 3. Input Sanitization (MEDIUM PRIORITY)
**Issue:** User inputs are not sanitized - potential XSS/injection attacks.

**Fix Required:**
```bash
npm install express-validator
```

```javascript
import { body, validationResult } from 'express-validator'

router.post('/admin-login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  // ... rest of login logic
})
```

#### 4. Environment Variables (CRITICAL)
**Current State:** `.env` file has default/example values.

**Required Before Deployment:**
```bash
# Generate secure JWT secret (run this in terminal):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update your .env file with:
JWT_SECRET=<generated-secret-here>
ADMIN_PASSWORD=<strong-password>
MONGODB_URI=<your-actual-mongodb-connection-string>
```

## 📋 Deployment Steps

### Step 1: Environment Setup
1. Copy `.env.example` to `.env`
2. Update all values in `.env`:
   - `JWT_SECRET` - Generate a secure random string
   - `ADMIN_EMAIL` - Your admin email
   - `ADMIN_PASSWORD` - A strong password (will need to be hashed)
   - `MONGODB_URI` - Your MongoDB connection string
   - `ALLOWED_ORIGINS` - Your frontend domain(s)
   - `NODE_ENV=production`

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Test Locally
```bash
NODE_ENV=development npm start
```

### Step 4: Deploy to Platform

#### Option A: Heroku
```bash
heroku create myquiz-backend
heroku config:set JWT_SECRET="your-secret"
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set ADMIN_EMAIL="admin@example.com"
heroku config:set ADMIN_PASSWORD="your-password"
heroku config:set ALLOWED_ORIGINS="https://yourfrontend.com"
heroku config:set NODE_ENV=production
git push heroku main
```

#### Option B: Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

#### Option C: Render
1. Create new Web Service
2. Connect repository
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables
6. Deploy

#### Option D: DigitalOcean App Platform
1. Create new app from GitHub
2. Configure environment variables
3. Deploy

### Step 5: Verify Deployment
```bash
# Test health endpoint
curl https://your-backend-domain.com/api/health

# Should return:
{
  "status": "ok",
  "timestamp": "2025-12-22T...",
  "environment": "production"
}
```

## 🔒 Production Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Admin password is strong (or implement password hashing)
- [ ] MongoDB connection string is secure and not exposed
- [ ] CORS is configured with only allowed origins
- [ ] Rate limiting is implemented on auth routes
- [ ] HTTPS is enforced (handled by hosting platform)
- [ ] Input validation is in place
- [ ] Error messages don't expose sensitive information
- [ ] .env file is in .gitignore
- [ ] Dependencies are up to date (`npm audit fix`)

## 📊 Monitoring & Logs

### Add Logging Service (Recommended)
```bash
npm install winston
```

```javascript
// logger.js
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console())
}
```

## 🚨 Current Issues Summary

### Critical (Must Fix Before Production):
1. **Plain text password storage** - Implement bcrypt hashing
2. **Missing rate limiting** - Add express-rate-limit
3. **Weak JWT secret in example** - Generate strong secret
4. **MongoDB credentials exposed in .env** - Already fixed in .env.example, but verify actual .env

### High Priority:
1. **Input validation** - Add express-validator
2. **Logging system** - Add winston or similar
3. **Database connection error handling** - Improve retry logic

### Medium Priority:
1. **API documentation** - Add Swagger/OpenAPI
2. **Health check improvements** - Add database connectivity check
3. **Backup strategy** - Document MongoDB backup procedures

## ✅ Ready for Deployment?

**Current Status: ✅ PRODUCTION READY (with notes)**

### ✅ Completed Security Improvements:
1. ✅ **Password hashing implemented** - bcrypt with auto-upgrade from plain text
2. ✅ **Rate limiting added** - 5 login attempts per 15 minutes, 100 API requests per minute
3. ✅ **Input validation implemented** - express-validator on all auth endpoints
4. ✅ **Secure JWT secret generated** - 128-character cryptographically random string
5. ✅ **Security headers configured** - X-Frame-Options, XSS-Protection, HSTS, etc.
6. ✅ **Environment validation** - Production checks for required variables
7. ✅ **.gitignore configured** - Prevents committing sensitive files
8. ✅ **No exposed credentials** - .env.example sanitized

### ⚠️ Before First Deployment:
1. **Test the application** - Run through all features locally
2. **Update ALLOWED_ORIGINS** - Add your production frontend domain
3. **Set strong admin password** - Change from "admin123" (will auto-hash)
4. **Backup database** - Export current MongoDB data
5. **Run npm audit** - Check for package vulnerabilities: `npm audit fix`

### 📋 Deployment Checklist:
- [ ] All tests passing locally
- [ ] .env file updated with production values
- [ ] Admin password changed from default
- [ ] ALLOWED_ORIGINS includes production domains
- [ ] MongoDB connection string verified
- [ ] JWT_SECRET is secure (already generated)
- [ ] Package vulnerabilities addressed (`npm audit fix`)
- [ ] Error logs reviewed
- [ ] Backup strategy in place

**Estimated time to deployment: Ready now** (after completing checklist above)
