import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

import orderRoutes from "./server/routes/orders";
import webhookRoutes from "./server/routes/webhook";
import adminRoutes from "./server/routes/admin";
import { userStore } from "./server/store/userStore";
import { orderStore } from "./server/store/orderStore";
import { getSMTPStatus, sendOrderConfirmationEmail } from "./server/services/emailService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mount routes
  app.use("/api/orders", orderRoutes);
  app.use("/api/webhook", webhookRoutes);
  app.use("/api/admin", adminRoutes);
  
  // Email System Routes
  app.get("/api/email/status", async (req, res) => {
    const statusResult = await getSMTPStatus();
    res.json(statusResult);
  });

  app.post("/api/email/test", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Recipient email is required" });
      return;
    }
    
    console.log(`[Server] Manual email test triggered for ${email}`);
    const success = await sendOrderConfirmationEmail({
      orderId: "TEST_ORDER_123",
      productName: "OmniCart Test Product",
      userEmail: email,
      userName: "Test User",
      amount: 499,
      category: "Test"
    });
    
    if (success) {
      res.json({ success: true, message: `Test email successfully sent to ${email}` });
    } else {
      res.status(500).json({ success: false, error: "Failed to send test email. Check server logs." });
    }
  });

  // Debug endpoints
  app.get("/api/debug/orders", async (req, res) => {
    res.json(await orderStore.getAllOrders());
  });

  app.get("/api/debug/order/:orderId", async (req, res) => {
    const order = await orderStore.getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(order);
  });

  // Order tracking endpoint (Part 4)
  app.post("/api/orders/track", async (req, res) => {
    const { orderId, userEmail, userName, productName, category, amount, status, uropayId, timestamp } = req.body;
    if (!orderId || !userEmail) {
      res.status(400).json({ error: "orderId and userEmail are required" });
      return;
    }
    await orderStore.createOrder({
      orderId,
      productId: 'tracked-custom',
      productName: productName || 'Custom Product',
      amount: parseFloat(amount) || 0,
      category: category || 'Default',
      userEmail,
      userName: userName || userEmail.split('@')[0],
      status: status || 'PAID',
      createdAt: timestamp || new Date().toISOString()
    });
    res.json({ success: true });
  });

  // User login tracking endpoint
  app.post("/api/users/track", async (req, res) => {
    const { email, name, photo } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    const trackedUser = await userStore.trackLogin(email, name, photo);
    res.json({ success: true, user: trackedUser });
  });

  // Example payments endpoint
  app.post("/api/payments", (req, res) => {
    const { amount, method } = req.body;
    // Simulate payment processing
    if (amount > 0) {
      res.json({ success: true, message: `Successfully processed ${method} payment of $${amount}` });
    } else {
      res.status(400).json({ success: false, message: "Invalid amount" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
