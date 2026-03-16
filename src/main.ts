import { BootScene } from './BootScene';
import { PreloadScene } from './PreloadScene';
import { FarmScene } from './FarmScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, PreloadScene, FarmScene],
};

new Phaser.Game(config);
