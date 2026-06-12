import axios from "axios";
const API_URL = import.meta.env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_URL
});
export const createOrder = async (orderData) => {
  const response = await api.post("/api/orders/create", orderData);
  return response.data;
};
export const getOrderStatus = async (orderId) => {
  const response = await api.get(`/api/orders/status/${orderId}`);
  return response.data;
};
export const saveOrder = async (orderData) => {
  const response = await api.post("/api/orders/save", orderData);
  return response.data;
};
export const getMyOrders = async (email) => {
  const response = await api.get(`/api/orders/my-orders?email=${encodeURIComponent(email)}`);
  return response.data;
};
