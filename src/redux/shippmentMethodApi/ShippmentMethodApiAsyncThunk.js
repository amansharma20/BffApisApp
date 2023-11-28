import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';
export const getShippmentMethods = createAsyncThunk(
  'shippmentMethods',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.getWithEndpoint(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
