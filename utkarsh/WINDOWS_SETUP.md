# Windows Setup Guide (Without Docker)

Since Docker isn't installed, here's how to run the project manually on Windows.

## Prerequisites

### 1. Install Node.js
- Download from: https://nodejs.org/ (LTS version recommended)
- Verify installation:
```bash
node --version
npm --version
```

### 2. Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- Or use MongoDB Atlas (cloud) - see option below

## Option A: Local MongoDB Setup

### 1. Install MongoDB on Windows

1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)
5. Install MongoDB Compass (optional GUI)

### 2. Start MongoDB

MongoDB should start automatically as a Windows service. If not:

```bash
# Check if MongoDB is running
net start MongoDB

# Or start it manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### 3. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create admin users
npm run seed

# Start backend server
npm run dev
```

Backend will run on http://localhost:5000

### 4. Setup Frontend

Open a NEW terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on http://localhost:5173

## Option B: MongoDB Atlas (Cloud - Recommended)

This is easier and doesn't require local MongoDB installation!

### 1. Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster (free tier available)
4. Create a database user:
   - Username: utkarsh
   - Password: (choose a strong password)
5. Whitelist your IP:
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### 2. Update Backend Configuration

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://utkarsh:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/utkarsh?retryWrites=true&w=majority
JWT_SECRET=supersecretkey
NODE_ENV=development
```

### 3. Setup Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

### 4. Setup Frontend

Open a NEW terminal:

```bash
cd frontend
npm install
npm run dev
```

## Quick Start Commands

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Login Credentials

- Admin: admin@utkarsh.com / admin123
- Scanner: scanner@utkarsh.com / scanner123

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. Check if MongoDB service is running:
   ```bash
   net start MongoDB
   ```
2. Or use MongoDB Atlas (cloud option)

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
1. Find and kill the process:
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```
2. Or change port in `backend/.env`

### Frontend Can't Connect to Backend

**Error**: Network errors in browser console

**Solution**:
1. Verify backend is running on port 5000
2. Check `frontend/.env` has correct URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```
3. Restart frontend: `npm run dev`

### npm install Fails

**Error**: Various npm errors

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete node_modules and try again:
   ```bash
   rmdir /s /q node_modules
   npm install
   ```

## Testing the Setup

### 1. Test Backend
Open browser: http://localhost:5000
Should see: `{"message":"Utkarsh API is running"}`

### 2. Test Frontend
Open browser: http://localhost:5173
Should see the landing page

### 3. Register a Student
1. Click "Register Now"
2. Fill the form
3. Submit
4. You should see a QR code

### 4. Login as Admin
1. Go to http://localhost:5173/login
2. Email: admin@utkarsh.com
3. Password: admin123
4. Should redirect to admin dashboard

## Development Workflow

### Start Development
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### Stop Development
Press `Ctrl+C` in each terminal

### View Logs
Backend logs appear in Terminal 1
Frontend logs appear in Terminal 2

## Installing Docker (Optional)

If you want to use Docker later:

1. Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop
2. Restart your computer
3. Run: `docker-compose up --build`

## Next Steps

1. ✅ Get the app running locally
2. ✅ Test all features (see [TESTING.md](TESTING.md))
3. ✅ Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))

## Need Help?

- Check [TESTING.md](TESTING.md) for test scenarios
- Check [API.md](API.md) for API documentation
- Check [INDEX.md](INDEX.md) for all documentation

---

**Quick Summary**:
1. Install Node.js
2. Use MongoDB Atlas (easiest) or install MongoDB locally
3. Run `cd backend && npm install && npm run seed && npm run dev`
4. Run `cd frontend && npm install && npm run dev` (new terminal)
5. Visit http://localhost:5173
