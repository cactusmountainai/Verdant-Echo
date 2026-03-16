import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimeSystemState {
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
  lastUpdate: Date.now()
};

export const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<{ hours: number; minutes: number; day?: number }>) => {
      state.hour = action.payload.hours;
      state.minutes = action.payload.minutes;
      if (action.payload.day !== undefined) {
        state.day = action.payload.day;
      }
      state.lastUpdate = Date.now();
      
      // Update isNight based on hour (night from 20:00 to 6:00)
      state.isNight = action.payload.hours >= 20 || action.payload.hours < dayStartAt;
    },
    setDay: (state, action: PayloadAction<number>) => {
      state.day = action.payload;
      state.lastUpdate = Date.now();
    },
    setTime: (state, action: PayloadAction<{ hour: number; minutes: number }>) => {
      state.hour = action.payload.hour;
      state.minutes = action.payload.minutes;
      state.lastUpdate = Date.now();
      
      // Update isNight based on hour
      state.isNight = action.payload.hour >= 20 || action.payload.hour < dayStartAt;
    },
    reset: () => initialState,
  },
});

export const { update, setDay, setTime, reset } = timeSystemSlice.actions;

export default timeSystemSlice.reducer;
