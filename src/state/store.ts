import { configureStore } from '@reduxjs/toolkit';
import timeSystemReducer from './slices/timeSystemSlice';
import farmSceneReducer from './slices/farmSceneSlice';
import projectTimelineReducer from './slices/projectTimelineSlice';

export const store = configureStore({
  reducer: {
    timeSystem: timeSystemReducer,
    farmScene: farmSceneReducer,
    projectTimeline: projectTimelineReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
