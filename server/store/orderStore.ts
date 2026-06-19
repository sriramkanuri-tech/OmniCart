import { getFirestore } from '../lib/firebaseAdmin';

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
  private collectionName = 'orders';

  async createOrder(orderData: Order): Promise<Order> {
    const db = getFirestore();
    const orderRef = db.collection(this.collectionName).doc(orderData.orderId);
    const doc = await orderRef.get();
    
    if (doc.exists) {
      console.log(`[Store] createOrder called for existing order: ${orderData.orderId}. Returning existing.`);
      return doc.data() as Order;
    }
    
    const newOrder: Order = {
      ...orderData,
      status: orderData.status || 'PENDING',
      createdAt: orderData.createdAt || new Date().toISOString(),
      emailSent: orderData.emailSent || false,
    };
    await orderRef.set(newOrder);
    console.log(`[Store] Created order ${orderData.orderId} with status ${newOrder.status}`);
    return newOrder;
  }

  async saveOrUpdateOrder(orderData: Order): Promise<Order> {
    const db = getFirestore();
    const orderRef = db.collection(this.collectionName).doc(orderData.orderId);
    const doc = await orderRef.get();
    
    if (doc.exists) {
      const existing = doc.data() as Order;
      const updatedOrder: Order = {
        ...existing,
        ...orderData,
        status: (existing.status === 'PLACED' && orderData.status === 'PENDING') ? 'PLACED' : orderData.status,
        placedAt: orderData.status === 'PLACED' ? (existing.placedAt || orderData.placedAt || new Date().toISOString()) : existing.placedAt,
        uropayTransactionId: orderData.uropayTransactionId || existing.uropayTransactionId,
        emailSent: orderData.emailSent !== undefined ? orderData.emailSent : existing.emailSent,
      };
      await orderRef.update(updatedOrder as any);
      console.log(`[Store] Updated order ${orderData.orderId}, status is now: ${updatedOrder.status}`);
      return updatedOrder;
    } else {
      const newOrder: Order = {
        ...orderData,
        createdAt: orderData.createdAt || new Date().toISOString(),
        placedAt: orderData.status === 'PLACED' ? (orderData.placedAt || new Date().toISOString()) : undefined,
        emailSent: orderData.emailSent || false,
      };
      await orderRef.set(newOrder);
      console.log(`[Store] Saved new order ${orderData.orderId} with status: ${newOrder.status}`);
      return newOrder;
    }
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const db = getFirestore();
    const doc = await db.collection(this.collectionName).doc(orderId).get();
    return doc.exists ? (doc.data() as Order) : undefined;
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collectionName)
      .where('userEmail', '==', email)
      .get();
    return snapshot.docs.map(doc => doc.data() as Order);
  }

  async getAllOrders(): Promise<Order[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => doc.data() as Order);
  }

  async saveOrder(orderData: Order): Promise<Order> {
    return this.saveOrUpdateOrder(orderData);
  }
}

export const orderStore = new OrderStore();
