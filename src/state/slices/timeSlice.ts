import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeState } from '../types';

const DAY_START_AT = 6;
const DAY_END_AT = 26;

const calculateIsNight = (hours: number): boolean => {
  return hours >= DAY_END_AT || hours < DAY_START_AT;
};

const initialState: TimeState = {
  currentTime: {
    hours: DAY_START_AT,
    minutes: 0,
    day: 1,
  },
  isNight: calculateIsNight(DAY_START_AT),
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
      state.currentTime.hours = DAY_START_AT;
      state.currentTime.minutes = 0;
      state.isNight = calculateIsNight(DAY_START_AT);
      // Trigger game save on pass out
      window.farmScene?.saveGame();
    },
  },
});

export const { updateTime, resetDay, passOut } = timeSlice.actions;
export const update_time = timeSlice.actions.updateTime;
export const reset_day = timeSlice.actions.resetDay;
export const pass_out = timeSlice.actions.passOut;

export default timeSlice.reducer;
