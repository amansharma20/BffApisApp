import { createSlice } from '@reduxjs/toolkit';
import { getNewArrival } from './NewArrivalApiAsyncThunk';

const initialState = {
  newArrivals: [],
  status: 'idle',
  error: null,
};

const getNewArrivalApiSlice = createSlice({
  name: 'getProductDetails',
  initialState,
  extraReducers: builder => {
    builder.addCase(getNewArrival.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getNewArrival.fulfilled, (state, action) => {
      state.status = 'success';
      state.newArrivals = action.payload;
    });
    builder.addCase(getNewArrival.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getNewArrivalApiSlice.reducer;
