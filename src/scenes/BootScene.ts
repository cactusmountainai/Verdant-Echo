import { Scene } from 'phaser';

class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    this.load.image('logo', 'assets/logo.png');
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}

export default BootScene;
