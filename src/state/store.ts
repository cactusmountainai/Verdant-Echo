import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import timeSystemReducer from './slices/timeSystemSlice';
import moneyReducer from './slices/moneySlice'; // Assuming this exists based on context
import energyReducer from './slices/energySlice'; // Assuming this exists based on context

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['timeSystem', 'money', 'energy'], // Persist these slices
};

const rootReducer = combineReducers({
  timeSystem: timeSystemReducer,
  money: moneyReducer,
  energy: energyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
