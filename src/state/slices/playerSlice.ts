import { createSlice } from '@reduxjs/toolkit';

export interface PlayerState {
  x: number;
  y: number;
  speed: number;
}

const initialState: PlayerState = {
  x: 400,
  y: 300,
  speed: 100
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    movePlayer: (state, action) => {
      state.x += action.payload.dx * state.speed;
      state.y += action.payload.dy * state.speed;
    }
  }
});

export const { movePlayer } = playerSlice.actions;
