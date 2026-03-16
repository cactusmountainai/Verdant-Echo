import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface CropState {
  status: 'till' | 'plant' | 'water' | 'sleep' | 'grow' | 'harvest' | 'ship' | 'earn';
  plantedAt: number | null; // timestamp when plant was done
  wateredAt: number | null; // timestamp when watered
  grownAt: number | null; // timestamp when growth completed
  harvestedAt: number | null; // timestamp when harvested
  shippedAt: number | null; // timestamp when shipped
  earnedAt: number | null; // timestamp when earnings processed
  cropType: string | null;
  progress: number; // 0-100 for growing phase
  count: number;
}

const initialState: CropState = {
  status: 'till',
  plantedAt: null,
  wateredAt: null,
  grownAt: null,
  harvestedAt: null,
  shippedAt: null,
  earnedAt: null,
  cropType: null,
  progress: 0,
  count: 0,
};

export const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    till: (state) => {
      state.status = 'till';
      state.plantedAt = null;
      state.wateredAt = null;
      state.grownAt = null;
      state.harvestedAt = null;
      state.shippedAt = null;
      state.earnedAt = null;
      state.cropType = null;
      state.progress = 0;
    },
    
    plant: (state, action: PayloadAction<string>) => {
      if (state.status === 'till') {
        state.status = 'plant';
        state.plantedAt = Date.now();
        state.cropType = action.payload;
        state.progress = 0;
      }
    },
    
    water: (state) => {
      if (state.status === 'plant' || state.status === 'sleep') {
        state.status = 'water';
        state.wateredAt = Date.now();
      }
    },
    
    sleep: (state) => {
      if (state.status === 'water') {
        state.status = 'sleep';
      }
    },
    
    grow: (state, action: PayloadAction<number>) => {
      if (state.status === 'sleep' || state.status === 'grow') {
        state.status = 'grow';
        state.progress = Math.min(100, state.progress + (action.payload || 10));
        
        // If growth is complete
        if (state.progress >= 100) {
          state.grownAt = Date.now();
          state.status = 'harvest';
        }
      }
    },
    
    harvest: (state) => {
      if (state.status === 'grow' || state.status === 'harvest') {
        state.status = 'harvest';
        state.harvestedAt = Date.now();
        state.progress = 0;
      }
    },
    
    ship: (state) => {
      if (state.status === 'harvest') {
        state.status = 'ship';
        state.shippedAt = Date.now();
      }
    },
    
    earn: (state) => {
      if (state.status === 'ship') {
        state.status = 'earn';
        state.earnedAt = Date.now();
        // Reset to till after earning
        state.status = 'till';
        state.count += 1;
      }
    },
    
    reset: () => initialState,
  },
});

export const { 
  till, plant, water, sleep, grow, harvest, ship, earn, reset 
} = cropSlice.actions;

export default cropSlice.reducer;

// Selectors
export const selectCropStatus = (state: RootState) => state.crop.status;
export const selectCropType = (state: RootState) => state.crop.cropType;
export const selectCropCount = (state: RootState) => state.crop.count;
export const selectCropProgress = (state: RootState) => state.crop.progress;
