import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define types for crop state
export interface Crop {
  id: string;
  stage: 'till' | 'plant' | 'water' | 'sleep' | 'grow' | 'harvest' | 'ship' | 'earn';
  plantedAt: number | null; // timestamp when planting occurred
  wateredAt: number | null; // timestamp when watering occurred
  grownAt: number | null;   // timestamp when growth completed
  harvestedAt: number | null; // timestamp when harvesting occurred
  shippedAt: number | null; // timestamp when shipping occurred
  earnedAt: number | null;  // timestamp when earning occurred
  daysToGrow: number;       // how many days it takes to grow (configurable)
  isReadyForHarvest: boolean;
}

export interface CropState {
  crops: Record<string, Crop>;
  currentDay: number;
  lastSavedDay: number;
}

const initialState: CropState = {
  crops: {},
  currentDay: 1,
  lastSavedDay: 1,
};

// Helper function to get timestamp for now
const getCurrentTimestamp = (): number => Date.now();

// Calculate if a crop should progress based on time elapsed and day boundaries
const shouldProgressStage = (crop: Crop, currentDay: number): Crop => {
  const now = getCurrentTimestamp();
  
  // If we've moved to a new day since last saved, process progression
  if (currentDay > (crop.plantedAt ? Math.floor((now - crop.plantedAt) / (24 * 60 * 60 * 1000)) + 1 : 0)) {
    // This is a simplified model - we'll assume day boundaries trigger progression
    // In reality, this would check time elapsed between stages
    
    // Progress based on current stage and days passed
    switch (crop.stage) {
      case 'till':
        if (currentDay > crop.plantedAt ? Math.floor((now - crop.plantedAt) / (24 * 60 * 60 * 1000)) + 1 : 0) {
          return { ...crop, stage: 'plant' };
        }
        break;
        
      case 'plant':
        // After planting, we wait for water
        if (currentDay > crop.plantedAt ? Math.floor((now - crop.plantedAt) / (24 * 60 * 60 * 1000)) + 1 : 0) {
          return { ...crop, stage: 'water' };
        }
        break;
        
      case 'water':
        // After watering, we enter sleep phase
        if (currentDay > crop.wateredAt ? Math.floor((now - crop.wateredAt) / (24 * 60 * 60 * 1000)) + 1 : 0) {
          return { ...crop, stage: 'sleep' };
        }
        break;
        
      case 'sleep':
        // After sleep, growth begins
        if (currentDay > crop.grownAt ? Math.floor((now - crop.grownAt) / (24 * 60 * 60 * 1000)) + 1 : 0) {
          return { ...crop, stage: 'grow' };
        }
        break;
        
      case 'grow':
        // After growing for configured days, harvest becomes ready
        if (crop.daysToGrow && crop.plantedAt) {
          const daysSincePlanting = Math.floor((now - crop.plantedAt) / (24 * 60 * 60 * 1000));
          if (daysSincePlanting >= crop.daysToGrow) {
            return { 
              ...crop, 
              stage: 'harvest', 
              isReadyForHarvest: true,
              grownAt: now
            };
          }
        }
        break;
        
      case 'harvest':
        // After harvest, ship immediately
        if (currentDay > crop.harvestedAt ? Math.floor((now - crop.harvestedAt) / (24 * 60 * 60 * 1000)) + 1 : 0) {
          return { ...crop, stage: 'ship' };
        }
        break;
        
      case 'ship':
        // After shipping, earn immediately
        if (currentDay > crop.shippedAt ? Math.floor((now - crop.shippedAt) / (24 * 60 * 60 * 1000)) + 1 : 0) {
          return { ...crop, stage: 'earn' };
        }
        break;
        
      case 'earn':
        // Earned state is final
        return crop;
    }
  }
  
  return crop;
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    tillLand: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.crops[id] = {
        id,
        stage: 'till',
        plantedAt: null,
        wateredAt: null,
        grownAt: null,
        harvestedAt: null,
        shippedAt: null,
        earnedAt: null,
        daysToGrow: 3, // default days to grow
        isReadyForHarvest: false,
      };
    },
    
    plantSeed: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.crops[id] && state.crops[id].stage === 'till') {
        state.crops[id] = {
          ...state.crops[id],
          stage: 'plant',
          plantedAt: getCurrentTimestamp(),
        };
      }
    },
    
    waterCrop: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.crops[id] && state.crops[id].stage === 'plant') {
        state.crops[id] = {
          ...state.crops[id],
          stage: 'water',
          wateredAt: getCurrentTimestamp(),
        };
      }
    },
    
    sleepCycle: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.crops[id] && state.crops[id].stage === 'water') {
        state.crops[id] = {
          ...state.crops[id],
          stage: 'sleep',
        };
      }
    },
    
    // This will be called when day advances to trigger growth
    advanceDay: (state, action: PayloadAction<{ day: number }>) => {
      const { day } = action.payload;
      state.currentDay = day;
      
      // Process all crops for progression based on new day
      Object.keys(state.crops).forEach(key => {
        state.crops[key] = shouldProgressStage(state.crops[key], day);
        
        // If crop is ready for harvest, mark it
        if (state.crops[key].stage === 'grow') {
          const now = getCurrentTimestamp();
          if (state.crops[key].plantedAt) {
            const daysSincePlanting = Math.floor((now - state.crops[key].plantedAt) / (24 * 60 * 60 * 1000));
            if (daysSincePlanting >= state.crops[key].daysToGrow) {
              state.crops[key] = {
                ...state.crops[key],
                stage: 'harvest',
                isReadyForHarvest: true,
                grownAt: now
              };
            }
          }
        }
      });
    },
    
    harvestCrop: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.crops[id] && state.crops[id].stage === 'harvest' && state.crops[id].isReadyForHarvest) {
        state.crops[id] = {
          ...state.crops[id],
          stage: 'ship',
          harvestedAt: getCurrentTimestamp(),
          isReadyForHarvest: false,
        };
      }
    },
    
    shipCrop: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.crops[id] && state.crops[id].stage === 'ship') {
        state.crops[id] = {
          ...state.crops[id],
          stage: 'earn',
          shippedAt: getCurrentTimestamp(),
        };
      }
    },
    
    earnCrop: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.crops[id] && state.crops[id].stage === 'earn') {
        state.crops[id] = {
          ...state.crops[id],
          earnedAt: getCurrentTimestamp(),
        };
      }
    },
    
    resetCrop: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      delete state.crops[id];
    },
    
    // Load saved state from persistent storage
    loadSavedState: (state, action: PayloadAction<CropState>) => {
      return { ...action.payload };
    },
  },
});

export const { 
  tillLand, 
  plantSeed, 
  waterCrop, 
  sleepCycle, 
  advanceDay,
  harvestCrop, 
  shipCrop, 
  earnCrop, 
  resetCrop,
  loadSavedState
} = cropSlice.actions;

// Selectors
export const selectCrops = (state: RootState) => state.crop.crops;
export const selectCurrentDay = (state: RootState) => state.crop.currentDay;
export const selectIsCropReadyForHarvest = (state: RootState, id: string) => {
  return state.crop.crops[id]?.isReadyForHarvest || false;
};
export const selectCropStage = (state: RootState, id: string) => {
  return state.crop.crops[id]?.stage || null;
};

export default cropSlice.reducer;
