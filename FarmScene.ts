import { Scene } from 'phaser';

export class FarmScene extends Scene {
    constructor() {
        super('FarmScene');
    }

    create(): void {
        console.log('FarmScene: Game loaded and ready');
        
        // Add game elements here (farm, characters, UI, etc.)
        const background = this.add.image(400, 300, 'logo').setScale(0.5);
        
        // Add any initialization code for the farm scene
        this.cameras.main.setBackgroundColor('#2d7a3b'); // Green background for farm
        
        // Optional: Add a simple text to confirm scene is working
        const text = this.add.text(
            400, 
            300, 
            'Farm Scene Loaded!\nGame running successfully', 
            { 
                fontSize: '24px', 
                color: '#ffffff',
                wordWrap: { width: 500 }
            }
        ).setOrigin(0.5);
    }
}
