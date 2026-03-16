import Phaser from 'phaser';

/**
 * Preload Scene for loading assets before main game starts
 */
class PreloadScene extends Phaser.Scene {
  
  constructor() {
    super('PreloadScene');
  }
  
  preload(): void {
    // Load all necessary assets
    this.load.image('background', 'assets/background.png');
    this.load.image('farmer', 'assets/farmer.png');
    this.load.image('crop', 'assets/crop.png');
    this.load.image('tool', 'assets/tool.png');
  }
  
  create(): void {
    // Start the main game scene
    this.scene.start('FarmScene');
  }
}

export default PreloadScene;
