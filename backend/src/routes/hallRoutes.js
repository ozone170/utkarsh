import express from 'express';
import { createHall, getHalls } from '../controllers/hallController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('ADMIN'), createHall);
router.get('/', getHalls);

export default router;
