import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../state/store';
import { timeSystemSelector } from '../state/timeSystemSlice';

// Define types
export type DayCallback = () => void;

interface DailyResetState {
  onDayStartCallbacks: DayCallback[];
  onDayEndCallbacks: DayCallback[];
  lastProcessedDay: number | null;
}

// Initial state
const initialState: DailyResetState = {
  onDayStartCallbacks: [],
  onDayEndCallbacks: [],
  lastProcessedDay: null,
};

// Thunk to check and trigger daily reset based on time system
export const checkAndTriggerDailyReset = createAsyncThunk(
  'dailyReset/checkAndTrigger',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const currentTime = timeSystemSelector(state).currentTime;
    const currentDay = Math.floor(currentTime / 86400000); // Convert ms to days

    return { currentDay, lastProcessedDay: state.dailyReset.lastProcessedDay };
  }
);

// Slice definition
export const dailyResetSlice = createSlice({
  name: 'dailyReset',
  initialState,
  reducers: {
    registerOnDayStartCallback: (state, action: PayloadAction<DayCallback>) => {
      if (!state.onDayStartCallbacks.includes(action.payload)) {
        state.onDayStartCallbacks.push(action.payload);
      }
    },
    registerOnDayEndCallback: (state, action: PayloadAction<DayCallback>) => {
      if (!state.onDayEndCallbacks.includes(action.payload)) {
        state.onDayEndCallbacks.push(action.payload);
      }
    },
    triggerDayStart: (state) => {
      state.onDayStartCallbacks.forEach(callback => callback());
    },
    triggerDayEnd: (state) => {
      state.onDayEndCallbacks.forEach(callback => callback());
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAndTriggerDailyReset.fulfilled, (state, action) => {
      const { currentDay, lastProcessedDay } = action.payload;
      
      // If this is the first time or day has changed
      if (lastProcessedDay === null || currentDay !== lastProcessedDay) {
        // If we have a previous day, it means we've crossed midnight -> trigger day end then day start
        if (lastProcessedDay !== null) {
          state.onDayEndCallbacks.forEach(callback => callback());
        }
        
        state.onDayStartCallbacks.forEach(callback => callback());
        state.lastProcessedDay = currentDay;
      }
    });
  },
});

// Selectors
export const selectDailyResetState = (state: RootState) => state.dailyReset;

// Actions
export const { 
  registerOnDayStartCallback, 
  registerOnDayEndCallback, 
  triggerDayStart, 
  triggerDayEnd 
} = dailyResetSlice.actions;

// Reducer
export default dailyResetSlice.reducer;
