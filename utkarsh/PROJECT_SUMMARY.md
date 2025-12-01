# Project Summary: Utkarsh Fresher Manager

## Overview
Complete event management system for tracking student registration, hall movement, and food distribution at college events.

## Architecture

### Backend (Node.js + Express)
- RESTful API with JWT authentication
- Role-based access control (Admin/Scanner)
- MongoDB for data persistence
- Dockerized for easy deployment

### Frontend (React + Vite)
- Single-page application with React Router
- QR code generation and scanning
- Real-time scanner interface
- Admin dashboard with statistics

### Database (MongoDB)
- 5 collections: Users, Halls, HallLogs, FoodLogs, AdminUsers
- Indexed for performance
- Supports both local and cloud (Atlas) deployment

## Key Features

### 1. Student Registration
- Web form with validation
- Automatic unique eventId generation
- QR code generation for easy scanning
- Email uniqueness enforcement

### 2. Hall Tracking
- Entry/Exit logging with timestamps
- Automatic movement detection between halls
- Real-time occupancy tracking
- Historical data for analytics

### 3. Food Distribution
- One-time daily verification per student
- Prevents duplicate claims
- Date-based tracking
- Scanner feedback (allowed/denied)

### 4. Admin Dashboard
- Real-time statistics overview
- Hall management (create, view)
- Occupancy reports
- User registration tracking

### 5. Scanner Interface
- QR code scanning via camera
- Manual eventId entry fallback
- Instant feedback on scan results
- Hall selection dropdown

## Technical Highlights

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- CORS configuration

### Data Integrity
- Unique constraints on emails and eventIds
- Automatic exit logging on hall movement
- Date-based food claim validation
- Referential integrity with MongoDB ObjectIds

### Developer Experience
- Hot reload in development
- Docker Compose for local dev
- Comprehensive documentation
- Seed scripts for testing

### Deployment Ready
- Dockerfile for containerization
- Environment-based configuration
- Production build scripts
- Vercel and Render configurations

## API Endpoints

### Public
- `POST /api/users/register` - Student registration
- `GET /api/users/by-event-id/:eventId` - Get user details
- `GET /api/halls` - List all halls
- `POST /api/scan/hall` - Hall entry/exit
- `POST /api/scan/food` - Food verification

### Authenticated
- `POST /api/auth/login` - Admin/Scanner login

### Admin Only
- `POST /api/halls` - Create hall
- `GET /api/admin/stats/overview` - Dashboard stats
- `GET /api/admin/hall-occupancy` - Occupancy reports

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  branch: String,
  year: Number,
  eventId: String (unique, auto-generated),
  createdAt: Date
}
```

### Hall
```javascript
{
  name: String,
  code: String (unique),
  capacity: Number,
  isActive: Boolean
}
```

### HallLog
```javascript
{
  userId: ObjectId (ref: User),
  hallId: ObjectId (ref: Hall),
  entryTime: Date,
  exitTime: Date (nullable),
  date: String (YYYY-MM-DD),
  dayIndex: Number
}
```

### FoodLog
```javascript
{
  userId: ObjectId (ref: User),
  date: String (YYYY-MM-DD),
  time: Date
}
// Unique index on (userId, date)
```

### AdminUser
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  role: String (ADMIN/SCANNER)
}
```

## File Structure

```
utkarsh-fresher-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Hall.js
│   │   │   ├── HallLog.js
│   │   │   ├── FoodLog.js
│   │   │   └── AdminUser.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── hallController.js
│   │   │   ├── scanController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── hallRoutes.js
│   │   │   ├── scanRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── server.js
│   │   └── seed.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ScannerHallPage.jsx
│   │   │   └── ScannerFoodPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── docker-compose.yml
├── vercel.json
├── README.md
├── QUICK_START.md
├── API.md
├── TESTING.md
├── DEPLOYMENT.md
├── DOCKER.md
├── CHECKLIST.md
└── scripts.md
```

## Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - Cross-origin resource sharing
- dotenv - Environment variables

### Frontend
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- qrcode.react - QR code generation
- html5-qrcode - QR code scanning

## Deployment Options

### Local Development
- Docker Compose (backend + MongoDB)
- npm run dev (frontend)

### Production
- Backend: Render (with MongoDB Atlas)
- Frontend: Vercel
- Database: MongoDB Atlas

## Testing Strategy

1. **Unit Testing**: Individual API endpoints
2. **Integration Testing**: Complete user flows
3. **Manual Testing**: QR scanning functionality
4. **Load Testing**: Multiple concurrent scans

## Future Enhancements

- [ ] Real-time dashboard updates with WebSockets
- [ ] Export reports to CSV/PDF
- [ ] SMS notifications for students
- [ ] Multi-event support
- [ ] Analytics dashboard with charts
- [ ] Mobile app for scanners
- [ ] Offline mode for scanners
- [ ] Attendance reports
- [ ] Student check-in history view

## Performance Considerations

- Indexed database queries
- JWT token caching
- Optimized QR scanning
- Lazy loading for admin dashboard
- Connection pooling for MongoDB

## Security Best Practices

- Environment variables for secrets
- Password hashing (bcrypt)
- JWT expiration (24h)
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection

## Maintenance

- Regular dependency updates
- Database backups
- Log monitoring
- Error tracking
- Performance monitoring

## License

MIT License - Feel free to use and modify for your needs.

## Support

For issues or questions:
1. Check documentation files
2. Review TESTING.md for common scenarios
3. Check TROUBLESHOOTING section in guides
4. Review API.md for endpoint details

---

Built with ❤️ for college event management
