import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Selectors for farm state
export const selectFarmState = (state: RootState) => state.farm;

export const selectCrops = createSelector(
  [selectFarmState],
  (farm): string[] => farm.crops // Explicit return type
);

export const selectDay = createSelector(
  [selectFarmState],
  (farm): number => farm.day // Explicit return type
);

export const selectTotalDays = createSelector(
  [selectFarmState],
  (farm): number => farm.totalDays // Explicit return type
);

export const selectWeather = createSelector(
  [selectFarmState],
  (farm): string => farm.weather // Explicit return type
);
