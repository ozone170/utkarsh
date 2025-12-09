import express from 'express';
import { scanHall, scanFood } from '../controllers/scanController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Protect scan endpoints - only ADMIN, SCANNER, VOLUNTEER can scan
router.post('/hall', authMiddleware, roleMiddleware(['ADMIN', 'SCANNER', 'VOLUNTEER']), scanHall);
router.post('/food', authMiddleware, roleMiddleware(['ADMIN', 'SCANNER', 'VOLUNTEER']), scanFood);

export default router;
