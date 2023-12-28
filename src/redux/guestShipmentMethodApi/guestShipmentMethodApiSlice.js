import { createSlice } from '@reduxjs/toolkit';
import { getGuestShippmentMethods } from './guestShipmentMethodApiAsyncThunk'
const initialState = {
  guestShippmentMethods: [],
  status: 'idle',
  error: null,
};

const getGuestShippmentMethodsApiSlice = createSlice({
  name: 'getCustomerDetails',
  initialState,
  extraReducers: builder => {
    builder.addCase(getGuestShippmentMethods.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getGuestShippmentMethods.fulfilled, (state, action) => {
      state.status = 'success';
      state.guestShippmentMethods = action.payload;
    });
    builder.addCase(getGuestShippmentMethods.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getGuestShippmentMethodsApiSlice.reducer;
