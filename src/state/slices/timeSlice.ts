import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeState } from '../types';

const initialState: TimeState = {
  currentTime: {
    hours: 6,
    minutes: 0,
    day: 1
  },
  isNight: false
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    updateTime(state, action: PayloadAction<{ hours: number; minutes: number }>) {
      const { hours, minutes } = action.payload;
      state.currentTime.hours = hours;
      state.currentTime.minutes = minutes;
      // Update isNight based on hours (night is >=26 or <6)
      state.isNight = hours >= 26 || hours < 6;
    },
    resetDay(state) {
      // Reset to 6:00 of next day
      state.currentTime.hours = 6;
      state.currentTime.minutes = 0;
      state.currentTime.day += 1;
      state.isNight = false; // 6:00 is morning, not night
    },
    passOut(state) {
      // Sleep mechanic - reset to 6:00 of same day
      state.currentTime.hours = 6;
      state.currentTime.minutes = 0;
      state.isNight = false;
      // Save game via Dexie
      window.farmScene?.saveGame();
    }
  }
});

// Export action creators with snake_case names as required
export const update_time = timeSlice.actions.updateTime;
export const reset_day = timeSlice.actions.resetDay;
export const pass_out = timeSlice.actions.passOut;

export default timeSlice.reducer;
