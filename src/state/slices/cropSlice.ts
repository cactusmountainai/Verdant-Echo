import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface CropState {
  status: 'till' | 'plant' | 'water' | 'sleep' | 'grow' | 'harvest' | 'ship' | 'earn';
  plantedAt: number | null; // timestamp when plant action was called
  wateredAt: number | null; // timestamp when water action was called
  grownAt: number | null; // timestamp when grow condition was met
  harvestedAt: number | null; // timestamp when harvest action was called
  shippedAt: number | null; // timestamp when ship action was called
  earnings: number;
  isReadyToHarvest: boolean;
  day: number;
}

const initialState: CropState = {
  status: 'till',
  plantedAt: null,
  wateredAt: null,
  grownAt: null,
  harvestedAt: null,
  shippedAt: null,
  earnings: 0,
  isReadyToHarvest: false,
  day: 1,
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
      state.isReadyToHarvest = false;
    },
    
    plant: (state) => {
      if (state.status === 'till') {
        state.status = 'plant';
        state.plantedAt = Date.now();
        state.wateredAt = null;
        state.grownAt = null;
        state.harvestedAt = null;
        state.shippedAt = null;
        state.isReadyToHarvest = false;
      }
    },
    
    water: (state) => {
      if (state.status === 'plant') {
        state.status = 'water';
        state.wateredAt = Date.now();
        state.grownAt = null;
        state.harvestedAt = null;
        state.shippedAt = null;
        state.isReadyToHarvest = false;
      }
    },
    
    sleep: (state) => {
      if (state.status === 'water' || state.status === 'grow') {
        // When sleeping, check if growth period is complete
        const now = Date.now();
        if (state.wateredAt && !state.grownAt) {
          // 8 hours needed after watering to grow (in milliseconds)
          const growthTimeNeeded = 8 * 60 * 60 * 1000;
          if (now - state.wateredAt >= growthTimeNeeded) {
            state.status = 'grow';
            state.grownAt = now;
            state.isReadyToHarvest = true;
          }
        } else if (state.status === 'grow' && !state.harvestedAt) {
          // Already in grow phase, just continue
          state.status = 'grow';
        }
      }
    },
    
    harvest: (state) => {
      if (state.isReadyToHarvest) {
        state.status = 'harvest';
        state.harvestedAt = Date.now();
        state.shippedAt = null;
        state.isReadyToHarvest = false;
      }
    },
    
    ship: (state) => {
      if (state.status === 'harvest') {
        state.status = 'ship';
        state.shippedAt = Date.now();
        // Add earnings
        state.earnings += 10; // Base earning per crop
      }
    },
    
    earn: (state) => {
      if (state.status === 'ship') {
        state.status = 'earn';
        // Reset to till for next cycle after earning
        state.status = 'till';
        state.day += 1;
      }
    },
    
    // Helper action to reset crop when day changes
    resetForNewDay: (state, action: PayloadAction<number>) => {
      const newDay = action.payload;
      
      // If we're moving to a new day and had an unfinished cycle,
      // we need to check if the crop should continue or reset based on time elapsed
      if (state.status === 'plant' && state.plantedAt) {
        // If it's been more than 24 hours since planting, reset to till
        const timeSincePlanting = Date.now() - state.plantedAt;
        if (timeSincePlanting > 24 * 60 * 60 * 1000) {
          state.status = 'till';
          state.plantedAt = null;
          state.wateredAt = null;
          state.grownAt = null;
          state.harvestedAt = null;
          state.shippedAt = null;
          state.isReadyToHarvest = false;
        }
      } else if (state.status === 'water' && state.wateredAt) {
        // If it's been more than 24 hours since watering, reset
        const timeSinceWatering = Date.now() - state.wateredAt;
        if (timeSinceWatering > 24 * 60 * 60 * 1000) {
          state.status = 'till';
          state.plantedAt = null;
          state.wateredAt = null;
          state.grownAt = null;
          state.harvestedAt = null;
          state.shippedAt = null;
          state.isReadyToHarvest = false;
        }
      } else if (state.status === 'grow' && state.grownAt) {
        // If it's been more than 24 hours since growth started, reset
        const timeSinceGrowth = Date.now() - state.grownAt;
        if (timeSinceGrowth > 24 * 60 * 60 * 1000) {
          state.status = 'till';
          state.plantedAt = null;
          state.wateredAt = null;
          state.grownAt = null;
          state.harvestedAt = null;
          state.shippedAt = null;
          state.isReadyToHarvest = false;
        }
      } else if (state.status === 'harvest' && state.harvestedAt) {
        // If it's been more than 24 hours since harvest, reset
        const timeSinceHarvest = Date.now() - state.harvestedAt;
        if (timeSinceHarvest > 24 * 60 * 60 * 1000) {
          state.status = 'till';
          state.plantedAt = null;
          state.wateredAt = null;
          state.grownAt = null;
          state.harvestedAt = null;
          state.shippedAt = null;
          state.isReadyToHarvest = false;
        }
      } else if (state.status === 'ship' && state.shippedAt) {
        // If it's been more than 24 hours since shipping, reset
        const timeSinceShipping = Date.now() - state.shippedAt;
        if (timeSinceShipping > 24 * 60 * 60 * 1000) {
          state.status = 'till';
          state.plantedAt = null;
          state.wateredAt = null;
          state.grownAt = null;
          state.harvestedAt = null;
          state.shippedAt = null;
          state.isReadyToHarvest = false;
        }
      }
      
      // Update day
      state.day = newDay;
    },
    
    // Action to advance the game time (triggered by external time system)
    updateCropStateByTime: (state, action: PayloadAction<number>) => {
      const currentTime = action.payload;
      
      // Check if we've reached a new day based on 24-hour cycle
      // Assuming 1 day = 86400 seconds in game time
      const day = Math.floor(currentTime / 86400) + 1; // +1 to start from day 1
      
      // If we've advanced a day, trigger the resetForNewDay logic
      if (day > state.day) {
        // We've moved to a new day - handle crop state transition
        const timeElapsedSinceLastDay = currentTime % 86400;
        
        // Only update if we're moving forward in days
        if (state.day < day) {
          // Check the current status and see if it's still valid after day change
          if (state.status === 'plant' && state.plantedAt !== null) {
            const timeSincePlanting = currentTime * 1000 - state.plantedAt;
            
            // If we've been in planting for more than a full day without watering,
            // reset to till since the crop would have died
            if (timeSincePlanting > 24 * 60 * 60 * 1000) {
              state.status = 'till';
              state.plantedAt = null;
              state.wateredAt = null;
              state.grownAt = null;
              state.harvestedAt = null;
              state.shippedAt = null;
              state.isReadyToHarvest = false;
            }
          } else if (state.status === 'water' && state.wateredAt !== null) {
            const timeSinceWatering = currentTime * 1000 - state.wateredAt;
            
            // If we've been watering for more than a day without growth, reset
            if (timeSinceWatering > 24 * 60 * 60 * 1000) {
              state.status = 'till';
              state.plantedAt = null;
              state.wateredAt = null;
              state.grownAt = null;
              state.harvestedAt = null;
              state.shippedAt = null;
              state.isReadyToHarvest = false;
            } else if (timeSinceWatering >= 8 * 60 * 60 * 1000) {
              // Growth period complete - move to grow phase
              state.status = 'grow';
              state.grownAt = state.wateredAt + (8 * 60 * 60 * 1000);
              state.isReadyToHarvest = true;
            }
          } else if (state.status === 'grow' && state.grownAt !== null) {
            // In grow phase - check if it's been long enough to harvest
            const timeSinceGrowth = currentTime * 1000 - state.grownAt;
            
            // If we've grown for more than a day, reset (crop would have rotted)
            if (timeSinceGrowth > 24 * 60 * 60 * 1000) {
              state.status = 'till';
              state.plantedAt = null;
              state.wateredAt = null;
              state.grownAt = null;
              state.harvestedAt = null;
              state.shippedAt = null;
              state.isReadyToHarvest = false;
            }
          } else if (state.status === 'harvest' && state.harvestedAt !== null) {
            // If harvest has been pending for more than a day, reset
            const timeSinceHarvest = currentTime * 1000 - state.harvestedAt;
            
            if (timeSinceHarvest > 24 * 60 * 60 * 1000) {
              state.status = 'till';
              state.plantedAt = null;
              state.wateredAt = null;
              state.grownAt = null;
              state.harvestedAt = null;
              state.shippedAt = null;
              state.isReadyToHarvest = false;
            }
          } else if (state.status === 'ship' && state.shippedAt !== null) {
            // If shipping has been pending for more than a day, reset
            const timeSinceShipping = currentTime * 1000 - state.shippedAt;
            
            if (timeSinceShipping > 24 * 60 * 60 * 1000) {
              state.status = 'till';
              state.plantedAt = null;
              state.wateredAt = null;
              state.grownAt = null;
              state.harvestedAt = null;
              state.shippedAt = null;
              state.isReadyToHarvest = false;
            }
          }
          
          // Update the day
          state.day = day;
        }
      }
    },
  },
});

export const { 
  till, 
  plant, 
  water, 
  sleep, 
  harvest, 
  ship, 
  earn,
  resetForNewDay,
  updateCropStateByTime
} = cropSlice.actions;

// Selectors
export const selectCropStatus = (state: RootState) => state.crop.status;
export const selectCropEarnings = (state: RootState) => state.crop.earnings;
export const selectCropDay = (state: RootState) => state.crop.day;
export const selectIsReadyToHarvest = (state: RootState) => state.crop.isReadyToHarvest;

export default cropSlice.reducer;
