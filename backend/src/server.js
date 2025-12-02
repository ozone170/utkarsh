import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hallRoutes from './routes/hallRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import seedRoute from './routes/seedRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Utkarsh API is running' });
});

// ⚠️ TEMPORARY: Seed endpoint for production deployment
// Remove this route after initial database seeding
app.use('/seed', seedRoute);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
