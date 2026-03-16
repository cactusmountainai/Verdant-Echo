import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import appSlice from './slices/appSlice';
import timeSlice from './slices/timeSlice';
import moneySlice from './slices/moneySlice';
import energySlice from './slices/energySlice';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['time', 'money', 'energy'],
};

const persistedTimeReducer = persistReducer(persistConfig, timeSlice);
const persistedMoneyReducer = persistReducer(persistConfig, moneySlice);
const persistedEnergyReducer = persistReducer(persistConfig, energySlice);

export const store = configureStore({
  reducer: {
    app: appSlice,
    time: persistedTimeReducer,
    money: persistedMoneyReducer,
    energy: persistedEnergyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
