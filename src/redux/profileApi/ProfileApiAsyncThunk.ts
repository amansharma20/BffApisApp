import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';

export const getCustomerDetails = createAsyncThunk(
  'customerDetails',
  async (endpoint: string) => {
    try {
      const response = await api.getWithEndpoint(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
