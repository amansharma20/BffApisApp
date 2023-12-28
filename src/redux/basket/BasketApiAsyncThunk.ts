import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';

export const getCustomerBasketApi = createAsyncThunk(
  'basketApi',
  async (endpoint: string) => {
    try {
      const response = await api.getWithEndpoint(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

