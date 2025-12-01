# API Documentation

Base URL: `http://localhost:5000` (local) or `https://utkarsh-backend.onrender.com` (production)

## Authentication

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, role, name }
```

## User Registration

### Register Student
```
POST /api/users/register
Body: { name, email, phone, branch, year }
Response: { user, eventId }
```

### Get User by Event ID
```
GET /api/users/by-event-id/:eventId
Response: { user object }
```

## Halls

### Create Hall (Admin only)
```
POST /api/halls
Headers: Authorization: Bearer <token>
Body: { name, code, capacity }
Response: { hall object }
```

### Get All Halls
```
GET /api/halls
Response: [{ hall objects }]
```

## Scanning

### Scan Hall Entry/Exit
```
POST /api/scan/hall
Body: { eventId, hallCode }
Response: { status, message, hall }
```

Status types:
- `entry`: First entry to hall
- `exit`: Exit from current hall
- `movement`: Movement from one hall to another

### Scan Food
```
POST /api/scan/food
Body: { eventId }
Response: { status, message }
```

Status types:
- `allowed`: Food claim successful
- `denied`: Already claimed today

## Admin Stats

### Get Overview Stats (Admin only)
```
GET /api/admin/stats/overview
Headers: Authorization: Bearer <token>
Response: {
  totalUsers,
  totalHalls,
  foodClaimedToday,
  currentlyInHalls
}
```

### Get Hall Occupancy (Admin only)
```
GET /api/admin/hall-occupancy?hallId=<id>&date=<YYYY-MM-DD>
Headers: Authorization: Bearer <token>
Response: [{ log objects with user and hall details }]
```

## Error Responses

All endpoints return errors in format:
```json
{
  "message": "Error description"
}
```

Common status codes:
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error
