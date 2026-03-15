import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState } from '../types';

const initialState: PlayerState = {
  gold: 0,
  inventory: {},
  position: { x: 0, y: 0 },
  level: 1,
  experience: 0
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addGold: (state, action: PayloadAction<number>) => {
      state.gold += action.payload;
    },
    removeGold: (state, action: PayloadAction<number>) => {
      state.gold -= action.payload;
    },
    addItemToInventory: (state, action: PayloadAction<string>) => {
      if (!state.inventory[action.payload]) {
        state.inventory[action.payload] = 0;
      }
      state.inventory[action.payload]++;
    },
    removeItemFromInventory: (state, action: PayloadAction<string>) => {
      if (state.inventory[action.payload] > 1) {
        state.inventory[action.payload]--;
      } else {
        delete state.inventory[action.payload];
      }
    },
    sellAllItems: (state) => {
      const itemValues: Record<string, number> = {
        'wheat': 5,
        'carrot': 3,
        'potato': 4,
        'corn': 6,
        'tomato': 8,
        'cabbage': 7
      };
      
      Object.keys(state.inventory).forEach(item => {
        const value = itemValues[item as keyof typeof itemValues];
        if (value !== undefined) {
          state.gold += state.inventory[item] * value;
        }
        // If item has no defined value, it won't be sold (safeguard)
      });
      
      // Clear inventory after selling
      state.inventory = {};
    }
  },
});

export const { addGold, removeGold, addItemToInventory, removeItemFromInventory, sellAllItems } = playerSlice.actions;

export default playerSlice.reducer;
