import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Example async thunk for side effect (replaces dispatch inside reducer)
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface UserState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
