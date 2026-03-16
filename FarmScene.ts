import { timeSystem } from './systems/timeSystem';

export class FarmScene extends Phaser.Scene {
    constructor() {
        super('FarmScene');
    }

    create() {
        // Initialize time system callbacks
        timeSystem.setOnDayEnd(() => {
            this.onDayEnd();
        });
        
        timeSystem.setOnDayStart(() => {
            this.onDayStart();
        });

        // Add sleep button to UI
        this.addSleepButton();
    }

    addSleepButton() {
        const sleepButton = this.add.text(10, 10, '🌙 Sleep', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#3a5f7b',
            padding: '8px 12px',
            borderRadius: '4px'
        })
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', () => {
            this.sleep();
        });
    }

    sleep() {
        // Prevent multiple sleeps
        if (timeSystem.isSleeping) return;
        
        // Show UI feedback
        const sleepText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Going to sleep...\n\nGoodnight!',
            {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '20px',
                align: 'center'
            }
        )
        .setOrigin(0.5);
        
        // Trigger sleep in time system
        timeSystem.sleep();
        
        // Remove text after fade
        setTimeout(() => {
            sleepText.destroy();
        }, 3000);
    }

    onDayEnd() {
        console.log('Day ended');
        // Add any day-end logic here (e.g., crop growth, animal state changes)
        this.updateUI();
    }

    onDayStart() {
        console.log('New day started');
        // Add any day-start logic here
        this.updateUI();
    }
    
    updateUI() {
        // Update any UI elements that need to reflect time changes
        // e.g., day counter, weather indicator, etc.
    }

    saveGame() {
        // Save game state logic here
        console.log('Game saved');
    }
}
