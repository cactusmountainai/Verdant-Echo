import { Scene } from 'phaser';

export class FarmScene extends Scene {
    constructor() {
        super('FarmScene');
    }

    preload(): void {
        // Load assets here if needed
    }

    create(): void {
        // Initialize farm scene
        console.log('FarmScene created successfully');
    }
}
