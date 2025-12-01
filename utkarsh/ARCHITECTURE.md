# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + Vite)                            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Landing  │  │ Register │  │  Login   │  │  Admin   │   │
│  │   Page   │  │   Page   │  │   Page   │  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐                                │
│  │ Scanner  │  │ Scanner  │                                │
│  │   Hall   │  │   Food   │                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                   (Node.js + Express)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Middleware                         │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │     CORS     │  │     Auth     │                 │  │
│  │  │   (cors)     │  │    (JWT)     │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                      Routes                           │  │
│  │  /api/auth  /api/users  /api/halls                   │  │
│  │  /api/scan  /api/admin                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Controllers                         │  │
│  │  authController  userController  hallController      │  │
│  │  scanController  adminController                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     Models                            │  │
│  │  User  Hall  HallLog  FoodLog  AdminUser            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│                        (MongoDB)                             │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │  halls   │  │halllogs  │  │foodlogs  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐                                               │
│  │adminusers│                                               │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Student Registration Flow

```
User → Register Page → POST /api/users/register → User Model
                                                      ↓
                                                  Generate eventId
                                                      ↓
                                                  Save to DB
                                                      ↓
                                              Return user + eventId
                                                      ↓
                                              Display QR Code
```

### Hall Scanning Flow

```
Scanner → Scan QR → Extract eventId → POST /api/scan/hall
                                            ↓
                                    Find User by eventId
                                            ↓
                                    Find Hall by code
                                            ↓
                                Check for open HallLog
                                            ↓
                        ┌───────────────────┼───────────────────┐
                        ▼                   ▼                   ▼
                   No open log      Same hall log       Different hall log
                        │                   │                   │
                        ▼                   ▼                   ▼
                Create new entry    Set exitTime        Close old, create new
                        │                   │                   │
                        └───────────────────┴───────────────────┘
                                            ↓
                                    Return status message
```

### Food Scanning Flow

```
Scanner → Scan QR → Extract eventId → POST /api/scan/food
                                            ↓
                                    Find User by eventId
                                            ↓
                                Check FoodLog for today
                                            ↓
                        ┌───────────────────┴───────────────────┐
                        ▼                                       ▼
                  Already claimed                         Not claimed
                        │                                       │
                        ▼                                       ▼
                Return "denied"                      Create FoodLog entry
                                                              ↓
                                                      Return "allowed"
```

### Admin Dashboard Flow

```
Admin → Login → JWT Token → Admin Dashboard
                                  ↓
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
            Get Stats      Get Halls      Create Hall
                    │             │             │
                    ▼             ▼             ▼
            Count queries   Find all    Insert new hall
                    │             │             │
                    └─────────────┴─────────────┘
                                  ↓
                          Display Dashboard
```

## Component Architecture

### Frontend Components

```
App.jsx
├── Router
    ├── LandingPage
    │   └── Navigation buttons
    │
    ├── RegisterPage
    │   ├── Registration form
    │   └── QR code display
    │
    ├── LoginPage
    │   └── Login form
    │
    ├── AdminDashboard
    │   ├── Stats cards
    │   ├── Hall creation form
    │   └── Halls table
    │
    ├── ScannerHallPage
    │   ├── Hall selector
    │   ├── QR scanner
    │   └── Status message
    │
    └── ScannerFoodPage
        ├── QR scanner
        └── Status message
```

### Backend Structure

```
server.js
├── Express app
├── Middleware
│   ├── CORS
│   ├── JSON parser
│   ├── authMiddleware
│   └── roleMiddleware
│
├── Routes
│   ├── /api/auth → authRoutes
│   ├── /api/users → userRoutes
│   ├── /api/halls → hallRoutes
│   ├── /api/scan → scanRoutes
│   └── /api/admin → adminRoutes
│
└── Database connection
```

## Deployment Architecture

### Development (Docker)

```
┌─────────────────────────────────────────┐
│           Docker Compose                 │
│                                          │
│  ┌────────────────┐  ┌────────────────┐│
│  │   Backend      │  │   MongoDB      ││
│  │   Container    │◄─┤   Container    ││
│  │   Port 5000    │  │   Port 27017   ││
│  └────────────────┘  └────────────────┘│
└─────────────────────────────────────────┘
         ▲
         │ HTTP
         │
┌────────┴────────┐
│   Frontend      │
│   (npm run dev) │
│   Port 5173     │
└─────────────────┘
```

### Production

```
┌─────────────────┐
│     Vercel      │
│   (Frontend)    │
│  React + Vite   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│     Render      │
│   (Backend)     │
│  Node + Express │
└────────┬────────┘
         │ MongoDB Driver
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
│   (Database)    │
│   Cloud Hosted  │
└─────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
│                                                          │
│  1. CORS                                                │
│     └─ Restrict origins                                 │
│                                                          │
│  2. JWT Authentication                                  │
│     ├─ Token generation on login                       │
│     ├─ Token verification on protected routes          │
│     └─ 24-hour expiration                              │
│                                                          │
│  3. Role-Based Access Control                          │
│     ├─ ADMIN: Full access                              │
│     └─ SCANNER: Limited access                         │
│                                                          │
│  4. Password Security                                   │
│     ├─ bcrypt hashing                                   │
│     └─ Salt rounds: 10                                  │
│                                                          │
│  5. Input Validation                                    │
│     ├─ Required fields                                  │
│     ├─ Type checking                                    │
│     └─ Unique constraints                               │
│                                                          │
│  6. Environment Variables                               │
│     ├─ JWT_SECRET                                       │
│     ├─ MONGODB_URI                                      │
│     └─ No hardcoded secrets                             │
└─────────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌──────────────┐
│     User     │
│──────────────│
│ _id          │◄────────┐
│ name         │         │
│ email        │         │
│ eventId      │         │
└──────────────┘         │
                         │
                    ┌────┴─────┐
                    │          │
            ┌───────┴──────┐   │
            │   HallLog    │   │
            │──────────────│   │
            │ userId       │───┘
            │ hallId       │───┐
            │ entryTime    │   │
            │ exitTime     │   │
            └──────────────┘   │
                               │
                    ┌──────────┴──┐
                    │             │
            ┌───────▼──────┐      │
            │     Hall     │      │
            │──────────────│      │
            │ _id          │◄─────┘
            │ name         │
            │ code         │
            │ capacity     │
            └──────────────┘

┌──────────────┐
│     User     │
│──────────────│
│ _id          │◄────────┐
└──────────────┘         │
                         │
                    ┌────┴─────┐
                    │          │
            ┌───────┴──────┐   │
            │   FoodLog    │   │
            │──────────────│   │
            │ userId       │───┘
            │ date         │
            │ time         │
            └──────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                        │
├─────────────────────────────────────────────────────────┤
│ React 18          │ UI Library                          │
│ Vite              │ Build Tool                          │
│ React Router      │ Client-side Routing                 │
│ Axios             │ HTTP Client                         │
│ qrcode.react      │ QR Code Generation                  │
│ html5-qrcode      │ QR Code Scanning                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
├─────────────────────────────────────────────────────────┤
│ Node.js 20        │ Runtime                             │
│ Express 4         │ Web Framework                       │
│ Mongoose 8        │ MongoDB ODM                         │
│ JWT               │ Authentication                      │
│ bcryptjs          │ Password Hashing                    │
│ CORS              │ Cross-Origin Support                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Database & DevOps                      │
├─────────────────────────────────────────────────────────┤
│ MongoDB 7         │ Database                            │
│ Docker            │ Containerization                    │
│ Docker Compose    │ Multi-container Orchestration       │
│ Vercel            │ Frontend Hosting                    │
│ Render            │ Backend Hosting                     │
│ MongoDB Atlas     │ Cloud Database                      │
└─────────────────────────────────────────────────────────┘
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────┐
│                  Optimization Strategies                 │
│                                                          │
│  Database                                               │
│  ├─ Indexed queries (email, eventId, userId+date)      │
│  ├─ Connection pooling                                  │
│  └─ Efficient query patterns                            │
│                                                          │
│  Backend                                                │
│  ├─ JWT token caching                                   │
│  ├─ Async/await for non-blocking I/O                   │
│  └─ Minimal middleware chain                            │
│                                                          │
│  Frontend                                               │
│  ├─ Code splitting (React Router)                      │
│  ├─ Lazy loading components                             │
│  └─ Optimized QR scanning                               │
│                                                          │
│  Deployment                                             │
│  ├─ CDN for static assets (Vercel)                     │
│  ├─ Containerized backend (Docker)                     │
│  └─ Cloud database (MongoDB Atlas)                     │
└─────────────────────────────────────────────────────────┘
```

---

This architecture supports:
- ✅ Scalability (horizontal scaling possible)
- ✅ Security (multiple layers)
- ✅ Maintainability (clear separation of concerns)
- ✅ Performance (optimized queries and caching)
- ✅ Reliability (error handling and validation)
