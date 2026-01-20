import { Router } from 'express';
import { updateProfile } from '../controllers/userProfile.controller';

const router = Router();

router.post('/profile', updateProfile);

export default router;
