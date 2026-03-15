import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorldState {
  biome: string;
  timeOfDay: number;
  entities: { id: string; type: 'tree' | 'rock' | 'player'; x: number; y: number }[];
}

const initialState: WorldState = {
  biome: "farmland",
  timeOfDay: 6,
  entities: [],
};

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    setBiome: (state, action: PayloadAction<string>) => {
      state.biome = action.payload;
    },
    updateTime: (state, action: PayloadAction<number>) => {
      state.timeOfDay = (action.payload + 24) % 24;
    },
    addEntity: (state, action: PayloadAction<{ id: string; type: 'tree' | 'rock' | 'player'; x: number; y: number }>) => {
      state.entities.push(action.payload);
    },
  },
});

export const { setBiome, updateTime, addEntity } = worldSlice.actions;
export default worldSlice.reducer;
