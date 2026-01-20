import { Router } from 'express';
import { login, signup, sendOtp, verifyOtp } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
