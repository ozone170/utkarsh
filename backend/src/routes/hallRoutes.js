import express from 'express';
import { createHall, getHalls, updateHall, deleteHall } from '../controllers/hallController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('ADMIN'), createHall);
router.get('/', getHalls);
router.put('/:hallId', authMiddleware, roleMiddleware('ADMIN'), updateHall);
router.delete('/:hallId', authMiddleware, roleMiddleware('ADMIN'), deleteHall);

export default router;
