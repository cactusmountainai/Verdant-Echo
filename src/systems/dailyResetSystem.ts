import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../state/store';
import { selectCurrentTime } from '../state/slices/timeSystemSlice';

// Define callback types
export type DayCallback = () => void;

// State interface for daily reset system
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

// Async thunk to check for day changes and trigger callbacks
export const checkAndTriggerDailyReset = createAsyncThunk(
  'dailyReset/checkAndTrigger',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const currentTime = selectCurrentTime(state);
    
    // Convert milliseconds to UTC days (86400000 ms in a day)
    const currentDay = Math.floor(currentTime / 86400000);
    
    return { currentDay };
  }
);

// Create slice
const dailyResetSlice = createSlice({
  name: 'dailyReset',
  initialState,
  reducers: {
    // Register onDayStart callback
    registerOnDayStartCallback: (state, action: PayloadAction<DayCallback>) => {
      if (!state.onDayStartCallbacks.includes(action.payload)) {
        state.onDayStartCallbacks.push(action.payload);
      }
    },
    // Register onDayEnd callback
    registerOnDayEndCallback: (state, action: PayloadAction<DayCallback>) => {
      if (!state.onDayEndCallbacks.includes(action.payload)) {
        state.onDayEndCallbacks.push(action.payload);
      }
    },
    // Clear all callbacks (for testing or reset)
    clearAllCallbacks: (state) => {
      state.onDayStartCallbacks = [];
      state.onDayEndCallbacks = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAndTriggerDailyReset.fulfilled, (state, action) => {
      const { currentDay } = action.payload;
      
      // Handle first initialization
      if (state.lastProcessedDay === null) {
        state.lastProcessedDay = currentDay;
        return;
      }
      
      // Check if day has changed
      if (currentDay > state.lastProcessedDay) {
        // Day has advanced - trigger onDayEnd for previous day
        state.onDayEndCallbacks.forEach(callback => callback());
        
        // Trigger onDayStart for new day
        state.onDayStartCallbacks.forEach(callback => callback());
        
        // Update last processed day
        state.lastProcessedDay = currentDay;
      }
    });
  },
});

// Export actions and selector
export const { 
  registerOnDayStartCallback, 
  registerOnDayEndCallback, 
  clearAllCallbacks 
} = dailyResetSlice.actions;

// Selectors
export const selectDailyResetState = (state: RootState) => state.dailyReset;

// Reducer
export default dailyResetSlice.reducer;
