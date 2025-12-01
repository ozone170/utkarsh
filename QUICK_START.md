# Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Start Backend + Database
```bash
docker-compose up --build
```

### Step 2: Create Admin User
```bash
docker exec -it utkarsh-backend npm run seed
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/utkarsh

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@utkarsh.com | admin123 |
| Scanner | scanner@utkarsh.com | scanner123 |

## 📱 User Flow

1. **Register** → Get QR code with eventId
2. **Scan at Hall** → Entry/Exit tracked automatically
3. **Scan at Food** → One-time daily verification

## 🎯 Quick Test

1. Open http://localhost:5173
2. Click "Register Now"
3. Fill form and submit
4. Save the QR code/eventId
5. Login as admin (admin@utkarsh.com / admin123)
6. Create a hall (e.g., "Main Hall", code "MAIN")
7. Go to scanner page
8. Select hall and scan/enter eventId

## 🛠️ Common Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean database
docker-compose down -v

# Restart
docker-compose restart
```

## 📚 More Info

- [Full README](README.md)
- [API Documentation](API.md)
- [Testing Guide](TESTING.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Docker Guide](DOCKER.md)

## ⚠️ Troubleshooting

**Backend won't start?**
- Check if port 5000 is free
- View logs: `docker-compose logs backend`

**Frontend can't connect?**
- Verify backend is running on port 5000
- Check frontend/.env has correct URL

**Database issues?**
- Ensure MongoDB container is running: `docker ps`
- Check connection: `docker-compose logs mongo`

## 🎉 You're Ready!

The system is now running. Start by registering a student and testing the flow!
