import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TileState } from '../types/farm';

export interface FarmState {
  crops: Record<string, { status: TileState }>;
}

const initialState: FarmState = {
  crops: {},
};

export const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    updateTile: (state, action: PayloadAction<{ id: string; newState: TileState }>) => {
      const { id, newState } = action.payload;
      if (!state.crops[id]) {
        state.crops[id] = { status: 'untilled' };
      }
      state.crops[id].status = newState;
    },
  },
});

export const { updateTile } = farmSlice.actions;
export default farmSlice.reducer;
