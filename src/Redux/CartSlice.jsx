

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axios.get('/api/cart');
  return response.data;
});

export const addToCart = createAsyncThunk('cart/addToCart', async (item) => {
  const response = await axios.post('/api/cart', item);
  return response.data.cart;
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ id, color, quantity }) => {
  const response = await axios.patch(`/api/cart/${id}`, { color, quantity });
  return response.data.cart;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ id, color }, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/cart/${id}`, { data: { color } });
    return response.data.cart;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
});


const initialState = {
  items: [],
  status: 'idle',
  error: null,
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
     
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload?.error || action.error.message;
      });
  },
});

export default cartSlice.reducer;
