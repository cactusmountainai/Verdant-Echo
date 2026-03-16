import { store } from '../state/store';
import { timeSystemSlice } from '../state/slices/timeSystemSlice';

const dayStartAt = 6; // 6:00 AM
const dayEndAt = 26;  // 2:00 AM next day (24 hours later in this system)
const minutesPerTick = 10;

export class TimeSystem {
  tick(): void {
    const state = store.getState();
    const { hour, minutes, day } = state.timeSystem;
    
    let newHour = hour;
    let newMinutes = minutes + minutesPerTick;
    let newDay = day;
    
    // Handle minute rollover
    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHour += 1;
    }
    
    // Handle hour rollover and day transition
    if (newHour >= dayEndAt) {
      // Trigger pass-out sequence when reaching 2:00 AM (26:00)
      this.triggerPassOutSequence();
      
      // Advance to next day at 6:00 AM
      newDay += 1;
      newHour = dayStartAt;
      newMinutes = 0;
    } else if (newHour >= 24) {
      // Handle normal hour rollover (after midnight but before 2AM)
      newHour -= 24;
    }
    
    // Update time in Redux
    store.dispatch(timeSystemSlice.actions.update({ 
      hours: newHour, 
      minutes: newMinutes,
      day: newDay
    }));
  }
  
  private triggerPassOutSequence(): void {
    const state = store.getState();
    
    // Fade screen to black
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      
      // After delay, fade back out
      setTimeout(() => {
        overlay.style.opacity = '0';
      }, 500);
    }
    
    // Deduct 10% of current money
    const newMoney = Math.floor(state.money * 0.9);
    store.dispatch({ type: 'money/update', payload: newMoney });
    
    // Reset energy to max
    store.dispatch({ 
      type: 'energy/resetToMax', 
      payload: state.energyMax 
    });
    
    // Auto-save game after pass-out
    if (window.farmScene && window.farmScene.saveGame) {
      window.farmScene.saveGame();
    }
  }
}
