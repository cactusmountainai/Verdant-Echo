import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import worldReducer from './slices/worldSlice';
import metaReducer from './slices/metaSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    world: worldReducer,
    meta: metaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Phaser objects (e.g., sprites) are non-serializable
    }),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
