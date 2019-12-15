import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    authenticate: (state, action) => action.payload
  }
});

export const { authenticate } = userSlice.actions;

export default userSlice.reducer;
