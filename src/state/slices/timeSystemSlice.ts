import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface TimeSystemState {
  day: number;
  hour: number; // 0-23
  minutes: number; // 0-59
  isNight: boolean;
  lastUpdate: number; // timestamp of last update
}

const initialState: TimeSystemState = {
  day: 1,
  hour: 6, // Start at 6 AM
  minutes: 0,
  isNight: false,
  lastUpdate: Date.now(),
};

export const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    update: (state) => {
      const now = Date.now();
      const elapsedMinutes = Math.floor((now - state.lastUpdate) / 60000); // ms to minutes
      
      if (elapsedMinutes > 0) {
        state.minutes += elapsedMinutes;
        
        while (state.minutes >= 60) {
          state.minutes -= 60;
          state.hour++;
          
          if (state.hour >= 24) {
            state.hour = 0;
            state.day++;
            
            // Night cycle: 8 PM to 6 AM
            state.isNight = state.hour < 6 || state.hour >= 20;
          }
        }
        
        // Update night status based on hour
        state.isNight = state.hour < 6 || state.hour >= 20;
      }
      
      state.lastUpdate = now;
    },
    
    setDay: (state, action: PayloadAction<number>) => {
      state.day = action.payload;
    },
    
    setTime: (state, action: PayloadAction<{ hour: number; minutes: number }>) => {
      const { hour, minutes } = action.payload;
      if (hour >= 0 && hour < 24 && minutes >= 0 && minutes < 60) {
        state.hour = hour;
        state.minutes = minutes;
        state.isNight = hour < 6 || hour >= 20;
      }
    },
    
    reset: () => initialState,
  },
});

export const { update, setDay, setTime, reset } = timeSystemSlice.actions;

export default timeSystemSlice.reducer;

// Selectors
export const selectTime = (state: RootState) => ({
  day: state.timeSystem.day,
  hour: state.timeSystem.hour,
  minutes: state.timeSystem.minutes,
  isNight: state.timeSystem.isNight,
});
