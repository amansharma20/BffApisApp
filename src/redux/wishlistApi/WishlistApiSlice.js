import { createSlice } from '@reduxjs/toolkit';
import { getCustomerWishlist } from './WishlistApiAsyncThunk';
const initialState = {
  itemsCount: null,
  customerWishlist: [],
  status: 'idle',
  error: null,
};
const getCustomerWishlistApiSlice = createSlice({
  name: 'getCustomerWishlist',
  initialState,
  extraReducers: builder => {
    builder.addCase(getCustomerWishlist.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getCustomerWishlist.fulfilled, (state, action) => {
      state.status = 'success';
      state.customerWishlist = action?.payload;
    });
    builder.addCase(getCustomerWishlist.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getCustomerWishlistApiSlice.reducer;
