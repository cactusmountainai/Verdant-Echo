import { store } from '../state/store';
import { updateTime } from '../state/slices/timeSystemSlice';

export class TimeSystem {
  private isSleeping = false;
  private onDayEndCallback: (() => void) | null = null;
  private onDayStartCallback: (() => void) | null = null;

  setOnDayEnd(callback: () => void): void {
    this.onDayEndCallback = callback;
  }

  setOnDayStart(callback: () => void): void {
    this.onDayStartCallback = callback;
  }

  async sleep(): Promise<void> {
    if (this.isSleeping) return;

    this.isSleeping = true;

    // Trigger onDayEnd before fade-out
    if (this.onDayEndCallback) {
      this.onDayEndCallback();
    }

    // Fade out screen
    await this.fadeOutScreen();

    // Update time state
    const currentState = store.getState().timeSystem;
    let newTime = (currentState.currentTime + 1) % 24;
    let newDay = currentState.currentDay;

    if (currentState.currentTime === 23) {
      newDay += 1;
    }

    store.dispatch(updateTime({ currentTime: newTime, currentDay: newDay }));

    // Auto-save after time update
    this.autoSave();

    // Fade in screen
    await this.fadeInScreen();

    // Trigger onDayStart after fade-in completes
    if (this.onDayStartCallback) {
      this.onDayStartCallback();
    }

    // Update FarmScene UI
    if (window.farmScene && typeof window.farmScene.updateUI === 'function') {
      window.farmScene.updateUI();
    }

    this.isSleeping = false;
  }

  private async fadeOutScreen(): Promise<void> {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      return new Promise((resolve) => {
        setTimeout(resolve, 500); // Match CSS transition duration
      });
    }
  }

  private async fadeInScreen(): Promise<void> {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      return new Promise((resolve) => {
        setTimeout(resolve, 500); // Match CSS transition duration
      });
    }
  }

  private autoSave(): void {
    if (window.farmScene && typeof window.farmScene.saveGame === 'function') {
      window.farmScene.saveGame();
    } else if (typeof window.saveGame === 'function') {
      window.saveGame();
    }
  }
}
