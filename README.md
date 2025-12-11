# UTKARSH 2025 - Complete Event Management System

A comprehensive, production-ready event management system for MBA fresher orientation with advanced features including profile management, document generation, mobile-responsive design, and complete security hardening.

## ✨ Key Features

### 🎓 Student Management
- **Program-Aware Validation**: MBA limited to years 1-2, other programs 1-4 years
- **Phone-Based Validation**: Only pre-approved phone numbers can register
- **Smart Registration**: Students register with name, email, phone, program, year, gender, section
- **Professional ID Cards**: Auto-generated downloadable PDF ID cards with QR codes
- **Bulk Upload System**: CSV/XLSX upload with validation and preview
- **Student CRUD**: Complete create, read, update, delete operations with audit logging
- **Profile Management**: Complete user profile system with photo upload

### 👤 Profile Management System
- **Complete Profiles**: View and edit personal information, role, assigned halls
- **Photo Upload**: Profile photo upload with automatic resizing (256×256 avatar, 600×400 ID card)
- **Password Management**: Secure password change for admin users
- **Document Downloads**: Personal ID cards and certificates
- **Mobile Responsive**: Fully optimized for all device sizes
- **Role-Based Access**: Different profile features based on user role

### 🔐 Authentication & Navigation
- **Persistent Authentication**: JWT-based auth with localStorage persistence
- **Auto-Login**: Users remain logged in across page refreshes and navigation
- **Role-Based Navigation**: Dynamic navbar showing options based on user role
  - **Admin**: Landing Page, Dashboard, View Occupancy, Logout
  - **Scanner/Volunteer**: Landing Page, Scan, Logout
  - **Not Logged In**: Landing Page, Login
- **Unified Navigation**: Consistent navbar across all pages (no duplicate buttons)
- **Session Preservation**: Navigate to landing page without losing login state

### 🏛️ Hall Management
- **Real-time Tracking**: Track student entry/exit in multiple halls
- **Smart Movement Detection**: System automatically detects and logs hall-to-hall movement
- **Entry/Exit/Movement Logic**: 
  - No open log → Entry recorded
  - Same hall scan → Exit recorded
  - Different hall scan → Movement recorded (closes old, opens new)
- **Hall Occupancy**: Live view of current occupancy in each hall
- **Hall Configuration**: Create and manage halls with capacity limits
- **Food Counter Support**: Dedicated halls for food distribution

### 🍽️ Food Distribution
- **One-per-day System**: Prevents duplicate food claims with automatic validation (unique index on userId + date)
- **QR Scanning**: Quick food distribution using QR code scanning
- **Smart Validation**: Returns 'allowed' or 'denied' status with clear messages
- **Food Counter Halls**: Dedicated halls for food distribution
- **Daily Reports**: View food claims by date with timestamp
- **Claim History**: Shows when food was previously claimed if denied

### 👥 Volunteer Management
- **Role-based Access**: Admin, Scanner, and Volunteer roles
- **Hall Assignment**: Assign volunteers to specific halls
- **Automatic Routing**: Volunteers auto-routed to their assigned hall scanner

### 🎴 View Toggle System
- **Flexible Display**: Switch between card and table views on demand
- **Hall Occupancy Views**: Visual cards or detailed tables for current occupancy
- **Food Claims Views**: Beautiful cards or comprehensive tables for food distribution
- **Persistent Preferences**: View mode maintained during filtering and navigation
- **Mobile Optimized**: Both views work seamlessly on all devices

### 📊 Admin Dashboard
- **Real-time Statistics**: Live overview of registrations, hall occupancy, and food claims
- **Manual Student Addition**: Add students who couldn't register via modal form
- **Comprehensive Management**: Manage students, halls, volunteers, and view reports
- **Multiple View Modes**: Toggle between card and table views for better data visualization
- **ID Card Management**: View and download student ID cards directly from admin panel
- **Data Export**: Download student ID cards as high-quality PNG images
- **Audit Logging**: All admin actions logged with timestamp and IP address
- **Clean Interface**: No duplicate navigation buttons (uses unified navbar)

### 🎨 Landing Page
- **VTU Campus Background**: Beautiful Visvesvaraya Technological University campus image
- **Student Registration Focus**: Primary CTA for student registration (admin login in navbar)
- **Role-Based Quick Links**: Logged-in users see quick access to Dashboard/Scanner
- **Responsive Hero**: Overlay for text readability with gradient background

### 📱 Mobile-Responsive Design
- **Fully Responsive**: Works seamlessly on phones, tablets, and desktops
- **Touch-Optimized**: 44px+ touch targets and mobile-friendly interfaces
- **Safe Area Support**: Proper handling of notched devices with env(safe-area-inset-*)
- **QR Scanner**: Mobile-optimized QR code scanning interface
- **Adaptive Navigation**: Navbar stacks on mobile for better usability
- **Design System**: Consistent UI components with design tokens

### 🎖️ Document Generation System
- **Professional ID Cards**: PDF generation with QR codes, photos, and branding
- **Certificate System**: 5 certificate templates (Appreciation, Excellence, Service, Verification, Formal)
- **Bulk Generation**: Admin can generate certificates for multiple users
- **QR Verification**: All documents include QR codes for authenticity verification
- **Template System**: Dynamic placeholder replacement ({{name}}, {{role}}, {{event}}, {{date}})
- **Photo Integration**: Optional profile photo inclusion in documents

### 🔒 Security & Performance
- **Input Validation**: Comprehensive Joi validation schemas with sanitization
- **Rate Limiting**: 120 req/min for scans, 1000 req/15min general API
- **File Upload Security**: Type validation, size limits, secure processing
- **Database Optimization**: Strategic indexing for optimal query performance
- **CORS Configuration**: Dynamic origin support for multiple environments
- **XSS Prevention**: Input sanitization and secure file handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ozone170/utkarsh.git
cd utkarsh
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Environment**
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/utkarsh
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. **Configure Allowed Students**
Edit `backend/services/students.json` with your student list:
```json
[
  {
    "name": "Student Name",
    "email": "student@example.com",
    "phone": "1234567890",
    "Gender": "Male",
    "Section": "A"
  }
]
```

5. **Seed Admin Users**
```bash
npm run seed
```

6. **Start Backend**
```bash
npm run dev
```

7. **Setup Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

8. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔑 Default Credentials

After seeding:
- **Admin**: admin@utkarsh.com / admin123
- **Scanner**: scanner@utkarsh.com / scanner123

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **React Context API** - State management (AuthContext)
- **Axios** - HTTP client with interceptors
- **jwt-decode** - JWT token decoding
- **html5-qrcode** - QR code scanning
- **Design System** - Custom UI component library with design tokens

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework with middleware
- **MongoDB** - Database with strategic indexing
- **Mongoose** - ODM with validation and constraints
- **JWT** - Authentication with secure tokens
- **bcryptjs** - Password hashing (12 rounds)
- **Sharp** - Image processing and resizing
- **PDFKit** - Professional PDF document generation
- **QRCode** - QR code generation for verification
- **Joi** - Input validation and sanitization
- **Multer** - Secure file upload handling
- **Express Rate Limit** - API rate limiting

### DevOps
- **Docker Compose** - Container orchestration
- **MongoDB Docker** - Containerized database

## � DApplication Flow

### Student Registration Flow
1. Student visits registration page
2. Fills in personal details (name, email, phone, branch, year)
3. System generates unique Event ID (16-character hex)
4. Professional ID card displayed with QR code
5. Student downloads ID card as PNG image
6. Student can take a screenshot for backup

### Hall Scanning Flow
1. Volunteer/Scanner logs in
2. Selects assigned hall
3. Scans student QR code
4. System determines action:
   - **Entry**: No open log exists → Creates new entry
   - **Exit**: Open log for same hall → Closes with exitTime
   - **Movement**: Open log for different hall → Closes old, creates new
5. Displays student details and scan result with appropriate message
6. User can click "Back to Landing Page" (stays logged in)

### Food Distribution Flow
1. Volunteer at food counter logs in
2. Scans student QR code
3. System checks FoodLog for today's date
4. If already claimed → Returns 'denied' with claim timestamp
5. If not claimed → Creates FoodLog and returns 'allowed'
6. Displays result page with student details
7. User can click "Back to Landing Page" (stays logged in)

### Admin Management Flow
1. Admin logs in to dashboard (navbar shows Dashboard, View Occupancy, Logout)
2. Views real-time statistics (students, halls, occupancy, food claims)
3. Navigates to student management
4. Can add new students manually via modal form
5. Views students as beautiful ID cards in grid layout
6. Can download, edit, or delete any student
7. Toggles between card and table views for occupancy/food claims
8. Manages halls and volunteers
9. Views detailed reports with flexible display options
10. All actions logged in audit trail

### Authentication & Navigation Flow
1. User logs in with email/password
2. JWT token stored in localStorage
3. User object stored in AuthContext
4. Navbar updates to show role-based options
5. User navigates to any page (landing, dashboard, scanner)
6. Auth state persists across navigation
7. Page refresh loads token from localStorage
8. Token validated for expiry
9. User remains logged in until logout or token expiry
10. Logout clears token and redirects to landing page

## 🎨 Features in Detail

### Professional ID Card Generation
- **Auto-generated Design**: Beautiful gradient background with VTU logo
- **Complete Student Info**: Name, Event ID, email, phone, branch, year, gender, section
- **Gender Display**: Shows appropriate emoji (👨/👩/🧑) based on gender
- **Section Display**: Shows student's assigned section (A/B/C/D)
- **Integrated QR Code**: High-quality QR code with error correction (Level H)
- **SVG to Canvas Conversion**: Ensures QR codes render perfectly in downloads
- **Downloadable**: Export as PNG image with proper naming
- **Print-ready**: Optimized for printing and digital use (2x scale)
- **Mobile-responsive**: Looks great on all screen sizes
- **Admin Access**: Admins can view and download any student's ID card

### QR Code System
- **Unique IDs**: Cryptographically generated unique event IDs (16-character hex)
- **High Error Correction**: Level H QR codes for maximum reliability
- **Fast Scanning**: Optimized for quick mobile scanning
- **Dual Purpose**: Used for both hall entry and food distribution
- **SVG to Canvas**: Converts SVG QR codes to canvas for perfect image rendering
- **Scannable from Downloads**: QR codes work perfectly in downloaded PNG images

### View Toggle Features
- **Dual Display Modes**: Switch between card and table views instantly
- **Hall Occupancy**: 
  - Table view: Detailed spreadsheet with all student information
  - Card view: Visual purple gradient cards with key information
- **Food Claims**:
  - Table view: Comprehensive claim records in tabular format
  - Card view: Orange gradient cards showing claim details
- **Persistent State**: View preference maintained during filtering
- **Responsive Design**: Both views optimized for mobile and desktop

### Real-time Dashboard
- **Live Statistics**: Total students, halls, current occupancy, food claims
- **Quick Navigation**: Click stats to view detailed pages
- **Responsive Cards**: Beautiful gradient cards with hover effects
- **Instant Updates**: Real-time data refresh

### Mobile Optimization
- **Responsive Layouts**: Adapts to any screen size
- **Touch-friendly**: Large buttons and touch targets (minimum 44px)
- **No Zoom Issues**: Proper input sizing prevents unwanted zoom
- **Horizontal Scroll**: Tables scroll smoothly on mobile
- **Optimized Typography**: Readable text on all devices
- **Card Stacking**: Cards stack vertically on mobile for better readability
- **Flexible Grids**: Auto-adjusting grid layouts for optimal viewing

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication (24h expiry)
- **Token Persistence**: Stored in localStorage with expiry validation
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Admin, Scanner, Volunteer permissions
- **Protected Routes**: Middleware-based route protection
- **Phone Validation**: Only pre-approved phones can register
- **Duplicate Prevention**: Unique constraints on email and phone
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data in .env files
- **Unique Event IDs**: Cryptographically generated (16-character hex)
- **Audit Logging**: All admin actions logged with actor, timestamp, IP

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `POST /api/users/register` - Student registration (validates phone, checks duplicates)
- `GET /api/users/by-event-id/:eventId` - Get student by event ID

### Halls
- `GET /api/halls` - List all halls
- `POST /api/halls` - Create hall (Admin)
- `PUT /api/halls/:hallId` - Update hall (Admin)
- `DELETE /api/halls/:hallId` - Delete hall (Admin)

### Scanning
- `POST /api/scan/hall` - Hall entry/exit scan
- `POST /api/scan/food` - Food distribution scan

### Admin
- `GET /api/admin/stats/overview` - Dashboard statistics
- `GET /api/admin/hall-occupancy` - Current hall occupancy
- `GET /api/admin/students` - All students
- `POST /api/admin/students` - Create student manually
- `PUT /api/admin/students/:studentId` - Update student
- `DELETE /api/admin/students/:studentId` - Delete student
- `POST /api/admin/upload/students` - Bulk upload CSV/XLSX
- `GET /api/admin/download/template` - Download CSV template
- `GET /api/admin/volunteers` - All volunteers
- `POST /api/admin/volunteers` - Create volunteer
- `PUT /api/admin/volunteers/:volunteerId` - Update volunteer
- `DELETE /api/admin/volunteers/:volunteerId` - Delete volunteer
- `GET /api/admin/food-claims` - Food claims by date
- `GET /api/admin/users` - All users for certificate management
- `POST /api/admin/certificates/generate` - Generate bulk certificates
- `GET /api/admin/certificates/:userId` - Generate individual certificate

### Profile Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile information
- `PUT /api/profile/password` - Change password (admin users)
- `POST /api/profile/photo` - Upload profile photo
- `DELETE /api/profile/photo` - Remove profile photo
- `GET /api/profile/idcard` - Download personal ID card
- `GET /api/profile/certificate` - Download personal certificate

## 🐳 Docker Deployment (Local)

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 🚀 Production Deployment

### Quick Deploy

**Backend** (Render.com):
1. Create MongoDB Atlas cluster
2. Get connection string
3. Deploy to Render with environment variables
4. Backend URL: `https://your-app.onrender.com`

**Frontend** (Vercel):
1. Update `VITE_API_BASE_URL` with backend URL
2. Deploy to Vercel
3. Frontend URL: `https://your-app.vercel.app`

**Detailed Instructions**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Deployment Checklist**: See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)

**Database Seeding**: Use `npm run seed` locally or see deployment guide for production seeding

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📱 Browser Support

- ✅ Chrome/Edge (Chromium) - Latest
- ✅ Firefox - Latest
- ✅ Safari - Latest
- ✅ iOS Safari - iOS 12+
- ✅ Chrome Mobile - Latest
- ✅ Samsung Internet - Latest

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your events!

## 👨‍💻 Author

Built with ❤️ for efficient event management

## 📋 Production Readiness

### ✅ Complete Feature Set
- **User Management**: Registration, profiles, photo upload, document generation
- **Event Management**: Hall tracking, food distribution, QR scanning
- **Admin Tools**: Dashboard, bulk operations, certificate management
- **Security**: Input validation, rate limiting, file upload security
- **Performance**: Database indexing, caching, optimized queries
- **Mobile**: Responsive design, touch optimization, safe-area support

### 🚀 Deployment Ready
- **Environment Configuration**: Comprehensive .env.example files
- **Database Migration**: Scripts for existing data updates
- **Security Hardening**: XSS prevention, input sanitization, rate limiting
- **Performance Optimization**: Strategic database indexing
- **Mobile Optimization**: Complete responsive design system
- **Documentation**: Comprehensive API documentation and setup guides

### 📊 System Metrics
- **50+ Files**: Created/modified across frontend and backend
- **100% Mobile Responsive**: Tested on devices from 360px to desktop
- **Security Compliant**: XSS prevention, input sanitization, rate limiting
- **Performance Optimized**: Database indexes, caching, efficient queries
- **5 Sprints Completed**: All development tasks implemented and tested

## 🎯 Development Completion Status

### ✅ All Core Features Implemented

**Scanner System (100% Complete)**
- ✅ Instant camera stop after scan
- ✅ "Scan Another" button works instantly
- ✅ Duplicate scan prevention with server-side dedupe
- ✅ Mobile-optimized scanner interface
- ✅ Rate limiting protection

**Student Management (100% Complete)**
- ✅ Program-aware year validation (MBA: 1-2, Others: 1-4)
- ✅ Bulk CSV/XLSX upload with validation
- ✅ Admin student creation and management
- ✅ Mobile-responsive student cards
- ✅ Complete CRUD operations

**Profile System (100% Complete)**
- ✅ Complete profile management interface
- ✅ Photo upload with automatic resizing
- ✅ Password change functionality
- ✅ Mobile-responsive design
- ✅ Role-based profile features

**Document Generation (100% Complete)**
- ✅ Professional PDF ID card generation
- ✅ 5 certificate templates with QR verification
- ✅ Bulk certificate generation for admins
- ✅ Photo integration in documents
- ✅ Template system with dynamic placeholders

**Security & Performance (100% Complete)**
- ✅ Comprehensive input validation and sanitization
- ✅ Rate limiting on all endpoints
- ✅ Database indexing optimization
- ✅ File upload security
- ✅ Dynamic CORS configuration

**UI/UX System (100% Complete)**
- ✅ Complete design system with tokens
- ✅ Reusable UI component library
- ✅ Mobile-first responsive design
- ✅ Safe-area support for notched devices
- ✅ 44px+ touch targets throughout

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Visvesvaraya Technological University for the campus image
- All contributors and users of this system
