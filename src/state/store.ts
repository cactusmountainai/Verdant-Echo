import { configureStore } from '@reduxjs/toolkit';
import timeSystemReducer from './slices/timeSystemSlice';
import projectTimelineReducer from './slices/projectTimelineSlice';
import farmSceneReducer from './slices/farmSceneSlice';

export const store = configureStore({
  reducer: {
    timeSystem: timeSystemReducer,
    projectTimeline: projectTimelineReducer,
    farmScene: farmSceneReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
