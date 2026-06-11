import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
});

export const createOrder = async (orderData: {
  productId: string;
  productName: string;
  amount: number;
  productImage?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  category?: string;
}) => {
  const response = await api.post('/api/orders/create', orderData);
  return response.data;
};

export const getOrderStatus = async (orderId: string) => {
  const response = await api.get(`/api/orders/status/${orderId}`);
  return response.data;
};

export const saveOrder = async (orderData: {
  orderId: string;
  productName: string;
  amount: number;
  category: string;
  userEmail: string;
  userName: string;
  uropayTransactionId?: string;
  status?: string;
}) => {
  const response = await api.post('/api/orders/save', orderData);
  return response.data;
};

export const getMyOrders = async (email: string) => {
  const response = await api.get(`/api/orders/my-orders?email=${encodeURIComponent(email)}`);
  return response.data;
};
