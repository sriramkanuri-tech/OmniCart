import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

import orderRoutes from "./server/routes/orders";
import webhookRoutes from "./server/routes/webhook";
import adminRoutes from "./server/routes/admin";
import { userStore } from "./server/store/userStore";

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

  // Debug endpoints
  app.get("/api/debug/orders", (req, res) => {
    const { orderStore } = require("./server/store/orderStore");
    res.json(orderStore.getAllOrders());
  });

  app.get("/api/debug/order/:orderId", (req, res) => {
    const { orderStore } = require("./server/store/orderStore");
    const order = orderStore.getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(order);
  });

  // Order tracking endpoint (Part 4)
  app.post("/api/orders/track", (req, res) => {
    const { orderId, userEmail, userName, productName, category, amount, status, uropayId, timestamp } = req.body;
    if (!orderId || !userEmail) {
      res.status(400).json({ error: "orderId and userEmail are required" });
      return;
    }
    const { orderStore } = require("./server/store/orderStore");
    orderStore.createOrder({
      orderId,
      productId: 'tracked-custom',
      productName: productName || 'Custom Product',
      amount: parseFloat(amount) || 0,
      userId: userEmail,
      userEmail,
      userName: userName || userEmail.split('@')[0],
      status: status || 'PAID',
      uropayButtonId: uropayId || 'N/A',
      timestamp: timestamp || new Date().toISOString()
    });
    res.json({ success: true });
  });

  // User login tracking endpoint
  app.post("/api/users/track", (req, res) => {
    const { email, name, photo } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    const trackedUser = userStore.trackLogin(email, name, photo);
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
