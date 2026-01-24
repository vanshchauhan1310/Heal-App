import { Router } from 'express';
import { updateProfile } from '../controllers/userProfile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validation/schemas';

const router = Router();

router.post('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
