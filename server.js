import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import orderRoutes from './server/routes/orders.js';
import webhookRoutes from './server/routes/webhook.js';
import adminRoutes from './server/routes/admin.js';
import { userStore } from './server/store/userStore.js';
import { orderStore } from "./server/store/orderStore.js";
async function startServer() {
  const app = express();
  const PORT = 3e3;
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/orders", orderRoutes);
  app.use("/api/webhook", webhookRoutes);
  app.use("/api/admin", adminRoutes);
  app.get("/api/debug/orders", (req, res) => {
    res.json(orderStore.getAllOrders());
  });
  app.get("/api/debug/order/:orderId", (req, res) => {
    const order = orderStore.getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(order);
  });
  app.post("/api/orders/track", (req, res) => {
    const { orderId, userEmail, userName, productName, category, amount, status, uropayId, timestamp } = req.body;
    if (!orderId || !userEmail) {
      res.status(400).json({ error: "orderId and userEmail are required" });
      return;
    }
    orderStore.createOrder({
      orderId,
      productId: "tracked-custom",
      productName: productName || "Custom Product",
      amount: parseFloat(amount) || 0,
      userId: userEmail,
      userEmail,
      userName: userName || userEmail.split("@")[0],
      status: status || "PAID",
      uropayButtonId: uropayId || "N/A",
      timestamp: timestamp || (/* @__PURE__ */ new Date()).toISOString()
    });
    res.json({ success: true });
  });
  app.post("/api/users/track", (req, res) => {
    const { email, name, photo } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    const trackedUser = userStore.trackLogin(email, name, photo);
    res.json({ success: true, user: trackedUser });
  });
  app.post("/api/payments", (req, res) => {
    const { amount, method } = req.body;
    if (amount > 0) {
      res.json({ success: true, message: `Successfully processed ${method} payment of $${amount}` });
    } else {
      res.status(400).json({ success: false, message: "Invalid amount" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
