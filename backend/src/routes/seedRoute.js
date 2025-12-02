import express from 'express';
import { seedDatabase } from '../seed.js';

const router = express.Router();

/**
 * Temporary seed endpoint for production deployment
 * ⚠️ WARNING: This endpoint should be removed after initial seeding
 * 
 * Usage: GET https://your-backend.onrender.com/seed
 */
router.get('/', async (req, res) => {
  try {
    console.log('📡 Seed endpoint called');
    
    const result = await seedDatabase();
    
    res.json({
      success: true,
      message: result.message,
      users: result.users,
      timestamp: new Date().toISOString(),
      warning: '⚠️ Remove this endpoint after seeding!'
    });
  } catch (error) {
    console.error('Seed endpoint error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
