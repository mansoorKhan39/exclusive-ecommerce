import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Users
export const updateProfile = (data) => API.put('/users/profile', data);
export const getWishlist = () => API.get('/users/wishlist');
export const toggleWishlist = (productId) => API.post(`/users/wishlist/${productId}`);
export const getAllUsers = () => API.get('/users');

export default API;
