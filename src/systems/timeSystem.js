// timeSystem.js — runs in game loop; dispatches ticks every 7s
import { store } from '../state/store';

let lastTick = Date.now();

export function update() {
  const now = Date.now();
  if (now - lastTick >= 7000) { // 7 seconds = 10 minutes in-game
    store.dispatch(worldSlice.actions.tickTime());
    lastTick = now;
  }
}
