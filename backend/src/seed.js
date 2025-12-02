import bcrypt from 'bcryptjs';
import AdminUser from './models/AdminUser.js';

/**
 * Seed database with default admin and scanner users
 * Can be called via HTTP endpoint or CLI
 */
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: 'admin@utkarsh.com' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
    } else {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await AdminUser.create({
        name: 'Admin User',
        email: 'admin@utkarsh.com',
        passwordHash,
        role: 'ADMIN'
      });
      console.log('✓ Admin user created: admin@utkarsh.com / admin123');
    }

    // Check if scanner already exists
    const existingScanner = await AdminUser.findOne({ email: 'scanner@utkarsh.com' });
    if (existingScanner) {
      console.log('✓ Scanner user already exists');
    } else {
      const passwordHash = await bcrypt.hash('scanner123', 10);
      await AdminUser.create({
        name: 'Scanner User',
        email: 'scanner@utkarsh.com',
        passwordHash,
        role: 'SCANNER'
      });
      console.log('✓ Scanner user created: scanner@utkarsh.com / scanner123');
    }

    console.log('✅ Database seeding completed successfully');
    
    return {
      success: true,
      message: 'Database seeded successfully',
      users: [
        { email: 'admin@utkarsh.com', password: 'admin123', role: 'ADMIN' },
        { email: 'scanner@utkarsh.com', password: 'scanner123', role: 'SCANNER' }
      ]
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// CLI execution (when run directly with npm run seed)
if (import.meta.url === `file://${process.argv[1]}`) {
  const dotenv = await import('dotenv');
  const { connectDB } = await import('./config/db.js');
  
  dotenv.config();
  
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}
