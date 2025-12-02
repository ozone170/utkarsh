# 🌱 Seed Endpoint Guide - Render Deployment

## Overview
Since Render's free tier doesn't provide shell access, we've created a temporary HTTP endpoint to seed the database with admin and scanner users.

**⚠️ IMPORTANT**: This endpoint should be removed immediately after seeding!

---

## Step-by-Step Instructions

### Step 1: Deploy Backend to Render

1. **Push code to GitHub**:
```bash
git add .
git commit -m "Add temporary seed endpoint for Render deployment"
git push origin main
```

2. **Deploy on Render**:
   - Go to your Render dashboard
   - Your service will auto-deploy (if auto-deploy is enabled)
   - OR click **"Manual Deploy"** → **"Deploy latest commit"**
   - Wait for status to show **"Live"** (3-5 minutes)

3. **Verify deployment**:
   - Visit: `https://your-backend.onrender.com`
   - Should see: `{"message":"Utkarsh API is running"}`

### Step 2: Run Seed Endpoint

**Method 1: Browser**
1. Open your browser
2. Navigate to: `https://your-backend.onrender.com/seed`
3. You should see:
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "users": [
    {
      "email": "admin@utkarsh.com",
      "password": "admin123",
      "role": "ADMIN"
    },
    {
      "email": "scanner@utkarsh.com",
      "password": "scanner123",
      "role": "SCANNER"
    }
  ],
  "timestamp": "2024-12-02T10:30:00.000Z",
  "warning": "⚠️ Remove this endpoint after seeding!"
}
```

**Method 2: cURL**
```bash
curl https://your-backend.onrender.com/seed
```

**Method 3: Postman/Thunder Client**
- Method: GET
- URL: `https://your-backend.onrender.com/seed`
- Send request

### Step 3: Verify Seeding

1. **Test Admin Login**:
   - Go to your frontend: `https://your-frontend.vercel.app/login`
   - Email: `admin@utkarsh.com`
   - Password: `admin123`
   - Should successfully log in to admin dashboard

2. **Test Scanner Login**:
   - Email: `scanner@utkarsh.com`
   - Password: `scanner123`
   - Should successfully log in to scanner page

### Step 4: Remove Seed Endpoint (CRITICAL!)

**⚠️ DO NOT SKIP THIS STEP!**

1. **Remove seed route from server.js**:

Open `backend/src/server.js` and remove these lines:
```javascript
import seedRoute from './routes/seedRoute.js';  // ← Remove this

// ⚠️ TEMPORARY: Seed endpoint for production deployment
// Remove this route after initial database seeding
app.use('/seed', seedRoute);  // ← Remove this
```

2. **Delete seed route file**:
```bash
rm backend/src/routes/seedRoute.js
```

Or manually delete: `backend/src/routes/seedRoute.js`

3. **Commit and push**:
```bash
git add .
git commit -m "Remove temporary seed endpoint"
git push origin main
```

4. **Verify removal**:
   - Wait for Render to redeploy
   - Visit: `https://your-backend.onrender.com/seed`
   - Should see: `404 Not Found` or similar error
   - ✅ Endpoint successfully removed!

---

## What the Seed Endpoint Does

### Creates Two Users

**1. Admin User**
- Email: `admin@utkarsh.com`
- Password: `admin123`
- Role: `ADMIN`
- Access: Full admin dashboard, all management features

**2. Scanner User**
- Email: `scanner@utkarsh.com`
- Password: `scanner123`
- Role: `SCANNER`
- Access: Hall and food scanning pages

### Idempotent Operation
- Running the endpoint multiple times is safe
- It checks if users exist before creating
- Won't create duplicates
- Will return success even if users already exist

---

## Troubleshooting

### Error: "Seeding failed"

**Check Render Logs**:
1. Go to Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Look for error messages

**Common Issues**:

**1. Database Connection Failed**
```
Error: Could not connect to MongoDB
```
**Solution**:
- Check `MONGODB_URI` environment variable on Render
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database user credentials are correct

**2. Authentication Failed**
```
MongoServerError: bad auth
```
**Solution**:
- Verify database username and password
- Check if password has special characters (URL encode them)
- Regenerate database user password

**3. Network Timeout**
```
Error: connection timed out
```
**Solution**:
- Check MongoDB Atlas cluster is active
- Verify network access settings
- Wait a few minutes and try again

### Endpoint Returns 404

**Before Seeding**:
- Check if deployment is complete (status: "Live")
- Verify URL is correct
- Check Render logs for startup errors

**After Removal**:
- ✅ This is expected! Endpoint was successfully removed.

### Users Already Exist

**Response**:
```json
{
  "success": true,
  "message": "Database seeded successfully"
}
```

**This is normal!** The endpoint is idempotent and won't create duplicates.

---

## Security Considerations

### Why Remove the Endpoint?

**Security Risks**:
1. **Public Access**: Anyone can call the endpoint
2. **Information Disclosure**: Reveals default credentials
3. **Unnecessary Attack Surface**: No longer needed after seeding

**Best Practices**:
- Remove immediately after use
- Change default passwords in production
- Use environment variables for sensitive data

### Alternative: Protected Endpoint

If you need to keep the endpoint for re-seeding:

```javascript
router.get('/', async (req, res) => {
  // Add authentication
  const secretKey = req.headers['x-seed-key'];
  if (secretKey !== process.env.SEED_SECRET_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  // ... rest of seed logic
});
```

Then add `SEED_SECRET_KEY` to Render environment variables.

---

## Local Development

### Running Seed Locally

**Method 1: CLI (Recommended)**
```bash
cd backend
npm run seed
```

**Method 2: HTTP Endpoint**
```bash
# Start server
npm run dev

# In another terminal or browser
curl http://localhost:5000/seed
```

### Testing Seed Function

```javascript
import { seedDatabase } from './src/seed.js';
import { connectDB } from './src/config/db.js';

await connectDB();
await seedDatabase();
```

---

## Deployment Checklist

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database connection string added to Render
- [ ] Environment variables configured

### During Deployment
- [ ] Render deployment successful
- [ ] Backend URL accessible
- [ ] API root endpoint works

### After Deployment
- [ ] Seed endpoint called successfully
- [ ] Admin login works
- [ ] Scanner login works
- [ ] **Seed endpoint removed**
- [ ] Removal verified (404 response)

---

## Quick Reference

### URLs
```
Backend Root:  https://your-backend.onrender.com
Seed Endpoint: https://your-backend.onrender.com/seed
```

### Default Credentials
```
Admin:   admin@utkarsh.com   / admin123
Scanner: scanner@utkarsh.com / scanner123
```

### Commands
```bash
# Deploy
git push origin main

# Remove seed endpoint
rm backend/src/routes/seedRoute.js
git add .
git commit -m "Remove seed endpoint"
git push origin main

# Test locally
npm run seed
```

---

## Files Modified

### Created
- `backend/src/routes/seedRoute.js` - Temporary seed endpoint (DELETE AFTER USE)

### Modified
- `backend/src/seed.js` - Refactored to export function
- `backend/src/server.js` - Added seed route (REMOVE AFTER USE)

---

## Summary

1. ✅ Deploy backend to Render
2. ✅ Call `/seed` endpoint once
3. ✅ Verify admin and scanner users created
4. ✅ Test login with default credentials
5. ⚠️ **REMOVE seed endpoint immediately**
6. ✅ Verify endpoint returns 404
7. ✅ Change default passwords in production

**Status**: 🔴 Seed endpoint active (REMOVE ASAP) / 🟢 Seed endpoint removed

---

**Remember**: The seed endpoint is a temporary convenience for Render's free tier. Remove it as soon as seeding is complete!
