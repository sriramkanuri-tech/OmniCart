import { Router } from 'express';
import { webhookController } from '../controllers/webhookController';

const router = Router();

router.post('/uropay', webhookController.handleUroPayWebhook);

export default router;
