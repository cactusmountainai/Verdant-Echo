import { BootScene } from './BootScene';
import { PreloadScene } from './PreloadScene';
import { FarmScene } from './FarmScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [BootScene, PreloadScene, FarmScene],
    // ... other config options
};

const game = new Phaser.Game(config);
