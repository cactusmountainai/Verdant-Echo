import { TimeSystemState } from '../store/slices/timeSystemSlice';
import { FarmScene } from '../scenes/FarmScene';

export class TimeSystem {
  private currentTime: number = 0; // hours (0-23)
  private currentDay: number = 1;
  private isSleeping: boolean = false;
  private onDayEndCallback: (() => void) | null = null;
  private onDayStartCallback: (() => void) | null = null;
  private farmScene: FarmScene | null = null;

  constructor(farmScene: FarmScene) {
    this.farmScene = farmScene;
  }

  public sleep(): void {
    if (this.isSleeping) return;
    
    this.isSleeping = true;
    
    // Trigger onDayEnd callback before fade
    if (this.onDayEndCallback) {
      this.onDayEndCallback();
    }
    
    // Fade out screen
    this.fadeOutScreen(() => {
      // Advance time: skip to next day at 7 AM
      this.currentDay += 1;
      this.currentTime = 7; // 7 AM next day
      
      // Fade in screen
      this.fadeInScreen(() => {
        // Trigger onDayStart callback after fade-in
        if (this.onDayStartCallback) {
          this.onDayStartCallback();
        }
        
        // Auto-save game state
        this.autoSave();
        
        // Update UI to reflect new day
        if (this.farmScene) {
          this.farmScene.updateUI();
        }
        
        this.isSleeping = false;
      });
    });
  }

  private fadeOutScreen(callback: () => void): void {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.display = 'block';
      
      // Trigger CSS transition
      setTimeout(() => {
        callback();
      }, 500); // Match CSS transition duration
    } else {
      callback(); // Fallback if no overlay
    }
  }

  private fadeInScreen(callback: () => void): void {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          if (callback) callback();
        }, 500); // Match CSS transition duration
      }, 100);
    } else {
      callback(); // Fallback if no overlay
    }
  }

  public autoSave(): void {
    if (window.farmScene && typeof window.farmScene.saveGame === 'function') {
      window.farmScene.saveGame();
    } else if (typeof window.saveGame === 'function') {
      window.saveGame();
    }
  }

  public setOnDayEnd(callback: () => void): void {
    this.onDayEndCallback = callback;
  }

  public setOnDayStart(callback: () => void): void {
    this.onDayStartCallback = callback;
  }

  public getTime(): number {
    return this.currentTime;
  }

  public getDay(): number {
    return this.currentDay;
  }

  public tick(delta: number): void {
    // Existing time progression logic
    this.currentTime += delta / (1000 * 60); // Convert ms to hours
    if (this.currentTime >= 24) {
      this.currentTime -= 24;
    }
  }
}
