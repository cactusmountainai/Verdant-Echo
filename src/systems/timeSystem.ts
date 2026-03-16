import { store } from '../state/store';
import { update } from '../state/slices/timeSystemSlice';
import { updateMoney } from '../state/slices/moneySlice';
import { resetEnergy } from '../state/slices/energySlice';

const MINUTES_PER_TICK = 10;
const DAY_START_AT = 6;
const DAY_END_AT = 26;

export function tick(): void {
  const state = store.getState().timeSystem;
  let newHours = state.hours;
  let newMinutes = state.minutes + MINUTES_PER_TICK;
  let newDay = state.day;

  // Handle minute rollover
  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours += 1;
  }

  // Check for pass-out condition (reaching DAY_END_AT)
  if (newHours >= DAY_END_AT) {
    // Trigger pass-out sequence
    const gameOverlay = document.getElementById('game-overlay');
    
    if (gameOverlay) {
      // Fade out overlay
      gameOverlay.style.opacity = '1';
      setTimeout(() => {
        // Deduct 10% of money
        const currentMoney = store.getState().money.money;
        const newMoney = Math.floor(currentMoney * 0.9);
        store.dispatch(updateMoney(newMoney));
        
        // Reset energy to max
        store.dispatch(resetEnergy());
        
        // Advance to next day at DAY_START_AT (6:00 AM)
        newHours = DAY_START_AT;
        newMinutes = 0;
        newDay += 1;
        
        // Fade in overlay after delay
        setTimeout(() => {
          gameOverlay.style.opacity = '0';
          
          // Auto-save after pass-out completes
          window.farmScene?.saveGame();
        }, 1500);
      }, 500);
    }
    
    // Update time state even if overlay doesn't exist
    store.dispatch(update({ hours: newHours, minutes: newMinutes, day: newDay }));
    return;
  }

  // Regular time advancement (no pass-out)
  store.dispatch(update({ hours: newHours, minutes: newMinutes, day: newDay }));
}
