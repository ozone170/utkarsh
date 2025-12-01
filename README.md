# Utkarsh Fresher Manager

A modern, mobile-friendly event management system for tracking student registration, hall movement, and food distribution with professional ID card generation.

## ✨ Key Features

### 🎓 Student Management
- **Smart Registration**: Students register with their details and receive a unique Event ID
- **Professional ID Cards**: Auto-generated downloadable ID cards with QR codes
- **QR Code Integration**: Each student gets a unique QR code for seamless event access
- **Card View Dashboard**: Beautiful card-based view of all registered students with ID cards
- **Download Capability**: Admins can download any student's ID card
- **Student CRUD**: Complete create, read, update, delete operations

### 🏛️ Hall Management
- **Real-time Tracking**: Track student entry/exit in multiple halls
- **Automatic Movement Detection**: System detects when students move between halls
- **Hall Occupancy**: Live view of current occupancy in each hall
- **Hall Configuration**: Create and manage halls with capacity limits

### 🍽️ Food Distribution
- **One-per-day System**: Prevents duplicate food claims with automatic validation
- **QR Scanning**: Quick food distribution using QR code scanning
- **Food Counter Halls**: Dedicated halls for food distribution
- **Daily Reports**: View food claims by date

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
- **Comprehensive Management**: Manage students, halls, volunteers, and view reports
- **Multiple View Modes**: Toggle between card and table views for better data visualization
- **ID Card Management**: View and download student ID cards directly from admin panel
- **Data Export**: Download student ID cards as high-quality PNG images

### 📱 Mobile-Responsive Design
- **Fully Responsive**: Works seamlessly on phones, tablets, and desktops
- **Touch-Optimized**: Large touch targets and mobile-friendly interfaces
- **QR Scanner**: Mobile-optimized QR code scanning interface
- **Downloadable ID Cards**: Generate and download professional ID cards on any device

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

4. **Seed Admin Users**
```bash
npm run seed
```

5. **Start Backend**
```bash
npm run dev
```

6. **Setup Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔑 Default Credentials

After seeding:
- **Admin**: admin@utkarsh.com / admin123
- **Scanner**: scanner@utkarsh.com / scanner123

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **html5-qrcode** - QR code scanning
- **qrcode.react** - QR code generation
- **html2canvas** - ID card image export and email attachment

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

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
4. System records entry/exit/movement
5. Displays student details and scan result

### Food Distribution Flow
1. Volunteer at food counter logs in
2. Scans student QR code
3. System validates (one claim per day)
4. Approves or denies food distribution
5. Records claim with timestamp

### Admin Management Flow
1. Admin logs in to dashboard
2. Views real-time statistics (students, halls, occupancy, food claims)
3. Navigates to student management
4. Views students as beautiful ID cards in grid layout
5. Can download, edit, or delete any student
6. Toggles between card and table views for occupancy/food claims
7. Manages halls and volunteers
8. Views detailed reports with flexible display options

## 🎨 Features in Detail

### Professional ID Card Generation
- **Auto-generated Design**: Beautiful gradient background with event branding
- **Complete Student Info**: Name, Event ID, email, phone, branch, year
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
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Admin, Scanner, Volunteer permissions
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data in .env files
- **Unique Event IDs**: Cryptographically generated (16-character hex)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `POST /api/users/register` - Student registration
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
- `PUT /api/admin/students/:studentId` - Update student
- `DELETE /api/admin/students/:studentId` - Delete student
- `GET /api/admin/volunteers` - All volunteers
- `POST /api/admin/volunteers` - Create volunteer
- `PUT /api/admin/volunteers/:volunteerId` - Update volunteer
- `DELETE /api/admin/volunteers/:volunteerId` - Delete volunteer
- `GET /api/admin/food-claims` - Food claims by date

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

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

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- All contributors and users of this system
