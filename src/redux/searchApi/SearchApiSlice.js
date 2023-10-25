import { createSlice } from '@reduxjs/toolkit';
import { searchProducts } from './SearchApiAsyncThunk';
const initialState = {
  products: [],
  status: 'idle',
  error: null,
};

const searchProductsApiSlice = createSlice({
  name: 'getSearchProducts',
  initialState,
  extraReducers: builder => {
    builder.addCase(searchProducts.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.status = 'success';
      state.products = action.payload;
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default searchProductsApiSlice.reducer;
