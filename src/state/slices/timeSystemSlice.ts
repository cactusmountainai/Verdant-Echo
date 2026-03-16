import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface TimeState {
  time: number; // seconds since game start
}

const initialState: TimeState = {
  time: 0,
};

export const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    updateTime: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
    },
    
    // Helper function to advance time by a specific amount
    advanceTime: (state, action: PayloadAction<number>) => {
      state.time += action.payload;
    },
    
    // Reset time (for debugging or new game)
    resetTime: (state) => {
      state.time = 0;
    }
  },
});

export const { updateTime, advanceTime, resetTime } = timeSystemSlice.actions;

// Selectors
export const selectTime = (state: RootState) => state.timeSystem.time;

export default timeSystemSlice.reducer;
