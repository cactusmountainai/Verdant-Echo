import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import worldReducer from './slices/worldSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    world: worldReducer,
  },
});
