# ✅ Phase D5 Complete - Vercel ↔ Render Connection Ready

## Summary
Your frontend and backend are now configured to communicate in production.

---

## ✅ D5.1 - Vercel Environment Variables

### Action Required on Vercel Dashboard:
1. Go to: https://vercel.com/dashboard
2. Select project: **utkarsh-ashen**
3. Go to: **Settings** → **Environment Variables**
4. Add/Verify:

```
Name:  VITE_API_BASE_URL
Value: https://utkarsh-backend.onrender.com/
Scope: Production
```

5. After adding/updating, click **"Redeploy"**

---

## ✅ D5.2 - Frontend Axios Configuration

**File**: `frontend/src/api/axios.js`

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL  ✅
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
```

**Status**: ✅ Configured correctly

**All Pages Verified**: ✅
- All pages import: `import axios from '../api/axios'`
- No hardcoded `localhost:5000` URLs found
- All API calls use the configured axios instance

---

## ✅ D5.3 - Backend CORS Configuration

**File**: `backend/src/server.js`

```javascript
// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',              // Local development
  'http://localhost:5174',              // Alternative local port
  'https://utkarsh-ashen.vercel.app',   // Production Vercel URL ✅
  process.env.FRONTEND_URL              // Dynamic from env
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

**Status**: ✅ Updated with your Vercel URL

---

## ✅ Backend Environment Variables

**File**: `backend/.env`

```env
FRONTEND_URL=https://utkarsh-ashen.vercel.app
```

**Status**: ✅ Configured

### Action Required on Render Dashboard:
1. Go to: https://dashboard.render.com
2. Select service: **utkarsh-backend**
3. Go to: **Environment** tab
4. Add/Update:

```
Key:   FRONTEND_URL
Value: https://utkarsh-ashen.vercel.app
```

5. Click **"Save Changes"**
6. Render will auto-redeploy

---

## Deployment Checklist

### Backend (Render)
- [x] CORS configured with Vercel URL
- [x] `.env` updated with `FRONTEND_URL`
- [ ] Push changes to GitHub
- [ ] Add `FRONTEND_URL` to Render environment variables
- [ ] Verify Render auto-deploys or trigger manual deploy

### Frontend (Vercel)
- [x] Axios uses `VITE_API_BASE_URL`
- [x] No hardcoded localhost URLs
- [x] All pages use axios instance
- [ ] Add `VITE_API_BASE_URL` to Vercel environment variables
- [ ] Redeploy on Vercel

---

## Git Commands

```bash
# Commit backend changes
git add backend/src/server.js backend/.env
git commit -m "Configure CORS for Vercel production deployment"
git push origin main
```

**Note**: Render will automatically redeploy when you push to GitHub.

---

## Testing After Deployment

### 1. Check Backend CORS
Visit: `https://utkarsh-backend.onrender.com/`

Expected response:
```json
{
  "message": "Utkarsh API is running"
}
```

### 2. Check Frontend
Visit: `https://utkarsh-ashen.vercel.app`

**Open Browser Console** (F12):
- Should see no CORS errors
- Network tab should show API calls to: `https://utkarsh-backend.onrender.com/api/...`

### 3. Test Registration
1. Go to: `https://utkarsh-ashen.vercel.app/register`
2. Fill in student details
3. Submit form
4. Check Network tab:
   - Request URL: `https://utkarsh-backend.onrender.com/api/users/register`
   - Status: 200 OK
   - No CORS errors

### 4. Test Login
1. Go to: `https://utkarsh-ashen.vercel.app/login`
2. Login as admin: `admin@utkarsh.com` / `admin123`
3. Check Network tab:
   - Request URL: `https://utkarsh-backend.onrender.com/api/auth/login`
   - Status: 200 OK
   - Token received

### 5. Test Admin Dashboard
1. After login, verify dashboard loads
2. Check all API calls succeed
3. Navigate to different pages
4. Verify no errors

---

## Environment Variables Summary

### Vercel (Frontend)
```env
VITE_API_BASE_URL=https://utkarsh-backend.onrender.com/
```

### Render (Backend)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://utkarsh_admin:FMPsdvN58kbvgap5@utkarsh-cluster.a2ftmaf.mongodb.net/utkarsh?retryWrites=true&w=majority
JWT_SECRET=a4d94886e95df7bb5606d2c4693efb4f
FRONTEND_URL=https://utkarsh-ashen.vercel.app
```

---

## Troubleshooting

### CORS Error in Browser Console
```
Access to XMLHttpRequest at 'https://utkarsh-backend.onrender.com/api/...' 
from origin 'https://utkarsh-ashen.vercel.app' has been blocked by CORS policy
```

**Solution**:
1. Verify `FRONTEND_URL` is set in Render environment variables
2. Check backend CORS configuration includes your Vercel URL
3. Redeploy backend on Render
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### API Calls Going to localhost
**Solution**:
1. Verify `VITE_API_BASE_URL` is set in Vercel
2. Redeploy frontend on Vercel
3. Hard refresh browser

### 404 or 500 Errors
**Solution**:
1. Check Render logs for backend errors
2. Verify MongoDB connection string is correct
3. Ensure all environment variables are set

---

## Next Steps

1. **Commit & Push Backend Changes**
   ```bash
   git add .
   git commit -m "Configure production CORS and environment"
   git push origin main
   ```

2. **Configure Vercel Environment Variables**
   - Add `VITE_API_BASE_URL`
   - Redeploy

3. **Configure Render Environment Variables**
   - Add `FRONTEND_URL`
   - Wait for auto-deploy

4. **Test End-to-End**
   - Registration
   - Login
   - Admin dashboard
   - Scanner pages

5. **Change Default Passwords**
   - Admin: `admin@utkarsh.com`
   - Scanner: `scanner@utkarsh.com`

---

## Production URLs

- **Frontend**: https://utkarsh-ashen.vercel.app
- **Backend**: https://utkarsh-backend.onrender.com
- **Database**: MongoDB Atlas (utkarsh-cluster)

---

**Phase D5 Status**: ✅ Configuration Complete
**Next Phase**: Testing & Production Launch

