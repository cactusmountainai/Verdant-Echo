import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeState } from '../types';

// Constants for time system
const DAY_START_AT = 6; // 6 AM
const DAY_END_AT = 26;  // 2 AM next day (26 hours)

// Initial state
const initialState: TimeState = {
  currentTime: {
    hours: DAY_START_AT,
    minutes: 0,
    day: 1,
  },
  isNight: false, // Will be calculated based on hours
};

// Calculate if it's night based on current hours
const calculateIsNight = (hours: number): boolean => {
  return hours >= DAY_END_AT || hours < DAY_START_AT;
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    updateTime(state, action: PayloadAction<{ hours: number; minutes: number }>) {
      const { hours, minutes } = action.payload;
      state.currentTime.hours = hours;
      state.currentTime.minutes = minutes;
      state.isNight = calculateIsNight(hours);
    },
    resetDay(state) {
      state.currentTime.day += 1;
      state.currentTime.hours = DAY_START_AT;
      state.currentTime.minutes = 0;
      state.isNight = calculateIsNight(DAY_START_AT);
    },
    passOut(state) {
      state.currentTime.hours = 0;
      state.currentTime.minutes = 0;
      state.currentTime.day += 1;
      state.isNight = true; // Always night when passing out
    },
  },
});

export const { updateTime, resetDay, passOut } = timeSlice.actions;

// Export kebab-case action creators as required
export const update_time = updateTime;
export const reset_day = resetDay;
export const pass_out = passOut;

export default timeSlice.reducer;
