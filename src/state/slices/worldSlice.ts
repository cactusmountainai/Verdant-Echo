import { createSlice } from '@reduxjs/toolkit';

export interface WorldState {
  timeOfDay: 'day' | 'night';
  // ... other properties
}

const initialState: WorldState = {
  timeOfDay: 'day', // Fixed from number to string literal type
};

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    // ... reducers
  }
});
