import { store } from '../state/store';
import { DAY_START_AT, DAY_END_AT } from '../state/slices/timeSystemSlice';
import { update as updateTime } from '../state/slices/timeSystemSlice';
import { update as updateMoney } from '../state/slices/moneySlice';
import { resetToMax as resetEnergy } from '../state/slices/energySlice';

const MINUTES_PER_TICK = 10;

export function tick(): void {
  const state = store.getState().timeSystem;
  
  // Advance time by MINUTES_PER_TICK
  let newMinutes = state.minutes + MINUTES_PER_TICK;
  let newHours = state.hour;
  let newDay = state.day;
  
  // Handle minute rollover
  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours += 1;
  }
  
  // Check for pass-out condition (2:00 AM next day)
  if (newHours >= DAY_END_AT) {
    // Trigger pass-out sequence
    const gameOverlay = document.getElementById('game-overlay');
    if (gameOverlay) {
      gameOverlay.style.opacity = '1';
      setTimeout(() => {
        // Deduct 10% of current money
        const currentMoney = store.getState().money.amount;
        const newMoneyAmount = Math.floor(currentMoney * 0.9);
        store.dispatch(updateMoney(newMoneyAmount));
        
        // Reset energy to max
        store.dispatch(resetEnergy());
        
        // Advance to 6:00 AM next day
        store.dispatch(update({
          hours: DAY_START_AT,
          minutes: 0,
          day: newDay + 1
        }));
        
        // Auto-save game
        window.farmScene?.saveGame();
        
        // Fade out overlay after delay
        setTimeout(() => {
          if (gameOverlay) {
            gameOverlay.style.opacity = '0';
          }
        }, 1500);
      }, 500);
    }
    
    return; // Exit early since time was reset in pass-out
  }
  
  // Normal time update (not a pass-out)
  const isNight = newHours < DAY_START_AT || newHours >= 20;
  store.dispatch(updateTime({
    hours: newHours,
    minutes: newMinutes,
    day: newDay
  }));
}
