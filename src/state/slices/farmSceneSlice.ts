import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface FarmSceneState {
  sceneLoaded: boolean;
  cameraPosition: { x: number; y: number; z: number };
  selectedObject: string | null;
  isEditing: boolean;
}

const initialState: FarmSceneState = {
  sceneLoaded: false,
  cameraPosition: { x: 0, y: 0, z: 10 },
  selectedObject: null,
  isEditing: false
};

export const farmSceneSlice = createSlice({
  name: 'farmScene',
  initialState,
  reducers: {
    setSceneLoaded: (state, action: PayloadAction<boolean>) => {
      state.sceneLoaded = action.payload;
    },
    updateCameraPosition: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
      state.cameraPosition = action.payload;
    },
    selectObject: (state, action: PayloadAction<string | null>) => {
      state.selectedObject = action.payload;
    },
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    }
  }
});

export const { setSceneLoaded, updateCameraPosition, selectObject, toggleEditing } = farmSceneSlice.actions;

// Selectors
export const selectFarmScene = (state: RootState) => state.farmScene;
export const selectSceneLoaded = (state: RootState) => state.farmScene.sceneLoaded;
export const selectCameraPosition = (state: RootState) => state.farmScene.cameraPosition;
export const selectSelectedObject = (state: RootState) => state.farmScene.selectedObject;
export const selectIsEditing = (state: RootState) => state.farmScene.isEditing;

export default farmSceneSlice.reducer;
