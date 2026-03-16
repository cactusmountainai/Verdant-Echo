import { Game, Types } from 'phaser';
import { BootScene } from './BootScene';
import { PreloadScene } from './PreloadScene';
import { FarmScene } from './FarmScene';

// Define game configuration
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [BootScene, PreloadScene, FarmScene],
    backgroundColor: '#1a2b3c'
};

// Create and start the game
const game = new Game(config);

console.log('Game initialized successfully');
