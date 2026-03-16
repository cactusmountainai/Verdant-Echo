import { Scene } from 'phaser';

export class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    create(): void {
        // Initialize game settings, config, etc.
        console.log('BootScene: Game initialization started');
        
        // Immediately transition to PreloadScene after boot
        this.scene.start('PreloadScene');
    }
}
