import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeState } from '../types';

// Helper function to calculate if current time is night
const calculateIsNight = (hours: number): boolean => {
  return hours >= 26 || hours < 6;
};

// Initial state based on requirements
const initialState: TimeState = {
  currentTime: {
    hours: 6,
    minutes: 0,
    day: 1,
  },
  isNight: calculateIsNight(6),
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    updateTime: (state, action: PayloadAction<{ hours: number; minutes: number }>) => {
      state.currentTime.hours = action.payload.hours;
      state.currentTime.minutes = action.payload.minutes;
      state.isNight = calculateIsNight(action.payload.hours);
    },
    resetDay: (state) => {
      state.currentTime.day += 1;
      state.currentTime.hours = 6;
      state.currentTime.minutes = 0;
      state.isNight = calculateIsNight(6);
    },
    passOut: (state) => {
      // Trigger auto-save when passing out
      window.farmScene?.saveGame();
      // Reset to 6:00 of next day
      state.currentTime.day += 1;
      state.currentTime.hours = 6;
      state.currentTime.minutes = 0;
      state.isNight = calculateIsNight(6);
    },
  },
});

export const { updateTime, resetDay, passOut } = timeSlice.actions;

// Export named functions as required: update_time, reset_day, pass_out
export const update_time = updateTime;
export const reset_day = resetDay;
export const pass_out = passOut;

export default timeSlice.reducer;
