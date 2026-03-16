import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../state/store';
import { timeSystemSelector } from '../state/slices/timeSystem/selectors';

// Types
export type DayCallback = () => void;

interface DailyResetState {
  onDayStartCallbacks: DayCallback[];
  onDayEndCallbacks: DayCallback[];
  lastDay: number | null;
}

// Initial state
const initialState: DailyResetState = {
  onDayStartCallbacks: [],
  onDayEndCallbacks: [],
  lastDay: null,
};

// Slice
export const dailyResetSlice = createSlice({
  name: 'dailyReset',
  initialState,
  reducers: {
    registerOnDayStart: (state, action: PayloadAction<DayCallback>) => {
      if (!state.onDayStartCallbacks.includes(action.payload)) {
        state.onDayStartCallbacks.push(action.payload);
      }
    },
    registerOnDayEnd: (state, action: PayloadAction<DayCallback>) => {
      if (!state.onDayEndCallbacks.includes(action.payload)) {
        state.onDayEndCallbacks.push(action.payload);
      }
    },
    triggerDayStart: (state) => {
      state.onDayStartCallbacks.forEach(callback => callback());
      state.lastDay = new Date().getUTCDate();
    },
    triggerDayEnd: (state) => {
      state.onDayEndCallbacks.forEach(callback => callback());
      state.lastDay = new Date().getUTCDate();
    },
  },
});

// Selectors
export const selectDailyResetState = (state: RootState) => state.dailyReset;

// Thunk to handle day change logic based on timeSystem
export const checkAndTriggerDailyReset = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const currentTime = timeSystemSelector(state);
  const currentDay = new Date(currentTime).getUTCDate();

  if (state.dailyReset.lastDay === null) {
    // First run - initialize
    dispatch(dailyResetSlice.actions.triggerDayStart());
  } else if (currentDay !== state.dailyReset.lastDay) {
    // Day has changed
    const wasBeforeMidnight = state.dailyReset.lastDay > currentDay;
    
    if (wasBeforeMidnight) {
      // Crossed midnight: end previous day, start new day
      dispatch(dailyResetSlice.actions.triggerDayEnd());
      dispatch(dailyResetSlice.actions.triggerDayStart());
    } else {
      // Just a new day within same UTC cycle
      dispatch(dailyResetSlice.actions.triggerDayStart());
    }
  }
};

// Actions and reducer exports
export const {
  registerOnDayStart,
  registerOnDayEnd,
  triggerDayStart,
  triggerDayEnd,
} = dailyResetSlice.actions;

export default dailyResetSlice.reducer;
