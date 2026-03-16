import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import timeSystemReducer from './slices/timeSystemSlice';
import projectTimelineReducer from './slices/projectTimelineSlice';
import farmSceneReducer from './slices/farmSceneSlice';
import cropReducer from './slices/cropSlice';
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['crop', 'timeSystem'], // Persist both crop and time system states
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  timeSystem: timeSystemReducer,
  projectTimeline: projectTimelineReducer,
  farmScene: farmSceneReducer,
  crop: cropReducer,
}));

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
