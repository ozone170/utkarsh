# 🚀 Deployment Guide - Utkarsh Fresher Manager

## Overview
This guide will help you deploy the Utkarsh Fresher Manager application to production using:
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel/Netlify (Free tier)
- **Database**: MongoDB Atlas (Free tier)

---

## Phase D1: Prepare Backend for Production ✅

### Backend Structure Verification
```
/backend
  ├── src/
  │   ├── server.js
  │   ├── config/
  │   │   └── db.js
  │   ├── routes/
  │   ├── controllers/
  │   ├── models/
  │   ├── middleware/
  │   └── services/
  ├── package.json
  ├── .env (local only)
  └── .env.example
```

### Package.json Scripts ✅
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "seed": "node src/seed.js"
  }
}
```

### Environment Variables
Create `backend/.env` for local development:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/utkarsh
JWT_SECRET=a4d94886e95df7bb5606d2c4693efb4f
```

---

## Phase D2: Create Cloud Database (MongoDB Atlas) 🌍

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email

### Step 2: Create a Cluster
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to your users
5. Cluster Name: `utkarsh-cluster`
6. Click **"Create Cluster"**

### Step 3: Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `utkarsh_admin`
5. Password: Generate a secure password (e.g., `FMPsdvN58kbvgap5`)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

**⚠️ IMPORTANT**: Save your password securely!

### Step 4: Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. IP Address: `0.0.0.0/0`
5. Click **"Confirm"**

**Note**: For production, restrict to specific IPs for better security.

### Step 5: Get Connection String
1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string

### Connection String Format
```
mongodb+srv://utkarsh_admin:FMPsdvN58kbvgap5@utkarsh-cluster.a2ftmaf.mongodb.net/utkarsh?retryWrites=true&w=majority
```

**Replace**:
- `utkarsh_admin` - Your database username
- `FMPsdvN58kbvgap5` - Your database password
- `utkarsh-cluster.a2ftmaf` - Your cluster address
- `utkarsh` - Your database name

### Step 6: Test Connection Locally
1. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://utkarsh_admin:YOUR_PASSWORD@utkarsh-cluster.a2ftmaf.mongodb.net/utkarsh?retryWrites=true&w=majority
```

2. Start backend:
```bash
cd backend
npm start
```

3. Look for: `MongoDB Connected: utkarsh-cluster-shard-00-00.a2ftmaf.mongodb.net`

### Step 7: Seed Database (Optional)
```bash
cd backend
npm run seed
```

This creates default admin users:
- Admin: `admin@utkarsh.com` / `admin123`
- Scanner: `scanner@utkarsh.com` / `scanner123`

---

## Phase D3: Deploy Backend to Render

### Step 1: Prepare Repository
1. Ensure `.gitignore` includes `.env`
2. Push code to GitHub/GitLab

### Step 2: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub/GitLab
3. Authorize Render to access your repository

### Step 3: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - **Name**: `utkarsh-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 4: Add Environment Variables
In Render dashboard, add:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://utkarsh_admin:FMPsdvN58kbvgap5@utkarsh-cluster.a2ftmaf.mongodb.net/utkarsh?retryWrites=true&w=majority
JWT_SECRET=your-production-secret-key-here
```

**⚠️ Generate a new JWT_SECRET for production!**

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend URL: `https://utkarsh-backend.onrender.com`

### Step 6: Test Backend
Visit: `https://utkarsh-backend.onrender.com`

Should see: `{"message":"Utkarsh API is running"}`

### Step 7: Seed Database via HTTP Endpoint

**⚠️ Important**: Render free tier doesn't provide shell access, so we use a temporary HTTP endpoint.

1. **Call seed endpoint**:
   - Visit: `https://utkarsh-backend.onrender.com/seed`
   - Should see success message with created users

2. **Verify seeding**:
   - Admin: `admin@utkarsh.com` / `admin123`
   - Scanner: `scanner@utkarsh.com` / `scanner123`

3. **Remove seed endpoint** (CRITICAL!):
   - Delete `backend/src/routes/seedRoute.js`
   - Remove seed route import and usage from `backend/src/server.js`
   - Commit and push changes
   - Wait for redeployment

**Detailed Instructions**: See [SEED_ENDPOINT_GUIDE.md](SEED_ENDPOINT_GUIDE.md)

---

## Phase D4: Deploy Frontend to Vercel

### Step 1: Update Frontend API URL
Update `frontend/.env`:
```env
VITE_API_BASE_URL=https://utkarsh-backend.onrender.com
```

### Step 2: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub/GitLab
3. Authorize Vercel

### Step 3: Deploy Frontend
1. Click **"Add New Project"**
2. Import your repository
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4: Add Environment Variables
```
VITE_API_BASE_URL=https://utkarsh-backend.onrender.com
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Your frontend URL: `https://utkarsh-fresher-manager.vercel.app`

---

## Phase D5: Configure CORS

Update `backend/src/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://utkarsh-fresher-manager.vercel.app'
  ],
  credentials: true
}));
```

Redeploy backend after this change.

---

## Post-Deployment Checklist

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string tested locally
- [ ] Backend deployed to Render
- [ ] Environment variables set on Render
- [ ] Backend URL accessible
- [ ] API endpoints working

### Frontend
- [ ] API URL updated to production backend
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on Vercel
- [ ] Frontend URL accessible
- [ ] Can register students
- [ ] Can login as admin
- [ ] All features working

### Database
- [ ] Database seeded with admin users
- [ ] Can create/read/update/delete records
- [ ] Indexes created (automatic with Mongoose)

---

## Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure password doesn't contain special characters (URL encode if needed)

**Error: "Application failed to start"**
- Check Render logs
- Verify `package.json` scripts
- Ensure all dependencies are in `dependencies` (not `devDependencies`)

**Error: "CORS policy blocked"**
- Update CORS configuration in `server.js`
- Add frontend URL to allowed origins
- Redeploy backend

### Frontend Issues

**Error: "Network Error"**
- Check API URL in `.env`
- Verify backend is running
- Check browser console for CORS errors

**Error: "Build failed"**
- Check build logs on Vercel
- Verify all dependencies are installed
- Test build locally: `npm run build`

### Database Issues

**Error: "Authentication failed"**
- Verify database username and password
- Check if user has correct permissions
- Ensure password is URL encoded

**Error: "Connection timeout"**
- Check network access settings
- Verify IP whitelist includes 0.0.0.0/0
- Check if cluster is active

---

## Security Best Practices

### Production Environment

1. **Generate Strong JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **Restrict MongoDB Access**
- Instead of 0.0.0.0/0, add specific IPs
- Add Render's IP addresses

3. **Use Environment Variables**
- Never commit `.env` files
- Use platform-specific environment variable management

4. **Enable HTTPS**
- Both Render and Vercel provide HTTPS by default

5. **Rate Limiting**
- Consider adding rate limiting middleware
- Protect against brute force attacks

---

## Monitoring & Maintenance

### Render Dashboard
- Monitor backend logs
- Check resource usage
- View deployment history

### Vercel Dashboard
- Monitor frontend analytics
- Check build logs
- View deployment history

### MongoDB Atlas
- Monitor database metrics
- Set up alerts for high usage
- Review slow queries

---

## Cost Considerations

### Free Tier Limits

**MongoDB Atlas (M0)**
- 512 MB storage
- Shared RAM
- Shared vCPU
- Good for: ~500-1000 students

**Render (Free)**
- 750 hours/month
- Spins down after 15 min inactivity
- 512 MB RAM
- Note: First request after spin-down takes 30-60 seconds

**Vercel (Hobby)**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### Upgrade Recommendations

**If you exceed limits:**
- MongoDB Atlas: Upgrade to M10 ($0.08/hour)
- Render: Upgrade to Starter ($7/month)
- Vercel: Upgrade to Pro ($20/month)

---

## Support & Resources

### Documentation
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- MongoDB Community Forums
- Render Community
- Vercel Discord

---

## Summary

✅ **Backend**: Deployed to Render with MongoDB Atlas
✅ **Frontend**: Deployed to Vercel
✅ **Database**: MongoDB Atlas (Free M0 cluster)
✅ **CORS**: Configured for production
✅ **Environment**: Production-ready configuration

**Your Application URLs:**
- Frontend: `https://utkarsh-fresher-manager.vercel.app`
- Backend: `https://utkarsh-backend.onrender.com`
- Database: `utkarsh-cluster.a2ftmaf.mongodb.net`

**Default Admin Credentials:**
- Email: `admin@utkarsh.com`
- Password: `admin123`

**⚠️ Remember to change default passwords in production!**

---

**Deployment Complete! 🎉**
