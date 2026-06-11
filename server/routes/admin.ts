import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { isAdmin } from '../middleware/isAdmin';

const router = Router();

// Apply admin protection middleware globally to all sub-routes here
router.use(isAdmin);

// Users Management
router.get('/users', adminController.getUsers);
router.get('/users/:email/orders', adminController.getUserOrders);

// Products Management
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Offers Management
router.get('/offers', adminController.getOffers);
router.post('/offers', adminController.createOffer);
router.put('/offers/:id', adminController.updateOffer);
router.delete('/offers/:id', adminController.deleteOffer);

// Orders Management
router.get('/orders', adminController.getAllOrders);

// Dashboard Stats
router.get('/stats', adminController.getStats);

export default router;
