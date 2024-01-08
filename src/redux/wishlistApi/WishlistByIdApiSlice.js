import { createSlice } from '@reduxjs/toolkit';
import { getWishlistById } from './WishlistByIdApiAsyncThunk';
const initialState = {
  itemsCount: null,
  WishlistById: [],
  status: 'idle',
  error: null,
};
const getWishlistByIdApiSlice = createSlice({
  name: 'getWishlistById',
  initialState,
  extraReducers: builder => {
    builder.addCase(getWishlistById.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getWishlistById.fulfilled, (state, action) => {
      state.status = 'success';
      state.WishlistById = action?.payload;
    });
    builder.addCase(getWishlistById.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getWishlistByIdApiSlice.reducer;
