import { store } from '../state/store';
import { updateTime } from '../state/slices/timeSystemSlice';

export class TimeSystem {
  private farmScene: any; // FarmScene instance
  private onDayEndCallback: (() => void) | null = null;
  private onDayStartCallback: (() => void) | null = null;
  public isSleeping: boolean = false;

  constructor(farmScene: any) {
    this.farmScene = farmScene;
  }

  sleep(): void {
    if (this.isSleeping) return;

    this.isSleeping = true;

    // Trigger day end callback before fade-out
    if (this.onDayEndCallback) {
      this.onDayEndCallback();
    }

    // Fade out screen
    this.fadeOutScreen(() => {
      // Advance time after fade-out completes
      const currentTime = store.getState().timeSystem.currentTime;
      const newTime = (currentTime + 1) % 24;
      const newDay = currentTime === 23 ? store.getState().timeSystem.currentDay + 1 : store.getState().timeSystem.currentDay;

      // Update Redux state
      store.dispatch(updateTime({
        currentTime: newTime,
        currentDay: newDay,
        isPaused: false,
        speed: 1
      }));

      // Auto-save after time advancement
      if (window.farmScene && window.farmScene.saveGame) {
        window.farmScene.saveGame();
      } else if (window.saveGame) {
        window.saveGame();
      }

      // Trigger day start callback after fade-in completes
      this.fadeInScreen(() => {
        if (this.onDayStartCallback) {
          this.onDayStartCallback();
        }
        
        // Update UI after full cycle
        this.farmScene.updateUI();
        
        this.isSleeping = false;
      });
    });
  }

  private fadeOutScreen(callback: () => void): void {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      setTimeout(callback, 500); // Match CSS transition duration
    } else {
      callback(); // Fallback if overlay doesn't exist
    }
  }

  private fadeInScreen(callback: () => void): void {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(callback, 500); // Match CSS transition duration
    } else {
      callback(); // Fallback if overlay doesn't exist
    }
  }

  setOnDayEnd(callback: () => void): void {
    this.onDayEndCallback = callback;
  }

  setOnDayStart(callback: () => void): void {
    this.onDayStartCallback = callback;
  }
}
