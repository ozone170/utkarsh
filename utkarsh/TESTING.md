# Testing Guide

## Local Testing with Docker

### 1. Start Services
```bash
docker-compose up --build
```

Wait for:
- `MongoDB Connected: mongo`
- `Server running on port 5000`

### 2. Seed Admin Users
```bash
docker exec -it utkarsh-backend npm run seed
```

Expected output:
```
Admin and Scanner users created successfully
Admin: admin@utkarsh.com / admin123
Scanner: scanner@utkarsh.com / scanner123
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

Frontend available at: http://localhost:5173

## Test Scenarios

### Scenario 1: Student Registration
1. Go to http://localhost:5173
2. Click "Register Now"
3. Fill form:
   - Name: Test Student
   - Email: test@student.com
   - Phone: 1234567890
   - Branch: Computer Science
   - Year: 1
4. Submit
5. Verify QR code is displayed
6. Save the eventId (e.g., A1B2C3D4E5F6G7H8)

### Scenario 2: Admin Setup
1. Go to http://localhost:5173/login
2. Login:
   - Email: admin@utkarsh.com
   - Password: admin123
3. Verify redirect to admin dashboard
4. Check stats display (should show 1 user)
5. Create halls:
   - Hall 1: Name="Main Hall", Code="MAIN", Capacity=100
   - Hall 2: Name="Side Hall", Code="SIDE", Capacity=50
6. Verify halls appear in table

### Scenario 3: Hall Scanning
1. Login as scanner (scanner@utkarsh.com / scanner123)
2. Should redirect to /scanner/hall
3. Select "Main Hall" from dropdown
4. Manually enter eventId in scan field (or use QR scanner)
5. Verify message: "✓ Entered Main Hall"
6. Scan again
7. Verify message: "✓ Exited Main Hall"
8. Change to "Side Hall" and scan
9. Verify message: "✓ Moved from Main Hall to Side Hall"

### Scenario 4: Food Scanning
1. Go to /scanner/food
2. Scan student QR (enter eventId)
3. Verify message: "✓ Food claim successful"
4. Scan same student again
5. Verify message: "✗ Food already claimed today"

### Scenario 5: Admin Stats
1. Login as admin
2. Check dashboard stats:
   - Total Users: 1
   - Total Halls: 2
   - Food Claimed Today: 1
   - Currently In Halls: 1 (if student is in a hall)

## API Testing with curl

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "branch": "CS",
    "year": 1
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@utkarsh.com",
    "password": "admin123"
  }'
```

### Create Hall (with token)
```bash
curl -X POST http://localhost:5000/api/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Hall",
    "code": "TEST",
    "capacity": 100
  }'
```

### Scan Hall
```bash
curl -X POST http://localhost:5000/api/scan/hall \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "YOUR_EVENT_ID",
    "hallCode": "MAIN"
  }'
```

### Scan Food
```bash
curl -X POST http://localhost:5000/api/scan/food \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "YOUR_EVENT_ID"
  }'
```

## Troubleshooting

### Backend not connecting to MongoDB
- Check if mongo container is running: `docker ps`
- Check logs: `docker-compose logs mongo`
- Verify connection string in backend/.env

### Frontend can't reach backend
- Verify backend is running on port 5000
- Check frontend/.env has correct VITE_API_BASE_URL
- Check browser console for CORS errors

### QR Scanner not working
- Ensure HTTPS or localhost (camera requires secure context)
- Grant camera permissions in browser
- Try manual eventId entry for testing

### Admin login fails
- Ensure seed script was run
- Check backend logs for errors
- Verify JWT_SECRET is set in .env
