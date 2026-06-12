class OrderStore {
  orders = /* @__PURE__ */ new Map();
  createOrder(orderData) {
    const existing = this.orders.get(orderData.orderId);
    if (existing) {
      console.log(`[Store] createOrder called for existing order: ${orderData.orderId}. Returning existing.`);
      return existing;
    }
    const newOrder = {
      ...orderData,
      status: orderData.status || "PENDING",
      createdAt: orderData.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      emailSent: orderData.emailSent || false
    };
    this.orders.set(orderData.orderId, newOrder);
    console.log(`[Store] Created order ${orderData.orderId} with status ${newOrder.status}`);
    return newOrder;
  }
  saveOrUpdateOrder(orderData) {
    const existing = this.orders.get(orderData.orderId);
    if (existing) {
      const updatedOrder = {
        ...existing,
        ...orderData,
        // Ensure we don't accidentally revert a "PLACED" order to "PENDING"
        status: existing.status === "PLACED" && orderData.status === "PENDING" ? "PLACED" : orderData.status,
        placedAt: orderData.status === "PLACED" ? existing.placedAt || orderData.placedAt || (/* @__PURE__ */ new Date()).toISOString() : existing.placedAt,
        uropayTransactionId: orderData.uropayTransactionId || existing.uropayTransactionId,
        emailSent: orderData.emailSent !== void 0 ? orderData.emailSent : existing.emailSent
      };
      this.orders.set(orderData.orderId, updatedOrder);
      console.log(`[Store] Updated order ${orderData.orderId}, status is now: ${updatedOrder.status}`);
      return updatedOrder;
    } else {
      const newOrder = {
        ...orderData,
        createdAt: orderData.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        placedAt: orderData.status === "PLACED" ? orderData.placedAt || (/* @__PURE__ */ new Date()).toISOString() : void 0,
        emailSent: orderData.emailSent || false
      };
      this.orders.set(orderData.orderId, newOrder);
      console.log(`[Store] Saved new order ${orderData.orderId} with status: ${newOrder.status}`);
      return newOrder;
    }
  }
  getOrderById(orderId) {
    return this.orders.get(orderId);
  }
  getOrdersByEmail(email) {
    return Array.from(this.orders.values()).filter((order) => order.userEmail.toLowerCase() === email.toLowerCase());
  }
  getAllOrders() {
    return Array.from(this.orders.values());
  }
  // Forward compatibility / backwards compatibility helper
  saveOrder(orderData) {
    return this.saveOrUpdateOrder(orderData);
  }
}
export const orderStore = new OrderStore();
