import { createSlice } from '@reduxjs/toolkit';
import { getGuestCustomerBasketApi } from './guestBasketApiAsyncThunk';
const initialState = {
  guestCustomerBasket: [],
  status: 'idle',
  error: null,
};

const getGuestCustomerBasketApiSlice = createSlice({
  name: 'getGuestCustomerBasket',
  initialState,
  extraReducers: builder => {
    builder.addCase(getGuestCustomerBasketApi.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getGuestCustomerBasketApi.fulfilled, (state, action) => {
      state.status = 'success';
      state.guestCustomerBasket = action.payload;
    });
    builder.addCase(getGuestCustomerBasketApi.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});
export default getGuestCustomerBasketApiSlice.reducer;
