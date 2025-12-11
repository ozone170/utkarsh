import express from 'express';
import Joi from 'joi';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validation.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  downloadIdCard
} from '../controllers/profileController.js';

const router = express.Router();

// Profile schema for updates (subset of user registration)
const profileUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().max(254).optional(),
  phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
  program: Joi.string().valid('MBA', 'B.Tech', 'M.Tech', 'BBA', 'MCA', 'Other').optional(),
  year: Joi.number().integer().min(1).max(4).optional()
});

// Password change schema
const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Profile routes
router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, validateRequest(profileUpdateSchema), updateProfile);
router.put('/password', authMiddleware, validateRequest(passwordChangeSchema), changePassword);



// Document downloads
router.get('/idcard', authMiddleware, downloadIdCard);

export default router;