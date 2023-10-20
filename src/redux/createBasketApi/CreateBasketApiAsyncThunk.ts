import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';

export const createCustomerBasket = createAsyncThunk(
  'createCustomerBasket',
  async (endpoint: string) => {
    try {
      const response = await api.post(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
