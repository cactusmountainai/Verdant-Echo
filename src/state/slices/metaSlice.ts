import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MetaState {
  score: number;
  level: number;
  isPaused: boolean;
}

const initialState: MetaState = {
  score: 0,
  level: 1,
  isPaused: false,
};

export const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    incrementScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    levelUp: (state) => {
      state.level += 1;
    },
    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    },
  },
});

export const { incrementScore, levelUp, togglePause } = metaSlice.actions;
export default metaSlice.reducer;
