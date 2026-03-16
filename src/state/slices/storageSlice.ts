import { createSlice } from '@reduxjs/toolkit';
import { StorageState } from '../../models/storage';

const initialState: StorageState = {
  items: [],
  capacity: 100,
  usedCapacity: 0,
};

export const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.usedCapacity += action.payload.size || 1;
    },
    removeItem: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        state.items = state.items.filter(i => i.id !== action.payload);
        state.usedCapacity -= item.size || 1;
      }
    },
    updateItemQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        const oldQuantity = item.quantity || 0;
        const newQuantity = action.payload.quantity;
        state.usedCapacity += (newQuantity - oldQuantity) * (item.size || 1);
        item.quantity = newQuantity;
      }
    },
    setCapacity: (state, action) => {
      state.capacity = action.payload;
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, setCapacity } = storageSlice.actions;
export default storageSlice.reducer;
