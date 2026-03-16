import { store } from '../store';
import { updateTime, setDay } from '../state/slices/timeSystemSlice';

const dayStartAt = 6; // 6:00 AM
const dayEndAt = 26;  // 2:00 AM next day (24 + 2)
const minutesPerTick = 10;
const minutesInHour = 60;
const minutesInDay = 24 * minutesInHour;

export class TimeSystem {
  async tick(): Promise<void> {
    const state = store.getState();
    let { hours, minutes, day } = state.timeSystem;
    
    // Advance time by 10 minutes
    minutes += minutesPerTick;
    
    // Handle hour rollover
    if (minutes >= minutesInHour) {
      hours += Math.floor(minutes / minutesInHour);
      minutes %= minutesInHour;
    }
    
    // Handle day rollover - check if we've passed 2:00 AM (dayEndAt)
    const totalMinutes = day * minutesInDay + hours * minutesInHour + minutes;
    const endOfDayMinutes = (dayStartAt + 24) * minutesInHour; // 26*60 = 1560 minutes
    
    if (totalMinutes >= endOfDayMinutes) {
      // Trigger pass-out sequence
      this.triggerPassOut();
      
      // Advance to next day at 6:00 AM
      day += 1;
      hours = dayStartAt;
      minutes = 0;
    } else if (hours >= 24) {
      // Handle normal day rollover (if we somehow exceed 24 hours without hitting pass-out)
      day += Math.floor(hours / 24);
      hours %= 24;
    }
    
    // Update Redux state
    store.dispatch(updateTime({ hours, minutes }));
    if (day !== state.timeSystem.day) {
      store.dispatch(setDay(day));
    }
  }
  
  private triggerPassOut(): void {
    // Get current money and energy from state
    const state = store.getState();
    const currentMoney = state.money || 0;
    const maxEnergy = state.energyMax || 100; // Assuming energyMax exists in state
    
    // Deduct 10% of current money
    const newMoney = Math.floor(currentMoney * 0.9);
    
    // Reset energy to max
    store.dispatch({ type: 'energy/setEnergy', payload: maxEnergy });
    store.dispatch({ type: 'money/updateMoney', payload: newMoney });
    
    // Fade screen to black
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.backgroundColor = 'black';
      
      // After fade completes, reset opacity (500ms duration)
      setTimeout(() => {
        overlay.style.opacity = '0';
      }, 500);
    }
    
    // Auto-save game state
    if (window.farmScene && typeof window.farmScene.saveGame === 'function') {
      window.farmScene.saveGame();
    }
  }
}
