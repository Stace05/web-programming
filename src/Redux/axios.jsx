import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5001';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail'); 
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);


export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/cart');
      return response.data; 
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Network Error' });
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      const payload = {
        item_id: Number(item.id), 
        color: item.color,
        quantity: Number(item.quantity),
      };
      console.log('Sending addToCart payload:', payload); 
      const response = await axiosInstance.post('/api/cart', payload);
      return response.data.cart;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Network Error' });
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, color, quantity }, { rejectWithValue }) => {
    try {
      const payload = { color, quantity };
      console.log(`Updating cart item ${cartItemId} with payload:`, payload);
      const response = await axiosInstance.patch(`/api/cart/${cartItemId}`, payload);
      return response.data.cart; 
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Network Error' });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ cartItemId, color }, { rejectWithValue }) => {
    try {
      console.log(`Removing cart item ${cartItemId} with color: ${color}`);
      const response = await axiosInstance.delete(`/api/cart/${cartItemId}`, {
        data: { color },
      });
      return response.data.cart; 
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Network Error' });
    }
  }
);


export default axiosInstance;
