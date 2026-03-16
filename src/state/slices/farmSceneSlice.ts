import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface FarmSceneState {
  sceneType: 'tilled' | 'planted' | 'watered' | 'growing' | 'harvestReady' | 'cleared';
  weather: 'sunny' | 'rainy' | 'cloudy' | 'stormy';
  temperature: number; // Celsius
}

const initialState: FarmSceneState = {
  sceneType: 'tilled',
  weather: 'sunny',
  temperature: 20,
};

export const farmSceneSlice = createSlice({
  name: 'farmScene',
  initialState,
  reducers: {
    updateScene: (state, action: PayloadAction<Partial<FarmSceneState>>) => {
      return { ...state, ...action.payload };
    },
    
    reset: () => initialState,
  },
});

export const { updateScene, reset } = farmSceneSlice.actions;

export default farmSceneSlice.reducer;

// Selectors
export const selectFarmScene = (state: RootState) => state.farmScene;
