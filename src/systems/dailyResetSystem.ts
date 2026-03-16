import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../state/store';
import { selectCurrentTime } from '../state/slices/timeSystemSlice';

// Types
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

// Async thunk to check and trigger daily reset
export const checkAndTriggerDailyReset = createAsyncThunk(
  'dailyReset/checkAndTrigger',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const currentTime = selectCurrentTime(state);
    
    // Convert milliseconds to day number (UTC days)
    const currentDay = Math.floor(currentTime / 86400000);
    
    return { currentDay };
  }
);

// Slice
const dailyResetSlice = createSlice({
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
      const { currentDay } = action.payload;
      
      // Only trigger if day has changed
      if (state.lastProcessedDay !== null && state.lastProcessedDay < currentDay) {
        // Trigger end of previous day callbacks
        state.onDayEndCallbacks.forEach(callback => callback());
        
        // Trigger start of new day callbacks
        state.onDayStartCallbacks.forEach(callback => callback());
        
        // Update last processed day
        state.lastProcessedDay = currentDay;
      } else if (state.lastProcessedDay === null) {
        // First time initialization - set initial day but don't trigger callbacks yet
        state.lastProcessedDay = currentDay;
      }
    });
  },
});

// Export actions and selector
export const {
  registerOnDayStartCallback,
  registerOnDayEndCallback,
  triggerDayStart,
  triggerDayEnd,
} = dailyResetSlice.actions;

// Selectors
export const selectDailyResetState = (state: RootState) => state.dailyReset;

export default dailyResetSlice.reducer;
