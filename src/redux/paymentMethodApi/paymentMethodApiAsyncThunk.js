import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/SecureAPI';

export const getPaymentMethods = createAsyncThunk(
  'paymentMethods',
  async (endpoint, thunkAPI) => {
    try {
      // if(!isUserLoggedIn){
        // const response = await api.getWithGuestEndpoint(endpoint);
        // return response.data;
        // }else{
          const response = await api.getWithEndpoint(endpoint);
          return response.data;
        // }
    } catch (error) {
      return error;
    }
  },
);