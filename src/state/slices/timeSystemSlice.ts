import { createSlice } from '@reduxjs/toolkit';

interface TimeSystemState {
  time: number;
}

const initialState: TimeSystemState = {
  time: 0,
};

const timeSystemSlice = createSlice({
  name: 'timeSystem',
  initialState,
  reducers: {
    updateTime: (state, action) => {
      state.time = action.payload;
    },
  },
});

export const { updateTime } = timeSystemSlice.actions;
export default timeSystemSlice.reducer;
