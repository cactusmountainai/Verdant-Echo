import Phaser from 'phaser';
import TimeSystem from './systems/timeSystem';

/**
 * Farm Scene class for managing farm simulation
 */
class FarmScene extends Phaser.Scene {
  private timeSystem: TimeSystem;
  
  constructor() {
    super('FarmScene');
  }
  
  preload(): void {
    // Load assets here
  }
  
  create(): void {
    // Initialize scene elements
    this.timeSystem = new TimeSystem();
  }
  
  update(time: number, delta: number): void {
    if (this.timeSystem) {
      this.timeSystem.update(delta);
    }
  }
}

export default FarmScene;
