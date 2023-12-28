import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';
export const getGuestShippmentMethods = createAsyncThunk(
  'guestShippmentMethods',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.getWithGuestEndpoint(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
