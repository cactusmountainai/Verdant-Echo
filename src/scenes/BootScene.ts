import { Scene } from 'phaser';

export class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Show loading bar
    this.load.image('loading', 'assets/loading.png'); // optional placeholder

    // Load any essential assets (e.g., fonts, UI sprites)
    // Keep it minimal — full asset load happens in PreloadScene
  }

  create(): void {
    // Transition immediately to PreloadScene
    this.scene.start('PreloadScene');
  }
}
