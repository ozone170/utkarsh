import express from 'express';
import { scanHall, scanFood } from '../controllers/scanController.js';

const router = express.Router();

router.post('/hall', scanHall);
router.post('/food', scanFood);

export default router;
