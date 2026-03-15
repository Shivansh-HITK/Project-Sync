import { Router } from 'express';
import { initiatePairing, completePairing } from '../controllers/pairingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/initiate', authMiddleware, initiatePairing);
router.post('/complete', authMiddleware, completePairing);

export default router;
