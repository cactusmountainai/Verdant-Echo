import { Scene } from 'phaser';

export class PreloadScene extends Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    // Load all game assets: sprites, audio, fonts, etc.
    this.load.image('player', 'assets/sprites/player.png');
    this.load.audio('music', 'assets/audio/music.mp3');

    // Show loading bar (optional but recommended)
    this.load.on('progress', (value) => {
      console.log(`${Math.round(value * 100)}% loaded`);
    });

    this.load.on('complete', () => {
      console.log('All assets loaded');
    });
  }

  create(): void {
    // Transition to FarmScene after all assets are loaded
    this.scene.start('FarmScene');
  }
}
