import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isLoading: boolean;
  error: string | null;
  data: any[]; // Replace 'any' with actual type
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  data: [],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setData(state, action: PayloadAction<AppState['data']>) {
      state.data = action.payload;
    },
  },
});

export const { startLoading, stopLoading, setError, setData } = appSlice.actions;
export default appSlice.reducer;
