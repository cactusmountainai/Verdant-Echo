import { Scene } from 'phaser';

export class PreloadScene extends Scene {
    constructor() {
        super('PreloadScene');
    }

    preload(): void {
        // Load assets here
        this.load.image('logo', 'assets/logo.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
        
        // Show loading progress
        const progressBar = this.add.graphics();
        const progressBox = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            300,
            50
        ).setStrokeStyle(2, 0xffffff);
        
        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(
                this.cameras.main.width / 2 - 149,
                this.cameras.main.height / 2 - 24,
                298 * value,
                42
            );
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            
            // Transition to FarmScene
            this.scene.start('FarmScene');
        });
    }
}
