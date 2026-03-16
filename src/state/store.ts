import { configureStore } from '@reduxjs/toolkit';
import farmReducer from './slices/farmSlice';

export const store = configureStore({
  reducer: {
    farm: farmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
