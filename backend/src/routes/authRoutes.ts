import { Router } from 'express';
import { login, signup, sendOtp, verifyOtp } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, signupSchema, sendOtpSchema, verifyOtpSchema } from '../validation/schemas';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/signup', validate(signupSchema), signup);
router.post('/send-otp', validate(sendOtpSchema), sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);

export default router;
