import Phaser from 'phaser';

/**
 * Boot Scene for initializing game configuration
 */
class BootScene extends Phaser.Scene {
  
  constructor() {
    super('BootScene');
  }
  
  preload(): void {
    // Load any essential assets needed for other scenes
    this.load.on('complete', () => {
      this.scene.start('PreloadScene');
    });
  }
  
  create(): void {
    // Initialize game configuration and start next scene
    this.scene.start('PreloadScene');
  }
}

export default BootScene;
