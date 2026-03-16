import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import slice reducers
import timeSystem from './slices/timeSystemSlice';
import farmScene from './slices/farmSceneSlice';
import projectTimeline from './slices/projectTimelineSlice';
import storage from './slices/storageSlice';
import meeting from './slices/meetingSlice';
import dataIngestion from './slices/dataIngestionSlice';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  timeSystem,
  farmScene,
  projectTimeline,
  storage,
  meeting,
  dataIngestion,
});

// Create the store with the combined reducer
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['timeSystem/adjustTime', 'farmScene/updateScene'],
      },
    }),
});

// Define RootState type based on the actual state shape of the store
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type for dispatching actions
export type AppDispatch = typeof store.dispatch;
