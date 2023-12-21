import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';
export const getGuestCustomerCartItems = createAsyncThunk(
  'guestcartItems',
  async endpoint => {
    try {
      const response = await api.getWithEndpoint(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
