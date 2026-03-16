import { BootScene } from './BootScene.ts';
import { PreloadScene } from './PreloadScene.ts';
import { FarmScene } from './FarmScene.ts';

// Example usage (adjust based on actual game setup logic)
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, PreloadScene, FarmScene],
};

const game = new Phaser.Game(config);
