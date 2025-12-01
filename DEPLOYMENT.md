# Deployment Guide

## Backend Deployment (Render)

### 1. Setup MongoDB Atlas
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/utkarsh`

### 2. Deploy to Render
1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Name: `utkarsh-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-strong-secret-key
   NODE_ENV=production
   PORT=5000
   ```
6. Deploy and note the URL (e.g., https://utkarsh-backend.onrender.com)

### 3. Seed Admin User
After first deployment, run seed script via Render shell:
```bash
npm run seed
```

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel
1. Create account at https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://utkarsh-backend.onrender.com
   ```
5. Deploy

## Testing Deployment

1. Visit your Vercel URL
2. Register a test student
3. Login with admin credentials:
   - Email: admin@utkarsh.com
   - Password: admin123
4. Create halls in admin dashboard
5. Test scanner functionality

## Default Credentials

- Admin: admin@utkarsh.com / admin123
- Scanner: scanner@utkarsh.com / scanner123

**Change these passwords in production!**
