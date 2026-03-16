import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';

interface TimeState {
  currentTime: Date;
  isPaused: boolean;
}

const initialState: TimeState = {
  currentTime: new Date(),
  isPaused: false,
};

const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    updateTime(state, action: PayloadAction<Date>) {
      state.currentTime = action.payload;
    },
    togglePause(state) {
      state.isPaused = !state.isPaused;
    },
  },
});

// Thunk to handle periodic time updates (replaces direct dispatch from component or other slice)
export const startTimer = (): AppThunk => (dispatch, getState) => {
  let intervalId: number | null = null;

  const tick = () => {
    if (!getState().timeSystem.isPaused) {
      dispatch(updateTime(new Date()));
    }
  };

  // Start interval
  intervalId = window.setInterval(tick, 1000);
  
  // Return cleanup function for effect hooks
  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  };
};

export const { updateTime, togglePause } = timeSystemSlice.actions;
export default timeSystemSlice.reducer;
