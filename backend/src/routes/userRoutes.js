import express from 'express';
import { registerUser, getUserByEventId } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/by-event-id/:eventId', getUserByEventId);

export default router;
