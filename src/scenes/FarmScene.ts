import { TimeSystem } from '../systems/timeSystem';

export class FarmScene extends Phaser.Scene {
  private timeSystem: TimeSystem;

  constructor() {
    super('FarmScene');
    
    this.timeSystem = new TimeSystem(this);
    
    // Register callbacks to handle day transitions
    this.timeSystem.setOnDayEnd(() => {
      this.onDayEnd();
    });
    
    this.timeSystem.setOnDayStart(() => {
      this.onDayStart();
    });
  }

  public onDayEnd(): void {
    // Stop all active animations/events
    this.animals.forEach(animal => animal.stopAllSounds());
    this.crops.forEach(crop => crop.pauseGrowth());
    
    // Show UI feedback (optional)
    const dayEndText = document.getElementById('day-end-text');
    if (dayEndText) {
      dayEndText.style.display = 'block';
      setTimeout(() => { dayEndText.style.display = 'none'; }, 2000);
    }
  }

  public onDayStart(): void {
    // Resume growth, reset NPC states, etc.
    this.crops.forEach(crop => crop.resumeGrowth());
    
    // Show UI feedback (optional)
    const dayStartText = document.getElementById('day-start-text');
    if (dayStartText) {
      dayStartText.style.display = 'block';
      setTimeout(() => { dayStartText.style.display = 'none'; }, 2000);
    }
  }

  public saveGame(): void {
    // Implementation for saving game state
    // This should sync with Redux store and localStorage
    console.log('Game saved');
    
    // Example: update Redux state
    // store.dispatch(saveGameState({
    //   day: this.timeSystem.getDay(),
    //   time: this.timeSystem.getTime(),
    //   crops: this.crops.map(c => c.getState()),
    //   animals: this.animals.map(a => a.getState())
    // }));
  }

  public updateUI(): void {
    // Update all UI elements to reflect current day/time
    const dayDisplay = document.getElementById('day-display');
    if (dayDisplay) {
      dayDisplay.textContent = `Day ${this.timeSystem.getDay()}`;
    }
    
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
      const hours = Math.floor(this.timeSystem.getTime());
      const minutes = Math.round((this.timeSystem.getTime() - hours) * 60);
      timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Update crop/animal states in UI
    this.updateCropUI();
    this.updateAnimalUI();
  }

  private updateCropUI(): void { /* ... */ }
  private updateAnimalUI(): void { /* ... */ }
}
