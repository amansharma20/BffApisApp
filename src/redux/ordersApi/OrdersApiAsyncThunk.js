import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';
export const getOrdersData = createAsyncThunk(
  'ordersData',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.getWithEndpoint(endpoint, thunkAPI);
      console.log(' response.data: ', response.data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
