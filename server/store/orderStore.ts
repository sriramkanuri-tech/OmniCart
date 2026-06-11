export interface Order {
  orderId: string;
  productId?: string;
  productName: string;
  amount: number;
  category: string;
  userId?: string;
  userEmail: string;
  userName: string;
  status: 'PENDING' | 'PLACED' | string; // PENDING or PLACED
  uropayTransactionId?: string;
  placedAt?: string;
  createdAt?: string;
  emailSent?: boolean;
}

class OrderStore {
  private orders: Map<string, Order> = new Map();

  createOrder(orderData: Order): Order {
    const existing = this.orders.get(orderData.orderId);
    if (existing) {
      console.log(`[Store] createOrder called for existing order: ${orderData.orderId}. Returning existing.`);
      return existing;
    }
    const newOrder: Order = {
      ...orderData,
      status: orderData.status || 'PENDING',
      createdAt: orderData.createdAt || new Date().toISOString(),
      emailSent: orderData.emailSent || false,
    };
    this.orders.set(orderData.orderId, newOrder);
    console.log(`[Store] Created order ${orderData.orderId} with status ${newOrder.status}`);
    return newOrder;
  }

  saveOrUpdateOrder(orderData: Order): Order {
    const existing = this.orders.get(orderData.orderId);
    if (existing) {
      const updatedOrder: Order = {
        ...existing,
        ...orderData,
        // Ensure we don't accidentally revert a "PLACED" order to "PENDING"
        status: (existing.status === 'PLACED' && orderData.status === 'PENDING') ? 'PLACED' : orderData.status,
        placedAt: orderData.status === 'PLACED' ? (existing.placedAt || orderData.placedAt || new Date().toISOString()) : existing.placedAt,
        uropayTransactionId: orderData.uropayTransactionId || existing.uropayTransactionId,
        emailSent: orderData.emailSent !== undefined ? orderData.emailSent : existing.emailSent,
      };
      this.orders.set(orderData.orderId, updatedOrder);
      console.log(`[Store] Updated order ${orderData.orderId}, status is now: ${updatedOrder.status}`);
      return updatedOrder;
    } else {
      const newOrder: Order = {
        ...orderData,
        createdAt: orderData.createdAt || new Date().toISOString(),
        placedAt: orderData.status === 'PLACED' ? (orderData.placedAt || new Date().toISOString()) : undefined,
        emailSent: orderData.emailSent || false,
      };
      this.orders.set(orderData.orderId, newOrder);
      console.log(`[Store] Saved new order ${orderData.orderId} with status: ${newOrder.status}`);
      return newOrder;
    }
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  getOrdersByEmail(email: string): Order[] {
    return Array.from(this.orders.values())
      .filter(order => order.userEmail.toLowerCase() === email.toLowerCase());
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  // Forward compatibility / backwards compatibility helper
  saveOrder(orderData: Order): Order {
    return this.saveOrUpdateOrder(orderData);
  }
}

export const orderStore = new OrderStore();
