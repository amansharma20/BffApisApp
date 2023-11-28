import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';
export const getOrderDetailsAsyncThunk = createAsyncThunk(
  'ordersDetailsById',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.getWithEndpoint(endpoint, thunkAPI);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
