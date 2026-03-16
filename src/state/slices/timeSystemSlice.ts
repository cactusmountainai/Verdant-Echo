import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface TimeSystemState {
  currentTime: number;
  isPaused: boolean;
  speed: number;
}

const initialState: TimeSystemState = {
  currentTime: 0,
  isPaused: false,
  speed: 1.0
};

export const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    updateTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    }
  }
});

export const { updateTime, togglePause, setSpeed } = timeSystemSlice.actions;

// Selectors
export const selectTimeSystem = (state: RootState) => state.timeSystem;
export const selectCurrentTime = (state: RootState) => state.timeSystem.currentTime;
export const selectIsPaused = (state: RootState) => state.timeSystem.isPaused;
export const selectSpeed = (state: RootState) => state.timeSystem.speed;

export default timeSystemSlice.reducer;
