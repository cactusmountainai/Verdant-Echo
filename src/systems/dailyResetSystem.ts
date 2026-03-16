import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../state/store';

// Define callback types
export type DayStartCallback = () => void;
export type DayEndCallback = () => void;

// State for tracking reset state and callbacks
interface DailyResetState {
  lastDay: number | null;
  onDayStartCallbacks: DayStartCallback[];
  onDayEndCallbacks: DayEndCallback[];
}

const initialState: DailyResetState = {
  lastDay: null,
  onDayStartCallbacks: [],
  onDayEndCallbacks: [],
};

export const dailyResetSlice = createSlice({
  name: 'dailyReset',
  initialState,
  reducers: {
    registerOnDayStart: (state, action: PayloadAction<DayStartCallback>) => {
      state.onDayStartCallbacks.push(action.payload);
    },
    registerOnDayEnd: (state, action: PayloadAction<DayEndCallback>) => {
      state.onDayEndCallbacks.push(action.payload);
    },
    triggerDayStart: (state) => {
      state.onDayStartCallbacks.forEach(callback => callback());
    },
    triggerDayEnd: (state) => {
      state.onDayEndCallbacks.forEach(callback => callback());
    },
  },
});

export const {
  registerOnDayStart,
  registerOnDayEnd,
  triggerDayStart,
  triggerDayEnd,
} = dailyResetSlice.actions;

// Async thunk to handle day progression and reset logic
export const checkAndApplyDailyReset = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const currentDay = state.timeSystem.currentTime.day;
  
  // Prevent multiple triggers in same day
  if (state.dailyReset.lastDay === currentDay) return;

  // Day end logic: trigger before updating day
  if (state.dailyReset.lastDay !== null && currentDay > state.dailyReset.lastDay) {
    dispatch(triggerDayEnd());
  }

  // Day start logic: trigger after detecting day change
  if (currentDay > state.dailyReset.lastDay) {
    dispatch(triggerDayStart());
    dispatch(dailyResetSlice.actions.setLastDay(currentDay));
  }
};

// Additional reducer to track last processed day
dailyResetSlice.reducers.setLastDay = (state, action: PayloadAction<number>) => {
  state.lastDay = action.payload;
};

export default dailyResetSlice.reducer;
