import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FarmState {
  crops: string[];
  day: number;
  totalDays: number;
  weather: string;
}

const initialState: FarmState = {
  crops: [],
  day: 1,
  totalDays: 30,
  weather: 'sunny',
};

export const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    setDay: (state, action: PayloadAction<number>) => {
      state.day = action.payload;
    },
    addCrop: (state, action: PayloadAction<string>) => {
      state.crops.push(action.payload);
    },
    setWeather: (state, action: PayloadAction<string>) => {
      state.weather = action.payload;
    },
  },
});

export const { setDay, addCrop, setWeather } = farmSlice.actions;
export default farmSlice.reducer;
