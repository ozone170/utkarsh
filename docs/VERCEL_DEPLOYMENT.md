# 🚀 Vercel Frontend Deployment Guide

## Phase D4: Deploy Frontend to Vercel

---

## D4.1 - Frontend Preparation ✅

### Project Structure Verification
```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js ✓ (uses VITE_API_BASE_URL)
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── package.json ✓ (build script present)
├── .env (local only)
└── .env.example
```

### Package.json Scripts ✅
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Axios Configuration ✅
File: `frontend/src/api/axios.js`
```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});
```

### Environment Variables ✅
File: `frontend/.env` (local development)
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## D4.2 - Create Vercel Project

### Step 1: Sign Up/Login to Vercel
1. Go to: https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find your repository: `ozone170/utkarsh`
3. Click **"Import"**

### Step 3: Configure Project
**Root Directory**: `frontend`
- Click **"Edit"** next to Root Directory
- Enter: `frontend`
- This tells Vercel to build from the frontend folder

**Framework Preset**: `Vite`
- Vercel should auto-detect this
- If not, select **"Vite"** from dropdown

**Build Settings** (Auto-detected):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 4: Configure Build Settings (Verify)
```
Framework Preset:    Vite
Build Command:       npm run build
Output Directory:    dist
Install Command:     npm install
Root Directory:      frontend
```

---

## D4.3 - Set Environment Variables

### In Vercel Dashboard

1. Before clicking **"Deploy"**, scroll down to **"Environment Variables"**
2. Add the following:

**Variable 1:**
- Name: `VITE_API_BASE_URL`
- Value: `https://utkarsh-backend.onrender.com/`
- Environment: **Production** (check this)

**Important Notes**:
- ✅ Include trailing slash: `https://utkarsh-backend.onrender.com/`
- ✅ Use your actual Render backend URL
- ✅ Must start with `VITE_` for Vite to expose it

### Alternative: Add After Deployment
1. Go to Project Settings → Environment Variables
2. Add `VITE_API_BASE_URL`
3. Redeploy from Deployments tab

---

## D4.4 - Build & Deploy

### Step 1: Deploy
1. Click **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build command (`npm run build`)
   - Deploy the `dist` folder
3. Wait 2-5 minutes for deployment

### Step 2: Monitor Build
- Watch the build logs in real-time
- Look for any errors
- Build should complete successfully

### Step 3: Get Your URL
After successful deployment:
- Vercel assigns a URL: `https://utkarsh-frontend.vercel.app`
- Or custom: `https://your-project-name.vercel.app`
- Click the URL to visit your deployed site

### Step 4: Test Deployment
1. Visit your Vercel URL
2. Landing page should load
3. Check browser console for errors
4. Test navigation

---

## D4.5 - Update Backend CORS

### Step 1: Update server.js

Your backend already has CORS configured! ✅

File: `backend/src/server.js`
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://utkarsh-frontend.vercel.app',  // ← Update with your actual URL
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### Step 2: Update Allowed Origins
Replace `https://utkarsh-frontend.vercel.app` with your actual Vercel URL.

### Step 3: Add to Render Environment Variables
1. Go to Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add:
   - Key: `FRONTEND_URL`
   - Value: `https://your-actual-vercel-url.vercel.app`

### Step 4: Redeploy Backend
1. Commit changes:
```bash
git add backend/src/server.js
git commit -m "Update CORS for production frontend"
git push origin main
```
2. Render will auto-deploy
3. Wait for deployment to complete

---

## D4.6 - Production E2E Testing

### Test 1: Landing Page
- [ ] Visit: `https://your-frontend.vercel.app`
- [ ] Landing page loads
- [ ] No console errors
- [ ] Buttons work
- [ ] Navigation works

### Test 2: Student Registration
- [ ] Go to `/register`
- [ ] Fill in all fields
- [ ] Submit form
- [ ] Check browser Network tab:
  - Request to: `https://utkarsh-backend.onrender.com/api/users/register`
  - Status: 200 OK
- [ ] ID card displays
- [ ] QR code visible
- [ ] Download works
- [ ] Check MongoDB Atlas: User created in `users` collection

### Test 3: Admin Login
- [ ] Go to `/login`
- [ ] Email: `admin@utkarsh.com`
- [ ] Password: `admin123`
- [ ] Click Login
- [ ] Check Network tab:
  - Request to: `https://utkarsh-backend.onrender.com/api/auth/login`
  - Status: 200 OK
  - Response includes token
- [ ] Token stored in localStorage
- [ ] Redirected to `/admin` dashboard
- [ ] Dashboard loads with statistics

### Test 4: Admin Dashboard
- [ ] Statistics display correctly
- [ ] Can navigate to:
  - [ ] Registered Students
  - [ ] Halls List
  - [ ] Volunteers List
  - [ ] Hall Occupancy
  - [ ] Food Claims
- [ ] All pages load without errors

### Test 5: Student Management
- [ ] View registered students
- [ ] Student cards display
- [ ] Can download student ID card
- [ ] Can edit student
- [ ] Can delete student (test only)

### Test 6: Hall Management
- [ ] Create new hall
- [ ] View all halls
- [ ] Edit hall
- [ ] Delete hall (test only)

### Test 7: Scanner Login
- [ ] Logout from admin
- [ ] Login as scanner: `scanner@utkarsh.com` / `scanner123`
- [ ] Redirected to scanner page
- [ ] Scanner interface loads

### Test 8: Hall Scanning
- [ ] Select a hall
- [ ] Start scanning
- [ ] Camera permission requested
- [ ] QR scanner works
- [ ] (Test with a registered student's QR code)

### Test 9: Food Scanning
- [ ] Navigate to food scanner
- [ ] Start scanning
- [ ] Scanner works
- [ ] (Test with a registered student's QR code)

### Test 10: Mobile Testing
- [ ] Open on mobile device
- [ ] Responsive layout works
- [ ] Touch targets adequate
- [ ] Forms work
- [ ] Scanner works on mobile
- [ ] Downloads work

### Test 11: Network Tab Verification
Open browser DevTools → Network tab:
- [ ] All API calls go to: `https://utkarsh-backend.onrender.com`
- [ ] No CORS errors
- [ ] No 500 errors
- [ ] Authentication headers present
- [ ] Responses are valid JSON

---

## Troubleshooting

### Issue: CORS Error

**Error in Console**:
```
Access to XMLHttpRequest at 'https://backend.onrender.com/api/...' 
from origin 'https://frontend.vercel.app' has been blocked by CORS policy
```

**Solution**:
1. Check backend `server.js` CORS configuration
2. Verify Vercel URL is in `allowedOrigins` array
3. Add `FRONTEND_URL` to Render environment variables
4. Redeploy backend
5. Clear browser cache

### Issue: API Calls to Wrong URL

**Error**: Calls going to `http://localhost:5000`

**Solution**:
1. Check Vercel environment variables
2. Verify `VITE_API_BASE_URL` is set
3. Redeploy frontend
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: Build Failed on Vercel

**Common Causes**:
- Missing dependencies
- TypeScript errors
- ESLint errors
- Import path issues

**Solution**:
1. Check build logs on Vercel
2. Test build locally: `npm run build`
3. Fix errors
4. Commit and push
5. Redeploy

### Issue: 404 on Refresh

**Problem**: Refreshing `/admin` returns 404

**Solution**: Add `vercel.json` in frontend root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue: Environment Variables Not Working

**Check**:
1. Variable name starts with `VITE_`
2. Variable is set in Vercel dashboard
3. Deployment happened after adding variable
4. Using `import.meta.env.VITE_*` (not `process.env`)

---

## Vercel Configuration Files

### vercel.json (Optional)
Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Project Settings → Domains
2. Add your domain: `utkarsh.yourdomain.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### Update Backend CORS
Add your custom domain to `allowedOrigins`:
```javascript
'https://utkarsh.yourdomain.com'
```

---

## Performance Optimization

### Vercel Automatic Optimizations
✅ Image optimization
✅ Code splitting
✅ Compression (gzip/brotli)
✅ CDN distribution
✅ HTTPS by default
✅ HTTP/2 support

### Additional Optimizations
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Lazy load components

---

## Deployment Checklist

### Pre-Deployment
- [x] Frontend code tested locally
- [x] Build succeeds: `npm run build`
- [x] Environment variables documented
- [x] API base URL configured
- [x] CORS configured on backend

### Vercel Setup
- [ ] Vercel account created
- [ ] GitHub connected
- [ ] Repository imported
- [ ] Root directory set to `frontend`
- [ ] Framework preset: Vite
- [ ] Environment variables added

### Deployment
- [ ] First deployment successful
- [ ] Build logs show no errors
- [ ] Site accessible at Vercel URL
- [ ] No console errors in browser

### Backend Integration
- [ ] Backend CORS updated with Vercel URL
- [ ] Backend redeployed
- [ ] API calls successful
- [ ] No CORS errors
- [ ] Authentication works

### Testing
- [ ] All pages load
- [ ] Registration works
- [ ] Login works (admin & scanner)
- [ ] Dashboard displays data
- [ ] Scanning works
- [ ] Downloads work
- [ ] Mobile responsive

---

## Environment Variables Reference

### Vercel (Frontend)
```
VITE_API_BASE_URL=https://utkarsh-backend.onrender.com/
```

### Render (Backend)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret-key
FRONTEND_URL=https://utkarsh-frontend.vercel.app
```

---

## URLs Summary

After deployment, you'll have:

**Frontend**: `https://utkarsh-frontend.vercel.app`
- Landing page
- Registration
- Login
- Admin dashboard
- Scanner pages

**Backend**: `https://utkarsh-backend.onrender.com`
- API endpoints
- Authentication
- Database operations

**Database**: `utkarsh-cluster.a2ftmaf.mongodb.net`
- MongoDB Atlas
- M0 Free tier
- 512 MB storage

---

## Post-Deployment

### 1. Update Documentation
- [ ] Add production URLs to README.md
- [ ] Document admin credentials
- [ ] Update deployment status

### 2. Security
- [ ] Change default admin password
- [ ] Change default scanner password
- [ ] Verify CORS is working
- [ ] Check for exposed secrets

### 3. Monitoring
- [ ] Enable Vercel Analytics
- [ ] Monitor Render logs
- [ ] Check MongoDB Atlas metrics
- [ ] Set up error alerts

### 4. Share with Team
- [ ] Frontend URL
- [ ] Admin credentials
- [ ] Documentation links
- [ ] Support contacts

---

## Quick Commands

### Local Testing
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

### Deployment
```bash
# Commit and push
git add .
git commit -m "Production ready"
git push origin main

# Vercel and Render will auto-deploy
```

### Troubleshooting
```bash
# Check build locally
cd frontend
npm run build

# Check for errors
npm run lint

# Test production build
npm run preview
```

---

## Success Indicators

✅ **Vercel Dashboard**:
- Status: Ready
- Build: Successful
- Deployment: Active

✅ **Frontend**:
- Site loads at Vercel URL
- No console errors
- All pages accessible
- API calls successful

✅ **Backend**:
- CORS allows Vercel origin
- API responds to requests
- Authentication works

✅ **Database**:
- Data persists
- Queries execute
- No connection errors

---

## Vercel Features

### Automatic
- ✅ HTTPS/SSL certificates
- ✅ Global CDN
- ✅ Automatic deployments (on push)
- ✅ Preview deployments (on PR)
- ✅ Rollback capability
- ✅ Custom domains

### Optional
- Analytics
- Web Vitals monitoring
- Edge Functions
- Image optimization
- Serverless Functions

---

## Common Issues

### Build Fails
**Check**:
- Build logs on Vercel
- Run `npm run build` locally
- Fix any errors
- Push changes

### Site Loads but API Fails
**Check**:
- Environment variables on Vercel
- Backend CORS configuration
- Network tab in browser
- Backend is running on Render

### Blank Page
**Check**:
- Browser console for errors
- Vercel deployment logs
- Routing configuration
- Base URL in vite.config.js

---

## Deployment Complete! 🎉

Your application is now live:
- **Frontend**: https://your-frontend.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas

**Next Steps**:
1. Test all features
2. Change default passwords
3. Share with users
4. Monitor performance
5. Gather feedback

---

**Deployed By**: _________________
**Deployment Date**: _________________
**Frontend URL**: _________________
**Backend URL**: _________________
