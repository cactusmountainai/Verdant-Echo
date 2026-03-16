import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DAY_START_AT, DAY_END_AT } from '../timeSystem';

interface TimeState {
  currentTime: {
    hours: number;
    minutes: number;
    day: number;
  };
  isNight: boolean;
}

const initialState: TimeState = {
  currentTime: {
    hours: 6,
    minutes: 0,
    day: 1,
  },
  isNight: false,
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    updateTime(state, action: PayloadAction<{ hours: number; minutes: number }>) {
      const { hours, minutes } = action.payload;
      state.currentTime.hours = hours;
      state.currentTime.minutes = minutes;
      state.isNight = hours >= DAY_END_AT || hours < DAY_START_AT;
    },
    resetDay(state) {
      state.currentTime.day += 1;
      state.currentTime.hours = DAY_START_AT;
      state.currentTime.minutes = 0;
      state.isNight = false;
    },
    passOut(state) {
      state.currentTime.hours = 0;
      state.currentTime.minutes = 0;
      state.isNight = true;
    },
  },
});

export const { updateTime, resetDay, passOut } = timeSlice.actions;

// Export action creators with kebab-case names as required
export const update_time = updateTime;
export const reset_day = resetDay;
export const pass_out = passOut;

export default timeSlice.reducer;
