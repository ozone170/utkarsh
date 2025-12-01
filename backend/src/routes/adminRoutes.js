import express from 'express';
import { getOverviewStats, getHallOccupancy } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/stats/overview', authMiddleware, roleMiddleware('ADMIN'), getOverviewStats);
router.get('/hall-occupancy', authMiddleware, roleMiddleware('ADMIN'), getHallOccupancy);

export default router;
