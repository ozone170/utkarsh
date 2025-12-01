# Utkarsh Fresher Manager

Event management system for tracking student registration, hall movement, and food distribution.

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

## 🔑 Default Credentials

After seeding:
- **Admin**: admin@utkarsh.com / admin123
- **Scanner**: scanner@utkarsh.com / scanner123

## 📱 Features

- 🎓 Student registration with QR codes
- 🏛️ Hall entry/exit tracking
- 🍽️ Food distribution management
- 👥 Volunteer management
- 📊 Real-time admin dashboard
- 📱 QR code scanning

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT

## 📖 Documentation

All documentation is available in the `/utkarsh` folder:
- Setup guides
- API documentation
- Architecture diagrams
- Testing guides

## 🤝 Contributing

See `/utkarsh/CONTRIBUTING.md` for contribution guidelines.

## 📄 License

MIT License
