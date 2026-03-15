import { createSlice } from '@reduxjs/toolkit';
import { GameState, Season } from './types';

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    isAsleep: false,
  } as PlayerState,
  reducers: {
    triggerSleep: (state) => {
      state.isAsleep = true;
    },
    wakeUp: (state) => {
      state.isAsleep = false;
    },
  },
});

export const worldSlice = createSlice({
  name: 'world',
  initialState: {
    time: 0, // total minutes elapsed
    hour: 6,
    day: 1,
    season: 'spring' as Season,
  } as WorldState,
  reducers: {
    tickTime: (state) => {
      state.time += 10; // +10 game minutes per tick

      // Update hour (0–23)
      state.hour = Math.floor(state.time / 60) % 24;

      // Update day (starts at 1)
      state.day = Math.floor(state.time / (60 * 24)) + 1;

      // Season: 30 days per season → 4 seasons = 120 days
      const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
      state.season = seasons[Math.floor((state.day - 1) / 30) % 4];

      // Trigger sleep at 2am if not already asleep
      if (state.hour === 2 && !store.getState().player.isAsleep) {
        store.dispatch(playerSlice.actions.triggerSleep());
      }
    },
  },
});
