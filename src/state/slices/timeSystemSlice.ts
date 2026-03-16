import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const DAY_START_AT = 6;
export const DAY_END_AT = 26;

interface TimeSystemState {
  day: number;
  hour: number;
  minutes: number;
  isNight: boolean;
  lastUpdate: number;
}

const initialState: TimeSystemState = {
  day: 1,
  hour: 6,
  minutes: 0,
  isNight: false,
  lastUpdate: Date.now(),
};

const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    update(state, action: PayloadAction<{ hours: number; minutes: number; day: number }>) {
      const { hours, minutes, day } = action.payload;
      state.hour = hours;
      state.minutes = minutes;
      state.day = day;
      state.isNight = hours < DAY_START_AT || hours >= 20;
      state.lastUpdate = Date.now();
    },
  },
});

export const { update } = timeSystemSlice.actions;
export default timeSystemSlice.reducer;
