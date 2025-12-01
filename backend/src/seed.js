import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import AdminUser from './models/AdminUser.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await AdminUser.findOne({ email: 'admin@utkarsh.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await AdminUser.create({
      name: 'Admin User',
      email: 'admin@utkarsh.com',
      passwordHash,
      role: 'ADMIN'
    });

    await AdminUser.create({
      name: 'Scanner User',
      email: 'scanner@utkarsh.com',
      passwordHash: await bcrypt.hash('scanner123', 10),
      role: 'SCANNER'
    });

    console.log('Admin and Scanner users created successfully');
    console.log('Admin: admin@utkarsh.com / admin123');
    console.log('Scanner: scanner@utkarsh.com / scanner123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
