import { createSlice } from '@reduxjs/toolkit';
import { TimeSystemState } from '../../systems/timeSystem';

const initialState: TimeSystemState = {
  currentTime: 0,
  isPaused: false,
  speedMultiplier: 1,
  day: 1,
  season: 'spring',
};

export const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    updateTime: (state, action) => {
      state.currentTime += action.payload;
    },
    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    },
    setSpeedMultiplier: (state, action) => {
      state.speedMultiplier = action.payload;
    },
    advanceDay: (state) => {
      state.day += 1;
      // Logic for season changes could go here
    },
  },
});

export const { updateTime, togglePause, setSpeedMultiplier, advanceDay } = timeSystemSlice.actions;
export default timeSystemSlice.reducer;
