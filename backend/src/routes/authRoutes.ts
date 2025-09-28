import express from "express";
import {
    requestSignupOtp,
    verifySignupOtp,
    requestSigninOtp,
    verifySigninOtp,
    getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup/request-otp', requestSignupOtp);
router.post('/signup/verify-otp', verifySignupOtp);
router.post('/signin/request-otp', requestSigninOtp);
router.post('/signin/verify-otp', verifySigninOtp);
router.get('/profile', protect, getUserProfile);

export default router;