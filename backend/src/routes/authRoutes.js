// src/routes/authRoutes.js
import express from 'express';
import { login, register, getProfile } from '../controllers/authController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', verifyToken, getProfile);

export default router;
