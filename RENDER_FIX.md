# Render Deployment Configuration Fix

## Problem
Your Render backend service at https://myquiz-zvai.onrender.com is showing errors because it's not properly configured to find the backend code.

## Solution

### Option 1: Use render.yaml Blueprint (Recommended)

I've created a `render.yaml` file at the repository root. To use it:

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect to your repository
4. Render will automatically detect and use the `render.yaml` configuration
5. It will set the correct root directory: `myquiz-main/backend`

### Option 2: Manual Configuration

If you're not using a blueprint, update your existing service:

1. Go to https://dashboard.render.com
2. Select your service: **myquiz-zvai**
3. Click **"Settings"**
4. Update these settings:
   - **Root Directory**: `myquiz-main/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Save Changes"**
6. Go to **"Manual Deploy"** → **"Deploy latest commit"**

### Required Environment Variables

Make sure these are set in Render:

```
NODE_ENV=production
JWT_SECRET=cea00fc4c9a3882c04bc27f4e6840b4ab5dc9fd5282e4690e20a8fac313f78f88dcd658080aef6d1d6095179010bd37644c285c65c4e87620383787fa5e0581a
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://myquiz-omega.vercel.app
MONGODB_URI=mongodb+srv://myquiz_db_user:admin123@cluster0.z2qjqjo.mongodb.net/quizdb?retryWrites=true&w=majority
```

## Verify Deployment

After deployment, test these URLs:

1. **Root**: https://myquiz-zvai.onrender.com
   - Should show API info

2. **Health Check**: https://myquiz-zvai.onrender.com/api/health
   - Should return: `{"status":"ok",...}`

3. **Quizzes**: https://myquiz-zvai.onrender.com/api/quizzes
   - Should return array of quizzes

## Common Issues

**Issue: Service keeps sleeping**
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Solution: Upgrade to paid plan or use UptimeRobot to ping every 5 minutes

**Issue: Still getting errors**
- Check **Logs** tab in Render dashboard
- Look for startup errors or missing environment variables
- Make sure MongoDB connection string is correct

**Issue: 404 errors**
- Verify root directory is set to `myquiz-main/backend`
- Check that all routes start with `/api/`
- Enable request logging to see which paths are being accessed
