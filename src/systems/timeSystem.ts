import { store } from '../state/store';
import { timeSystemSlice } from '../state/slices/timeSystemSlice';
import { moneySlice } from '../state/slices/moneySlice';
import { energySlice } from '../state/slices/energySlice';

// Constants for day cycle
const DAY_START_AT = 6;   // 6:00 AM
const DAY_END_AT = 26;    // 2:00 AM next day (26 in 24-hour format)
const MINUTES_PER_TICK = 10;

/**
 * Advances game time by 10 minutes and handles rollovers and pass-out sequence
 */
export function tick(): void {
  const state = store.getState();
  let { hour, minutes, day } = state.timeSystem;
  
  // Advance time by 10 minutes
  minutes += MINUTES_PER_TICK;
  
  // Handle minute to hour rollover
  if (minutes >= 60) {
    minutes -= 60;
    hour++;
  }
  
  // Check for pass-out condition (2:00 AM = 26 hours)
  if (hour >= DAY_END_AT) {
    // Trigger pass-out sequence
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      // Allow time for fade effect
      setTimeout(() => {
        // Deduct 10% of money (round down)
        const currentMoney = state.money;
        const newMoney = Math.floor(currentMoney * 0.9);
        store.dispatch(moneySlice.actions.update(newMoney));
        
        // Reset energy to max
        store.dispatch(energySlice.actions.resetToMax());
        
        // Advance to next day at 6:00 AM
        hour = DAY_START_AT;
        day++;
        
        // Update time in Redux
        store.dispatch(timeSystemSlice.actions.update({
          day,
          hour,
          minutes,
          isNight: hour < DAY_START_AT || hour >= 22, // Night from 10PM to 6AM
          lastUpdate: Date.now()
        }));
        
        // Auto-save game after pass-out completes
        window.farmScene?.saveGame();
        
        // Fade overlay back out
        setTimeout(() => {
          if (overlay) {
            overlay.style.opacity = '0';
          }
        }, 1500);
      }, 500); // Wait for fade-in effect
    }
  } else {
    // Normal time progression - update Redux state
    const isNight = hour < DAY_START_AT || hour >= 22; // Night from 10PM to 6AM
    
    store.dispatch(timeSystemSlice.actions.update({
      day,
      hour,
      minutes,
      isNight,
      lastUpdate: Date.now()
    }));
  }
}
