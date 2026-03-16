import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FarmState } from '../../types/farm';
import { TileState } from '../../types/farm';

// Existing state structure (assumed based on context)
interface FarmState {
  crops: Record<string, {
    status: TileState;
    plantedAt?: number;
    wateredAt?: number;
    tilledAt?: number;
    harvestableAt?: number;
  }>;
  day: number;
  weather: string;
}

const initialState: FarmState = {
  crops: {},
  day: 0,
  weather: 'sunny',
};

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    updateTile: (state, action: PayloadAction<{ id: string; newState: TileState }>) => {
      const { id, newState } = action.payload;
      if (state.crops[id]) {
        state.crops[id].status = newState;
      }
    },
    // ... other existing reducers
  },
});

export const { updateTile } = farmSlice.actions;
export default farmSlice.reducer;
