# Utkarsh Fresher Manager

Event management system for tracking student registration, hall movement, and food distribution.

## Tech Stack
- Frontend: React (Vite) → Vercel
- Backend: Node.js + Express → Render
- Database: MongoDB

## Features
- Student registration with QR code generation
- Hall entry/exit tracking with automatic movement detection
- One-time daily food distribution verification
- Admin dashboard with real-time statistics
- Scanner interface for hall and food verification

## Quick Start

See [QUICK_START.md](QUICK_START.md) for the fastest way to get running!

### Using Docker (Recommended)
```bash
# Start backend + MongoDB
docker-compose up --build

# In new terminal, seed admin user
docker exec -it utkarsh-backend npm run seed

# In new terminal, start frontend
cd frontend
npm install
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017/utkarsh

### Manual Setup
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Backend
cd backend
npm install
npm run seed
npm run dev

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

## Default Credentials
- Admin: admin@utkarsh.com / admin123
- Scanner: scanner@utkarsh.com / scanner123

## What's Included?
See [WHAT_YOU_HAVE.md](WHAT_YOU_HAVE.md) for a complete overview of everything that's been built!

## Documentation
📚 **[Complete Documentation Index](INDEX.md)** - Find everything you need!

Quick links:
- [Quick Start Guide](QUICK_START.md) - Get running in 3 steps
- [API Documentation](API.md) - All endpoints
- [Testing Guide](TESTING.md) - Test scenarios
- [Docker Guide](DOCKER.md) - Docker setup
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Project Summary](PROJECT_SUMMARY.md) - Technical overview

## Project Structure
```
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── models/       # Mongoose models
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & role middleware
│   │   └── server.js     # Express app
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios configuration
│   │   ├── pages/        # React pages
│   │   └── App.jsx
│   └── package.json
└── docker-compose.yml
