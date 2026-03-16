// This is now just a custom hook — no direct import from store.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './state/store';
import { calculateSync, clearResult } from './state/slices/calculatorSlice';

export const useCalculator = () => {
  const dispatch = useDispatch();
  const { result, loading, error } = useSelector((state: RootState) => state.calculator);

  const calculate = (a: number, b: number) => {
    // Dispatch synchronous action
    dispatch(calculateSync({ a, b }));
  };

  const calculateAsync = async (a: number, b: number) => {
    // Dispatch async thunk
    await dispatch(calculateAsync({ a, b })).unwrap();
  };

  const clear = () => {
    dispatch(clearResult());
  };

  return { result, loading, error, calculate, calculateAsync, clear };
};
