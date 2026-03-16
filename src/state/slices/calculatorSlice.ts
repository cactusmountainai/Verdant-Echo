import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface CalculatorState {
  result: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: CalculatorState = {
  result: null,
  loading: false,
  error: null,
};

// Async thunk for calculator side effect (e.g., API-based calculation)
export const calculateAsync = createAsyncThunk(
  'calculator/calculate',
  async ({ a, b }: { a: number; b: number }, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a, b }),
      });
      if (!response.ok) throw new Error('Calculation failed');
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    calculateSync: (state, action: PayloadAction<{ a: number; b: number }>) => {
      state.result = action.payload.a + action.payload.b;
      state.error = null;
    },
    clearResult: (state) => {
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload.result;
      })
      .addCase(calculateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { calculateSync, clearResult } = calculatorSlice.actions;
export default calculatorSlice.reducer;
