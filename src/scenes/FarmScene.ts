import { Scene } from 'phaser';

interface FarmState {
  crops: number;
  animals: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

class FarmScene extends Scene {
  private state: FarmState = {
    crops: 0,
    animals: 0,
    timeOfDay: 'morning',
  };

  constructor() {
    super('FarmScene');
  }

  create(): void {
    this.add.text(100, 100, `Crops: ${this.state.crops}`, { fontSize: '32px', fill: '#fff' });
    
    this.input.on('pointerdown', () => {
      this.state.crops += 1;
      this.updateUI();
    });
  }

  private updateUI(): void {
    // Clear existing text elements
    this.children.iterate((child) => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.destroy();
      }
    });

    // Re-render UI
    this.add.text(100, 100, `Crops: ${this.state.crops}`, { fontSize: '32px', fill: '#fff' });
  }

  update(time: number, delta: number): void {
    // Update logic here if needed
  }
}

export default FarmScene;
