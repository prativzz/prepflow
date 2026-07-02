import express from 'express';
import { registerUser, loginUser, logoutUser, getMe, refreshToken, googleLogin, googleRegister, updateProfile, updatePassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.post('/google-register', googleRegister);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

export default router;
