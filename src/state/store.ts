import { configureStore } from '@reduxjs/toolkit';
import timeSystemReducer from './slices/timeSystemSlice';
import projectTimelineReducer from './slices/projectTimelineSlice';
import farmSceneReducer from './slices/farmSceneSlice';
import cropReducer from './slices/cropSlice';

export const store = configureStore({
  reducer: {
    timeSystem: timeSystemReducer,
    projectTimeline: projectTimelineReducer,
    farmScene: farmSceneReducer,
    crop: cropReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
