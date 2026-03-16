import { Game } from 'phaser';
import { BootScene } from './BootScene.ts';
import { PreloadScene } from './PreloadScene.ts';
import { FarmScene } from './FarmScene.ts';
import { useStore } from './store.ts';

// Create and configure the game
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    scene: [BootScene, PreloadScene, FarmScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Game(config);

// Test that the game boots correctly into FarmScene
game.scene.events.on('start', (scene) => {
    if (scene.key === 'FarmScene') {
        console.log('Game successfully booted into FarmScene');
        // Mark as loaded in state store
        useStore.setState({ isGameLoaded: true });
    }
});

// Add error handling for debugging
window.addEventListener('error', (e) => {
    console.error('Phaser game error:', e.error);
});
