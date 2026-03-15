import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  position: { x: number; y: number };
  health: number;
  inventory: string[];
}

const initialState: PlayerState = {
  position: { x: 400, y: 300 },
  health: 100,
  inventory: [],
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.position = action.payload;
    },
    takeDamage: (state, action: PayloadAction<number>) => {
      state.health -= action.payload;
    },
    addItemToInventory: (state, action: PayloadAction<string>) => {
      state.inventory.push(action.payload);
    },
  },
});

export const { setPlayerPosition, takeDamage, addItemToInventory } = playerSlice.actions;
export default playerSlice.reducer;
