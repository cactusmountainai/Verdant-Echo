import { Scene } from 'phaser';

export class PreloadScene extends Scene {
    constructor() {
        super('PreloadScene');
    }

    preload(): void {
        // Load assets here
        this.load.image('logo', 'assets/logo.png'); // Example asset
    }

    create(): void {
        // Start the Farm scene after preloading
        this.scene.start('FarmScene');
    }
}
