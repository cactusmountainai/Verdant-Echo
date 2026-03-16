import { configureStore } from '@reduxjs/toolkit';
import timeSystemReducer from './slices/timeSystemSlice';
import farmSceneReducer from './slices/farmSceneSlice';
import projectTimelineReducer from './slices/projectTimelineSlice';
import storageReducer from './slices/storageSlice';

export const store = configureStore({
  reducer: {
    timeSystem: timeSystemReducer,
    farmScene: farmSceneReducer,
    projectTimeline: projectTimelineReducer,
    storage: storageReducer,
  },
});

// Define RootState type based on the actual state structure
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;
