import { Scene } from 'phaser';

export class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    create(): void {
        // Initialize any global settings or systems
        console.log('BootScene initialized');
        
        // Start the Preload scene
        this.scene.start('PreloadScene');
    }
}
