import { Scene } from 'phaser';

interface AssetMap {
  [key: string]: string;
}

class PreloadScene extends Scene {
  private readonly assets: AssetMap = {
    logo: 'assets/logo.png',
    // Add all your assets here with explicit types
  };

  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    Object.keys(this.assets).forEach((key) => {
      this.load.image(key, this.assets[key]);
    });
  }

  create(): void {
    this.scene.start('FarmScene');
  }
}

export default PreloadScene;
