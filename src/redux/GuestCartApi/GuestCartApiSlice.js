import { createSlice } from '@reduxjs/toolkit';
import {getGuestCustomerCartItems} from './GuestCartApiAsyncThunk'
// import { getCustomerCartItems } from './CartItemsAsyncThunk';

const initialState = {
  itemsCount: null,
  guestCustomerCartItems: [],
  status: 'idle',
  error: null,
};
const getGuestCustomerCartItemsApiSlice = createSlice({
  name: 'getGuestCustomerCartItems',
  initialState,
  extraReducers: builder => {
    builder.addCase(getGuestCustomerCartItems.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getGuestCustomerCartItems.fulfilled, (state, action) => {
      state.status = 'success';
      state.guestCustomerCartItems = action?.payload;
    });
    builder.addCase(getGuestCustomerCartItems.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getGuestCustomerCartItemsApiSlice.reducer;
