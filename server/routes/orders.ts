import { Router } from 'express';
import { orderController } from '../controllers/orderController';

const router = Router();

router.post('/create', orderController.createOrder);
router.get('/status/:orderId', orderController.getOrder);
router.post('/save', orderController.saveOrder);
router.get('/my-orders', orderController.getMyOrders);

export default router;
