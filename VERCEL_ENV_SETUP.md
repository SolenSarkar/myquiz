# CRITICAL: Vercel Environment Variables Setup

## Problem
Your Vercel site shows "code not found" or API errors because environment variables are NOT set in Vercel.

## ⚠️ IMPORTANT: Environment variables from .env files are NOT automatically deployed to Vercel!

You MUST manually add them in Vercel Dashboard.

---

## Step-by-Step Fix

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on your project: **myquiz-omega** (or whatever your project name is)

### 3. Go to Settings → Environment Variables
Click **"Settings"** tab → **"Environment Variables"** in the left sidebar

### 4. Add Each Variable One by One

Click **"Add New"** and add these variables:

#### Variable 1: VITE_API_BASE
```
Key: VITE_API_BASE
Value: https://myquiz-zvai.onrender.com/api
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 2: VITE_FIREBASE_API_KEY
```
Key: VITE_FIREBASE_API_KEY
Value: AIzaSyCGtqQjobzWnZFzIlyLojGoE3gRUkKrO5w
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 3: VITE_FIREBASE_AUTH_DOMAIN
```
Key: VITE_FIREBASE_AUTH_DOMAIN
Value: my-quiz-app-b7732.firebaseapp.com
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 4: VITE_FIREBASE_PROJECT_ID
```
Key: VITE_FIREBASE_PROJECT_ID
Value: my-quiz-app-b7732
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 5: VITE_FIREBASE_STORAGE_BUCKET
```
Key: VITE_FIREBASE_STORAGE_BUCKET
Value: my-quiz-app-b7732.appspot.com
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 6: VITE_FIREBASE_MESSAGING_SENDER_ID
```
Key: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 38781792172
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 7: VITE_FIREBASE_APP_ID
```
Key: VITE_FIREBASE_APP_ID
Value: 1:38781792172:web:08fb60cfbfc59492929409
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 8: VITE_FIREBASE_MEASUREMENT_ID
```
Key: VITE_FIREBASE_MEASUREMENT_ID
Value: G-GGBZTW1ZNZ
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 9: VITE_ADMIN_EMAIL
```
Key: VITE_ADMIN_EMAIL
Value: admin@example.com
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 10: VITE_ADMIN_PASSWORD
```
Key: VITE_ADMIN_PASSWORD
Value: admin123
Environments: ✓ Production  ✓ Preview  ✓ Development
```

#### Variable 11: VITE_ADMIN_PANEL_URL
```
Key: VITE_ADMIN_PANEL_URL
Value: https://myquiz-zvai.onrender.com
Environments: ✓ Production  ✓ Preview  ✓ Development
```

### 5. Save and Redeploy

After adding ALL variables:

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for deployment to complete

---

## Quick Copy-Paste for Vercel

If Vercel allows bulk import, use this format:

```env
VITE_API_BASE=https://myquiz-zvai.onrender.com/api
VITE_FIREBASE_API_KEY=AIzaSyCGtqQjobzWnZFzIlyLojGoE3gRUkKrO5w
VITE_FIREBASE_AUTH_DOMAIN=my-quiz-app-b7732.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-quiz-app-b7732
VITE_FIREBASE_STORAGE_BUCKET=my-quiz-app-b7732.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=38781792172
VITE_FIREBASE_APP_ID=1:38781792172:web:08fb60cfbfc59492929409
VITE_FIREBASE_MEASUREMENT_ID=G-GGBZTW1ZNZ
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=admin123
VITE_ADMIN_PANEL_URL=https://myquiz-zvai.onrender.com
```

---

## Verify It's Working

After redeployment:

1. **Visit your Vercel site**: https://myquiz-omega.vercel.app
2. **Open browser console** (F12)
3. **Check for errors**:
   - Should NOT see "Firebase API key missing"
   - Should NOT see "Network Error" or CORS errors
4. **Try to load quizzes**: Go to quiz page
   - Should load quizzes from backend

---

## Why This Happens

- `.env` files are gitignored (not uploaded to Git)
- Vercel builds from Git repository
- Vercel needs variables added manually in dashboard
- Without variables, `import.meta.env.VITE_*` returns `undefined`

---

## Common Mistakes

❌ **Don't**: Try to commit .env file to Git
✅ **Do**: Add variables in Vercel Dashboard

❌ **Don't**: Forget to select all environments (Production, Preview, Development)
✅ **Do**: Check all three boxes for each variable

❌ **Don't**: Forget to redeploy after adding variables
✅ **Do**: Redeploy from Deployments tab after adding all variables

---

## Need Help?

If it still doesn't work after setting variables:

1. Check Vercel deployment logs for errors
2. Check browser console for errors
3. Verify backend is running: https://myquiz-zvai.onrender.com/api/health
4. Test API call directly: https://myquiz-zvai.onrender.com/api/quizzes
