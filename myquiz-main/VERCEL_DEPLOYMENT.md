# Vercel Deployment Setup Guide

## Environment Variables Setup

For the app to work properly on Vercel, you MUST set these environment variables in your Vercel project:

### Go to Vercel Dashboard:
1. Open your project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Add the following variables (one by one):

### Required Environment Variables:

```
VITE_FIREBASE_API_KEY=AIzaSyCGtqQjobzWnZFzIlyLojGoE3gRUkKrO5w
VITE_FIREBASE_AUTH_DOMAIN=my-quiz-app-b7732.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-quiz-app-b7732
VITE_FIREBASE_STORAGE_BUCKET=my-quiz-app-b7732.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=38781792172
VITE_FIREBASE_APP_ID=1:38781792172:web:08fb60cfbfc59492929409
VITE_FIREBASE_MEASUREMENT_ID=G-GGBZTW1ZNZ
VITE_API_BASE=https://myquiz-zvai.onrender.com/api
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=admin123
VITE_ADMIN_PANEL_URL=https://myquiz-zvai.onrender.com
```

### Important Notes:
- All variables should be set for **Production**, **Preview**, and **Development** environments
- After adding variables, **redeploy** your project for changes to take effect
- The `.env` file is NOT uploaded to GitHub and NOT used in production
- Environment variables must be prefixed with `VITE_` to be accessible in Vite

## Deployment Commands (Already Configured)

These are already set in `vercel.json`:
- **Build Command**: `cd myquiz-main && npm install && npm run build`
- **Output Directory**: `myquiz-main/dist`
- **Install Command**: `cd myquiz-main && npm install`

## Troubleshooting

### If Firebase doesn't work:
- Check browser console for errors
- Verify all `VITE_FIREBASE_*` variables are set in Vercel
- Redeploy after setting variables

### If API calls fail:
- Check `VITE_API_BASE` is set correctly
- Verify backend is running at https://myquiz-zvai.onrender.com/api

### If admin login doesn't work:
- Verify `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD` are set
- These should match your backend admin credentials

## Manual Redeploy Steps
1. Go to Vercel Dashboard
2. Select your project
3. Click **Deployments** tab
4. Click **...** menu on latest deployment
5. Click **Redeploy**
