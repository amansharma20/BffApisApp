import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/SecureAPI';

export const getNewArrival = createAsyncThunk(
  'newArrival',
  async (endpoint: string) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);