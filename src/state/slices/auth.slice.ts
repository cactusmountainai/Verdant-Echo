import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store'; // Only import types, not store.dispatch

interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
    },
    loginSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure(state) {
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Thunk for async login (replaces direct store.dispatch calls)
export const loginAsync = (username: string): AppThunk => async (dispatch) => {
  try {
    dispatch(loginStart());
    // Simulate API call
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    dispatch(loginSuccess(data.user));
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
