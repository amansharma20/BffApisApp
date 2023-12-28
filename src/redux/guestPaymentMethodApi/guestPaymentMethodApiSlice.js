import { createSlice } from '@reduxjs/toolkit';
import { getGuestPaymentMethods } from './guestPaymentMethodApiAsyncThunk'
const initialState = {
  guestPaymentsMethods: [],
  status: 'idle',
  error: null,
};

const getGuestPaymentMethodsApiSlice = createSlice({
  name: 'getCustomerDetails',
  initialState,
  extraReducers: builder => {
    builder.addCase(getGuestPaymentMethods.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getGuestPaymentMethods.fulfilled, (state, action) => {
      state.status = 'success';
      state.guestPaymentsMethods = action.payload;
    });
    builder.addCase(getGuestPaymentMethods.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getGuestPaymentMethodsApiSlice.reducer;
