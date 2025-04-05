import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token');
    },
    loader(state, action) {
      state.loading = action.payload;
    }
  },
});

export const { loginSuccess, logoutSuccess, loader } = authSlice.actions;
export default authSlice.reducer;
