import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import slices (no direct store import in slices!)
import authSlice from './slices/auth.slice';
import timeSystemSlice from './slices/timeSystem.slice';
import farmSceneSlice from './slices/farmScene.slice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    timeSystem: timeSystemSlice,
    farmScene: farmSceneSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
