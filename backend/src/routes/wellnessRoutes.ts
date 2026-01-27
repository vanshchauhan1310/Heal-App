import { Router } from 'express';
import { getDailyLog, saveDailyLog, getCycles, addCycle } from '../controllers/wellness.controller';

const router = Router();

// Logs
router.get('/logs', getDailyLog); // ?userId=...&date=...
router.post('/logs', saveDailyLog);

// Cycles
router.get('/cycles/:userId', getCycles);
router.post('/cycles', addCycle);

export default router;
