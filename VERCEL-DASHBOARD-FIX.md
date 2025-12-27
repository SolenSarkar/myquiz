# CRITICAL: Vercel Dashboard Configuration Required

## Problem
Vercel is returning 404 for all routes except `/` because the `vercel.json` file is being ignored.

## Solution: Manual Vercel Dashboard Configuration

### Step 1: Clear Root Directory
1. Go to https://vercel.com/dashboard
2. Select your project: `myquiz-omega` or similar
3. Click **Settings** → **General**
4. Scroll to **Root Directory**
5. If it shows `myquiz-main`, click **Edit**
6. **CLEAR IT COMPLETELY** (leave blank/empty)
7. Click **Save**

### Step 2: Configure Build Settings
1. Still in **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Click **Edit** (or **Override**)
4. Set these values:
   - **Framework Preset**: `Vite`
   - **Build Command**: `cd myquiz-main && npm install && npm run build`
   - **Output Directory**: `myquiz-main/dist`
   - **Install Command**: `npm install --prefix myquiz-main`
5. Click **Save**

### Step 3: Add Environment Variable
1. Click **Settings** → **Environment Variables**
2. Click **Add New**
3. Add:
   - **Key**: `VITE_API_BASE`
   - **Value**: `https://myquiz-1-zvjx.onrender.com/api`
   - **Environments**: Check ✓ Production, ✓ Preview, ✓ Development
4. Click **Save**

### Step 4: Add Redirect Rule (If Available)
1. In **Settings**, look for **Redirects** or **Rewrites** section
2. If found, add:
   - **Source**: `/(.*)`
   - **Destination**: `/index.html`
   - **Type**: Rewrite (not Redirect)
   - **Permanent**: NO
3. Click **Save**

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **Redeploy**
5. Wait 2-3 minutes

### Step 6: Test After Deployment
Visit these URLs:
- https://myquiz-omega.vercel.app (should work)
- https://myquiz-omega.vercel.app/admin-index (should load login page)
- https://myquiz-omega.vercel.app/quiz (should work)

## Why This Is Needed
Vercel ignores `vercel.json` when:
- Root Directory is set in the Dashboard
- Dashboard settings override file-based config
- Project was created with specific framework presets

## Alternative: Use Vercel CLI
If Dashboard doesn't work, try:
```bash
npm install -g vercel
cd d:\MYQUIZ
vercel --prod
```

## Current Status
✅ Code is correct
✅ Backend API working (tested)
✅ Local build working
❌ Vercel routing not working (Dashboard config needed)
