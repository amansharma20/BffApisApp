import { createSlice } from '@reduxjs/toolkit';
import { getBestSellings } from './BestSellingProductApiAsyncThunk';

const initialState = {
  bestSellings: [],
  status: 'idle',
  error: null,
};

const getBestSellingsApiSlice = createSlice({
  name: 'getProductDetails',
  initialState,
  extraReducers: builder => {
    builder.addCase(getBestSellings.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getBestSellings.fulfilled, (state, action) => {
      state.status = 'success';
      state.bestSellings = action.payload;
    });
    builder.addCase(getBestSellings.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getBestSellingsApiSlice.reducer;
