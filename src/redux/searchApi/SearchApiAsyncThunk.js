import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';
export const searchProducts = createAsyncThunk(
  'searchProducts',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.getWithEndpoint(endpoint, thunkAPI);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
