import { createSlice } from '@reduxjs/toolkit';
import { FarmSceneState } from '../../FarmScene';

const initialState: FarmSceneState = {
  crops: [],
  animals: [],
  structures: [],
  resources: {
    water: 100,
    fertilizer: 50,
    seeds: 20,
  },
};

export const farmSceneSlice = createSlice({
  name: 'farmScene',
  initialState,
  reducers: {
    addCrop: (state, action) => {
      state.crops.push(action.payload);
    },
    removeCrop: (state, action) => {
      state.crops = state.crops.filter(crop => crop.id !== action.payload);
    },
    updateCropGrowth: (state, action) => {
      const crop = state.crops.find(c => c.id === action.payload.id);
      if (crop) {
        crop.growthStage = action.payload.growthStage;
      }
    },
    addAnimal: (state, action) => {
      state.animals.push(action.payload);
    },
    updateResource: (state, action) => {
      const { resource, amount } = action.payload;
      // Use keyof to ensure type safety without casting
      if (resource in state.resources) {
        state.resources[resource] += amount;
      }
    },
  },
});

export const { addCrop, removeCrop, updateCropGrowth, addAnimal, updateResource } = farmSceneSlice.actions;
export default farmSceneSlice.reducer;
