import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hallRoutes from './routes/hallRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting and CORS to work properly behind reverse proxy
app.set('trust proxy', true);

connectDB();

// CORS Configuration - Dynamic origins from environment
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',    // Local development
    'http://localhost:5174',    // Alternative local port
    'http://localhost:3000',    // Alternative React port
    'https://utkarsh-eta.vercel.app',  // Production frontend
    'https://utkarsh-frontend.vercel.app',  // Alternative frontend URL
    'https://utkarsh.vercel.app',  // Alternative frontend URL
  ];
  
  // Add environment-specified origins
  if (process.env.FRONTEND_URL) {
    const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());
    origins.push(...envOrigins);
  }
  
  // Add additional allowed origins from environment
  if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim());
    origins.push(...additionalOrigins);
  }
  
  return [...new Set(origins.filter(Boolean))]; // Remove duplicates
};

const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (health checks, direct API calls, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow requests from Vercel preview deployments
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}));

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Rate limiting for scan endpoints
const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // limit each IP to 120 requests per windowMs
  message: {
    error: 'Too many scan requests',
    message: 'Please wait before scanning again',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests to avoid blocking legitimate usage
  skip: (_req, res) => res.statusCode < 400,
});

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all requests
app.use('/api/', generalLimiter);

app.get('/', (_req, res) => {
  res.json({ message: 'Utkarsh API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/scan', scanLimiter, scanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
