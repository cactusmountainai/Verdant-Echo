import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type CropStage = 
  | 'till' 
  | 'plant' 
  | 'water' 
  | 'sleep' 
  | 'grow' 
  | 'harvest' 
  | 'ship' 
  | 'earn';

export interface CropState {
  stage: CropStage;
  progress: number; // 0-100, used for grow phase
  lastUpdated: number; // timestamp of last state update
  coins: number;
  isDayComplete: boolean;
}

const initialState: CropState = {
  stage: 'till',
  progress: 0,
  lastUpdated: Date.now(),
  coins: 0,
  isDayComplete: false,
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    till: (state) => {
      state.stage = 'till';
      state.progress = 0;
      state.isDayComplete = false;
    },
    plant: (state) => {
      if (state.stage === 'till') {
        state.stage = 'plant';
        state.progress = 0;
      }
    },
    water: (state) => {
      if (state.stage === 'plant') {
        state.stage = 'water';
        state.progress = 0;
      }
    },
    sleep: (state) => {
      if (state.stage === 'water') {
        state.stage = 'sleep';
        state.progress = 0;
      }
    },
    grow: (state, action: PayloadAction<number>) => {
      if (state.stage === 'sleep' || state.stage === 'grow') {
        state.stage = 'grow';
        state.progress = Math.min(100, state.progress + action.payload);
      }
    },
    harvest: (state) => {
      if (state.stage === 'grow' && state.progress >= 100) {
        state.stage = 'harvest';
        state.progress = 0;
      }
    },
    ship: (state) => {
      if (state.stage === 'harvest') {
        state.stage = 'ship';
        state.coins += 10; // fixed reward per crop
        state.isDayComplete = true;
      }
    },
    earn: (state) => {
      if (state.stage === 'ship') {
        state.stage = 'earn';
        state.progress = 0;
      }
    },
    resetCycle: (state) => {
      state.stage = 'till';
      state.progress = 0;
      state.isDayComplete = false;
    },
    updateLastUpdated: (state, action: PayloadAction<number>) => {
      state.lastUpdated = action.payload;
    },
  },
});

export const {
  till,
  plant,
  water,
  sleep,
  grow,
  harvest,
  ship,
  earn,
  resetCycle,
  updateLastUpdated,
} = cropSlice.actions;

export default cropSlice.reducer;

// Selectors
export const selectCropStage = (state: RootState) => state.crop.stage;
export const selectCropProgress = (state: RootState) => state.crop.progress;
export const selectCoins = (state: RootState) => state.crop.coins;
export const selectIsDayComplete = (state: RootState) => state.crop.isDayComplete;
