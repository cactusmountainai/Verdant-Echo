import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    addCrop: (state, action: PayloadAction<any>) => {
      state.crops.push(action.payload);
    },
    removeCrop: (state, action: PayloadAction<number>) => {
      state.crops = state.crops.filter((_, index) => index !== action.payload);
    },
    updateResource: (state, action: PayloadAction<{ resource: keyof typeof initialState.resources; amount: number }>) => {
      const { resource, amount } = action.payload;
      state.resources[resource] += amount;
    },
  },
});

export const { addCrop, removeCrop, updateResource } = farmSceneSlice.actions;
export default farmSceneSlice.reducer;
