import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';

interface FarmState {
  crops: string[];
  resources: number;
}

const initialState: FarmState = {
  crops: [],
  resources: 100,
};

const farmSceneSlice = createSlice({
  name: 'farmScene',
  initialState,
  reducers: {
    plantCrop(state, action: PayloadAction<string>) {
      state.crops.push(action.payload);
      state.resources -= 10;
    },
    harvestCrop(state) {
      if (state.crops.length > 0) {
        state.crops.pop();
        state.resources += 25;
      }
    },
  },
});

// Thunk to handle complex farm logic with side effects
export const plantAndWaterAsync = (cropName: string): AppThunk => async (dispatch, getState) => {
  // Check if enough resources before dispatching
  if (getState().farmScene.resources >= 10) {
    dispatch(plantCrop(cropName));
    // Simulate watering delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch({ type: 'waterCrop', payload: cropName }); // Custom action for water effect
  } else {
    dispatch({ type: 'insufficientResources' });
  }
};

// Add custom non-reducer action (for middleware or extraReducers if needed)
export const waterCrop = (cropName: string) => ({
  type: 'waterCrop',
  payload: cropName,
});

export const insufficientResources = () => ({ type: 'insufficientResources' });

export const { plantCrop, harvestCrop } = farmSceneSlice.actions;
export default farmSceneSlice.reducer;
