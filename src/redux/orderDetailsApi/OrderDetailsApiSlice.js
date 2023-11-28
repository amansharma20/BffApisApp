import { createSlice } from '@reduxjs/toolkit';
import { getOrderDetailsAsyncThunk } from './OrderDetailsApiAsyncThunk';
const initialState = {
  orderDetails: [],
  status: 'idle',
  error: null,
};

const getOrdersDetailsApiSlice = createSlice({
  name: 'getOrdersData',
  initialState,
  extraReducers: builder => {
    builder.addCase(getOrderDetailsAsyncThunk.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getOrderDetailsAsyncThunk.fulfilled, (state, action) => {
      state.status = 'success';
      state.orderDetails = action.payload;
    });
    builder.addCase(getOrderDetailsAsyncThunk.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getOrdersDetailsApiSlice.reducer;
