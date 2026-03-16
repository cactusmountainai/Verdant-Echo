import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState as ReduxRootState } from './store'; // Import RootState from actual store setup

// Export inferred RootState from the real Redux store configuration
export type RootState = ReduxRootState;

// Typed hooks for consistent usage across app
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch();
