import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types for crop state
interface CropState {
  stage: 'till' | 'plant' | 'water' | 'sleep' | 'grow' | 'harvest' | 'ship' | 'earn';
  lastUpdated: number; // timestamp of last state change
  plantedAt: number | null;
  wateredAt: number | null;
  grownAt: number | null;
  harvestedAt: number | null;
  shippedAt: number | null;
  earnedAt: number | null;
  isCompleted: boolean;
}

// Initial state
const initialState: CropState = {
  stage: 'till',
  lastUpdated: Date.now(),
  plantedAt: null,
  wateredAt: null,
  grownAt: null,
  harvestedAt: null,
  shippedAt: null,
  earnedAt: null,
  isCompleted: false,
};

// Define the crop slice
const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    till: (state) => {
      state.stage = 'till';
      state.lastUpdated = Date.now();
      state.plantedAt = null;
      state.wateredAt = null;
      state.grownAt = null;
      state.harvestedAt = null;
      state.shippedAt = null;
      state.earnedAt = null;
      state.isCompleted = false;
    },
    plant: (state) => {
      if (state.stage === 'till') {
        state.stage = 'plant';
        state.lastUpdated = Date.now();
        state.plantedAt = Date.now();
      }
    },
    water: (state) => {
      if (state.stage === 'plant') {
        state.stage = 'water';
        state.lastUpdated = Date.now();
        state.wateredAt = Date.now();
      }
    },
    sleep: (state) => {
      if (state.stage === 'water') {
        state.stage = 'sleep';
        state.lastUpdated = Date.now();
      }
    },
    grow: (state) => {
      if (state.stage === 'sleep') {
        state.stage = 'grow';
        state.lastUpdated = Date.now();
        state.grownAt = Date.now();
      }
    },
    harvest: (state) => {
      if (state.stage === 'grow') {
        state.stage = 'harvest';
        state.lastUpdated = Date.now();
        state.harvestedAt = Date.now();
      }
    },
    ship: (state) => {
      if (state.stage === 'harvest') {
        state.stage = 'ship';
        state.lastUpdated = Date.now();
        state.shippedAt = Date.now();
      }
    },
    earn: (state) => {
      if (state.stage === 'ship') {
        state.stage = 'earn';
        state.lastUpdated = Date.now();
        state.earnedAt = Date.now();
        state.isCompleted = true;
      }
    },
    resetCrop: () => initialState,
  },
});

// Export actions
export const {
  till,
  plant,
  water,
  sleep,
  grow,
  harvest,
  ship,
  earn,
  resetCrop,
} = cropSlice.actions;

// Selectors
export const selectCropStage = (state: RootState) => state.crop.stage;
export const selectIsCropCompleted = (state: RootState) => state.crop.isCompleted;
export const selectCropProgress = (state: RootState) => {
  const stages = ['till', 'plant', 'water', 'sleep', 'grow', 'harvest', 'ship', 'earn'];
  const currentIndex = stages.indexOf(state.crop.stage);
  return { current: state.crop.stage, index: currentIndex, total: stages.length };
};

// Export reducer
export default cropSlice.reducer;
