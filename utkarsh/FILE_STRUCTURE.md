# Complete File Structure

## Project Root
```
utkarsh-fresher-manager/
│
├── 📁 backend/                      # Backend application
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── db.js               # MongoDB connection
│   │   │
│   │   ├── 📁 models/              # Mongoose models
│   │   │   ├── User.js             # Student model
│   │   │   ├── Hall.js             # Hall/venue model
│   │   │   ├── HallLog.js          # Entry/exit tracking
│   │   │   ├── FoodLog.js          # Food distribution
│   │   │   └── AdminUser.js        # Admin/scanner users
│   │   │
│   │   ├── 📁 controllers/         # Business logic
│   │   │   ├── authController.js   # Login logic
│   │   │   ├── userController.js   # Registration logic
│   │   │   ├── hallController.js   # Hall management
│   │   │   ├── scanController.js   # Scanning logic
│   │   │   └── adminController.js  # Admin stats
│   │   │
│   │   ├── 📁 routes/              # API routes
│   │   │   ├── authRoutes.js       # /api/auth
│   │   │   ├── userRoutes.js       # /api/users
│   │   │   ├── hallRoutes.js       # /api/halls
│   │   │   ├── scanRoutes.js       # /api/scan
│   │   │   └── adminRoutes.js      # /api/admin
│   │   │
│   │   ├── 📁 middleware/          # Custom middleware
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   └── roleMiddleware.js   # Role checking
│   │   │
│   │   ├── server.js               # Express app entry
│   │   └── seed.js                 # Database seeding
│   │
│   ├── 📁 node_modules/            # Dependencies (gitignored)
│   ├── .env                        # Environment variables (gitignored)
│   ├── .env.production             # Production env template
│   ├── .dockerignore               # Docker ignore rules
│   ├── Dockerfile                  # Backend container
│   ├── package.json                # Dependencies & scripts
│   └── package-lock.json           # Dependency lock
│
├── 📁 frontend/                     # Frontend application
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── axios.js            # API client config
│   │   │
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── LandingPage.jsx     # Home page
│   │   │   ├── RegisterPage.jsx    # Student registration
│   │   │   ├── LoginPage.jsx       # Admin/scanner login
│   │   │   ├── AdminDashboard.jsx  # Admin interface
│   │   │   ├── ScannerHallPage.jsx # Hall scanning
│   │   │   └── ScannerFoodPage.jsx # Food scanning
│   │   │
│   │   ├── 📁 assets/              # Static assets
│   │   │   └── react.svg
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css                 # App styles
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   │
│   ├── 📁 node_modules/            # Dependencies (gitignored)
│   ├── 📁 dist/                    # Build output (gitignored)
│   ├── .env                        # Environment variables (gitignored)
│   ├── .env.production             # Production env template
│   ├── index.html                  # HTML template
│   ├── package.json                # Dependencies & scripts
│   ├── package-lock.json           # Dependency lock
│   ├── vite.config.js              # Vite configuration
│   └── eslint.config.js            # ESLint configuration
│
├── 📁 .git/                        # Git repository (hidden)
├── 📁 .vscode/                     # VS Code settings (optional)
│
├── 📄 Documentation Files
│   ├── README.md                   # Main project readme
│   ├── QUICK_START.md              # Quick start guide
│   ├── INDEX.md                    # Documentation index
│   ├── WHAT_YOU_HAVE.md            # Feature overview
│   ├── PROJECT_SUMMARY.md          # Technical summary
│   ├── ARCHITECTURE.md             # System architecture
│   ├── API.md                      # API documentation
│   ├── TESTING.md                  # Testing guide
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── DOCKER.md                   # Docker guide
│   ├── CHECKLIST.md                # Implementation checklist
│   ├── scripts.md                  # Useful scripts
│   ├── CONTRIBUTING.md             # Contribution guide
│   └── FILE_STRUCTURE.md           # This file
│
├── 📄 Configuration Files
│   ├── .gitignore                  # Git ignore rules
│   ├── docker-compose.yml          # Docker Compose config
│   └── vercel.json                 # Vercel deployment config
│
└── 📊 Total Files: ~60 files
```

## File Purposes

### Backend Files

#### Configuration
- **db.js** - MongoDB connection setup using Mongoose

#### Models (Database Schemas)
- **User.js** - Student information and eventId
- **Hall.js** - Venue/hall information
- **HallLog.js** - Entry/exit tracking with timestamps
- **FoodLog.js** - Daily food distribution tracking
- **AdminUser.js** - Admin and scanner authentication

#### Controllers (Business Logic)
- **authController.js** - Login and JWT generation
- **userController.js** - Student registration and lookup
- **hallController.js** - Hall creation and listing
- **scanController.js** - QR scanning logic (hall & food)
- **adminController.js** - Statistics and reports

#### Routes (API Endpoints)
- **authRoutes.js** - POST /api/auth/login
- **userRoutes.js** - POST /api/users/register, GET /api/users/by-event-id/:id
- **hallRoutes.js** - POST /api/halls, GET /api/halls
- **scanRoutes.js** - POST /api/scan/hall, POST /api/scan/food
- **adminRoutes.js** - GET /api/admin/stats/overview, GET /api/admin/hall-occupancy

#### Middleware
- **authMiddleware.js** - JWT token verification
- **roleMiddleware.js** - Role-based access control

#### Entry Points
- **server.js** - Express app setup and startup
- **seed.js** - Database seeding script

### Frontend Files

#### API
- **axios.js** - Axios instance with auth interceptor

#### Pages (React Components)
- **LandingPage.jsx** - Welcome page with navigation
- **RegisterPage.jsx** - Student registration form + QR display
- **LoginPage.jsx** - Admin/scanner login form
- **AdminDashboard.jsx** - Stats, hall management, reports
- **ScannerHallPage.jsx** - Hall QR scanner interface
- **ScannerFoodPage.jsx** - Food QR scanner interface

#### Entry Points
- **main.jsx** - React app initialization
- **App.jsx** - Router and route definitions
- **index.html** - HTML template

### Configuration Files

#### Docker
- **Dockerfile** - Backend container definition
- **docker-compose.yml** - Multi-container setup (backend + MongoDB)
- **.dockerignore** - Files to exclude from Docker build

#### Deployment
- **vercel.json** - Vercel deployment configuration
- **.env** - Local environment variables (gitignored)
- **.env.production** - Production environment template

#### Git
- **.gitignore** - Files to exclude from Git

#### Package Management
- **package.json** - Dependencies and scripts
- **package-lock.json** - Dependency version lock

### Documentation Files

#### Getting Started
- **README.md** - Project overview
- **QUICK_START.md** - 3-step quick start
- **INDEX.md** - Documentation navigation

#### Technical
- **PROJECT_SUMMARY.md** - Complete technical overview
- **ARCHITECTURE.md** - System architecture diagrams
- **API.md** - API endpoint reference
- **FILE_STRUCTURE.md** - This file

#### Guides
- **TESTING.md** - Testing scenarios and examples
- **DEPLOYMENT.md** - Production deployment steps
- **DOCKER.md** - Docker usage guide
- **scripts.md** - Useful commands

#### Reference
- **CHECKLIST.md** - Implementation status
- **WHAT_YOU_HAVE.md** - Feature overview
- **CONTRIBUTING.md** - Contribution guidelines

## File Count Summary

```
Backend Source Files:     18 files
Frontend Source Files:    10 files
Configuration Files:       8 files
Documentation Files:      14 files
─────────────────────────────────
Total Project Files:      50+ files
```

## Key Directories

### Development
- `/backend/src/` - All backend source code
- `/frontend/src/` - All frontend source code
- `/backend/node_modules/` - Backend dependencies
- `/frontend/node_modules/` - Frontend dependencies

### Ignored (not in Git)
- `node_modules/` - Dependencies
- `.env` - Environment variables
- `dist/` - Build output
- `.git/` - Git repository

### Documentation
- Root directory - All .md files

## File Sizes (Approximate)

```
Backend Source:       ~3,000 lines
Frontend Source:      ~2,000 lines
Documentation:        ~5,000 lines
Configuration:          ~200 lines
─────────────────────────────────
Total:               ~10,200 lines
```

## Important Files to Know

### Must Configure
1. `backend/.env` - Database URI, JWT secret
2. `frontend/.env` - API base URL
3. `docker-compose.yml` - Docker services

### Entry Points
1. `backend/src/server.js` - Backend starts here
2. `frontend/src/main.jsx` - Frontend starts here
3. `docker-compose.yml` - Docker starts here

### First Files to Read
1. `README.md` - Project overview
2. `QUICK_START.md` - Get running fast
3. `INDEX.md` - Find everything

### For Development
1. `API.md` - API reference
2. `TESTING.md` - Test scenarios
3. `scripts.md` - Useful commands

### For Deployment
1. `DEPLOYMENT.md` - Production guide
2. `DOCKER.md` - Docker guide
3. `backend/.env.production` - Env template

---

**Navigation**: See [INDEX.md](INDEX.md) for complete documentation index
