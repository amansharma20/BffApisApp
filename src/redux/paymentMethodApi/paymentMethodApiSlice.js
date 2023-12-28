import { createSlice } from '@reduxjs/toolkit';
import {getPaymentMethods} from './paymentMethodApiAsyncThunk.js'
const initialState = {
  paymentMethods: [],
  status: 'idle',
  error: null,
};

const getPaymentMethodsApiSlice = createSlice({
  name: 'getCustomerDetails',
  initialState,
  extraReducers: builder => {
    builder.addCase(getPaymentMethods.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getPaymentMethods.fulfilled, (state, action) => {
      state.status = 'success';
      state.paymentMethods = action.payload;
    });
    builder.addCase(getPaymentMethods.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getPaymentMethodsApiSlice.reducer;