import { Game } from 'phaser';
import { BootScene } from './systems/BootScene';
import { PreloadScene } from './systems/PreloadScene';
import { FarmScene } from './systems/FarmScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: [BootScene, PreloadScene, FarmScene],
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};

const game = new Game(config);
