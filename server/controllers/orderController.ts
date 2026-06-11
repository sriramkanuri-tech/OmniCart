import { Request, Response } from 'express';
import { orderStore } from '../store/orderStore';
import { sendOrderConfirmationEmail } from '../services/emailService';

export const orderController = {
  // POST /api/orders/create
  createOrder(req: Request, res: Response) {
    try {
      const { 
        productId, productName, amount, userId, 
        userEmail, userName, category 
      } = req.body;

      if (!productName || amount === undefined || !userEmail) {
        res.status(400).json({ success: false, error: 'Missing required order fields: productName, amount, or userEmail' });
        return;
      }

      // Generate structured or unique orderId
      const cleanCategory = (category || 'Shopping').replace(/[^a-zA-Z0-9]/g, '');
      const cleanProdId = (productId || 'prod').replace(/[^a-zA-Z0-9]/g, '');
      const orderId = `${cleanCategory}_${cleanProdId}_${Date.now()}`;

      console.log(`[OrderController] Creating pending order ${orderId} for product ${productName}`);

      const pendingOrder = orderStore.createOrder({
        orderId,
        productId: productId || 'prod_generic',
        productName,
        amount: parseFloat(amount.toString()),
        category: category || 'Shopping',
        userId: userId || userEmail,
        userEmail,
        userName: userName || userEmail.split('@')[0],
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        emailSent: false
      });

      res.status(201).json({
        success: true,
        orderId,
        order: pendingOrder
      });
    } catch (error) {
      console.error('[OrderController] Error in createOrder:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  // GET /api/orders/status/:orderId
  getOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = orderStore.getOrderById(orderId);

      if (!order) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error('[OrderController] Error in getOrder:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  // POST /api/orders/save
  async saveOrder(req: Request, res: Response) {
    try {
      const { 
        orderId, productName, amount, category, 
        userEmail, userName, uropayTransactionId, status
      } = req.body;

      if (!orderId || !userEmail) {
        res.status(400).json({ error: 'Missing orderId or userEmail' });
        return;
      }

      console.log(`[OrderController] Backup saveOrder triggered for orderId: ${orderId}`);

      let order = orderStore.getOrderById(orderId);

      if (order) {
        console.log(`[OrderController] Existing order found, current status: ${order.status}`);
        if (order.status === 'PLACED') {
          // Send response immediately
          res.status(200).json(order);
          return;
        } else {
          // If order is PENDING, transition to PLACED
          order = orderStore.saveOrUpdateOrder({
            ...order,
            status: 'PLACED',
            uropayTransactionId: uropayTransactionId || order.uropayTransactionId || 'frontend_fallback_tx',
            placedAt: order.placedAt || new Date().toISOString()
          });
        }
      } else {
        // If order does not exist at all, create as PLACED
        console.log(`[OrderController] Order ${orderId} does not exist in store, saving new PLACED order.`);
        order = orderStore.saveOrUpdateOrder({
          orderId,
          productId: req.body.productId || 'fallback_productId',
          productName: productName || 'OmniCart Product',
          amount: parseFloat((amount || 0).toString()),
          category: category || 'Shopping',
          userId: req.body.userId || userEmail,
          userEmail,
          userName: userName || userEmail.split('@')[0],
          status: 'PLACED',
          uropayTransactionId: uropayTransactionId || 'frontend_fallback_tx',
          createdAt: new Date().toISOString(),
          placedAt: new Date().toISOString(),
          emailSent: false
        });
      }

      // Try sending email only if not yet sent
      if (!order.emailSent) {
        console.log(`[OrderController] Sending confirmation email from backup mechanism...`);
        const emailSentResult = await sendOrderConfirmationEmail(order);
        if (emailSentResult) {
          order.emailSent = true;
          orderStore.saveOrUpdateOrder(order);
          console.log(`[OrderController] order ID ${orderId} updated to emailSent = true.`);
        }
      } else {
        console.log(`[OrderController] Email already flagged as sent for order ${orderId}. Skipping duplicate email.`);
      }

      res.status(200).json(order);
    } catch (error) {
      console.error('[OrderController] Error in saveOrder:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/orders/my-orders?email=user@gmail.com
  getMyOrders(req: Request, res: Response) {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Email query parameter is required' });
        return;
      }

      const orders = orderStore.getOrdersByEmail(email);
      
      // Sort newest first
      orders.sort((a, b) => {
        const timeA = new Date(a.placedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.placedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      res.json(orders);
    } catch (error) {
      console.error('[OrderController] Error in getMyOrders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
