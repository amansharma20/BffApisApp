import { createSlice } from '@reduxjs/toolkit';
import { createCustomerBasket } from './CreateBasketApiAsyncThunk';

const initialState = {
  customerBasket: [],
  status: 'idle',
  error: null,
};

const createCustomerBasketSlice = createSlice({
  name: 'createCustomerBasket',
  initialState,
  extraReducers: builder => {
    builder.addCase(createCustomerBasket.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(createCustomerBasket.fulfilled, (state, action) => {
      state.status = 'success';
      state.customerBasket = action.payload;
    });
    builder.addCase(createCustomerBasket.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});
export default createCustomerBasketSlice.reducer;
