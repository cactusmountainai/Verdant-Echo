import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeSystemState } from '../../systems/timeSystem';

const initialState: TimeSystemState = {
  currentTime: 0,
  speed: 1,
  isPaused: false,
  day: 1,
  hour: 6,
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
    },
    advanceDay: (state) => {
      state.day += 1;
      state.hour = 6; // Reset to morning
    },
  },
});

export const { updateTime, togglePause, setSpeed, advanceDay } = timeSystemSlice.actions;
export default timeSystemSlice.reducer;
