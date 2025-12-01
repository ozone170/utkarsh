import express from 'express';
import { getOverviewStats, getHallOccupancy, createVolunteer, getVolunteers, updateVolunteer, deleteVolunteer } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/stats/overview', authMiddleware, roleMiddleware('ADMIN'), getOverviewStats);
router.get('/hall-occupancy', authMiddleware, roleMiddleware('ADMIN'), getHallOccupancy);
router.post('/volunteers', authMiddleware, roleMiddleware('ADMIN'), createVolunteer);
router.get('/volunteers', authMiddleware, roleMiddleware('ADMIN'), getVolunteers);
router.put('/volunteers/:volunteerId', authMiddleware, roleMiddleware('ADMIN'), updateVolunteer);
router.delete('/volunteers/:volunteerId', authMiddleware, roleMiddleware('ADMIN'), deleteVolunteer);

export default router;
