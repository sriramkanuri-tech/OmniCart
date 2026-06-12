import { orderStore } from '../store/orderStore.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
export const webhookController = {
  // POST /api/webhook/uropay
  async handleUroPayWebhook(req, res) {
    try {
      console.log("UroPay webhook body:", req.body);
      const event = req.body.event || req.body.type || "";
      const payload = req.body.data || req.body.payload || req.body;
      const status = (payload.status || payload.payment_status || "").toString().toUpperCase();
      const orderId = payload.orderId || payload.order_id || "";
      const transactionId = payload.transactionId || payload.transaction_id || "";
      const customerEmail = payload.customerEmail || payload.email || "guest@omnicart.com";
      const customerName = payload.customerName || payload.name || "Customer";
      const productName = payload.productName || payload.product_name || "OmniCart Product";
      const amount = parseFloat(payload.amount || payload.total || "0");
      const category = payload.category || "shopping";
      console.log("Normalized webhook:", {
        event,
        status,
        orderId,
        transactionId,
        customerEmail
      });
      if (!orderId) {
        console.warn("[Webhook] Missing order ID in incoming payload.");
        res.status(200).json({ received: false, error: "Missing orderId" });
        return;
      }
      console.log(`[Webhook] Processing orderId: ${orderId}, status: ${status}, txId: ${transactionId}`);
      if (status === "SUCCESS" || status === "PAID" || event === "payment.success") {
        let order = orderStore.getOrderById(orderId);
        if (!order) {
          console.log(`[Webhook] Order ${orderId} not found in store. Creating a new PLACED order from webhook payload.`);
          order = orderStore.saveOrUpdateOrder({
            orderId,
            productId: payload.productId || "webhook_created",
            productName,
            amount,
            category,
            userId: payload.userId || customerEmail,
            userEmail: customerEmail,
            userName: customerName,
            status: "PLACED",
            uropayTransactionId: transactionId || "uropay_webhook_tx",
            placedAt: (/* @__PURE__ */ new Date()).toISOString(),
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            emailSent: false
          });
        } else {
          console.log(`[Webhook] Order ${orderId} found. Current status: ${order.status}`);
          order = orderStore.saveOrUpdateOrder({
            ...order,
            status: "PLACED",
            uropayTransactionId: transactionId || order.uropayTransactionId,
            placedAt: order.placedAt || (/* @__PURE__ */ new Date()).toISOString()
          });
        }
        if (!order.emailSent) {
          console.log(`[Webhook] Sending confirmation email for order ${orderId}...`);
          const emailSentResult = await sendOrderConfirmationEmail(order);
          if (emailSentResult) {
            order.emailSent = true;
            orderStore.saveOrUpdateOrder(order);
            console.log(`[Webhook] order ID ${orderId} marked as emailSent = true.`);
          } else {
            console.log(`[Webhook] order ID ${orderId} email sending failed.`);
          }
        } else {
          console.log(`[Webhook] Confirmation email already sent for orderId ${orderId}. Skipping duplicate email.`);
        }
      } else {
        console.log(`[Webhook] Order status: ${status} for orderId ${orderId} is not SUCCESS/PAID. No placement triggered.`);
      }
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("[Webhook] Error handling webhook:", error);
      res.status(200).json({ received: true, error: "Internal server error handled gracefully" });
    }
  }
};
