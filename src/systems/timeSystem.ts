import { store } from '../store';
import { updateTime } from '../state/slices/timeSystemSlice';

export class TimeSystem {
  private onDayEndCallback: (() => void) | null = null;
  private onDayStartCallback: (() => void) | null = null;
  private isSleeping: boolean = false;

  setOnDayEnd(callback: () => void): void {
    this.onDayEndCallback = callback;
  }

  setOnDayStart(callback: () => void): void {
    this.onDayStartCallback = callback;
  }

  async sleep(): Promise<void> {
    if (this.isSleeping) return;

    this.isSleeping = true;

    const state = store.getState().timeSystem;
    let currentTime = state.currentTime;
    let currentDay = state.currentDay;

    // Trigger day end callback before fade-out
    if (this.onDayEndCallback) {
      this.onDayEndCallback();
    }

    // Fade out
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Update time: advance to next day if needed
    currentTime = (currentTime + 1) % 24;
    if (currentTime === 0) {
      currentDay++;
    }

    // Dispatch updated time state
    store.dispatch(updateTime({ currentTime, currentDay }));

    // Fade in
    if (overlay) {
      overlay.style.opacity = '0';
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Trigger day start callback after fade-in
    if (this.onDayStartCallback) {
      this.onDayStartCallback();
    }

    // Auto-save
    if (window.farmScene && window.farmScene.saveGame) {
      window.farmScene.saveGame();
    }

    // Update UI
    if (window.farmScene && window.farmScene.updateUI) {
      window.farmScene.updateUI();
    }

    this.isSleeping = false;
  }
}
