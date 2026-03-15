import { Scene } from 'phaser';
import { PlayerState } from '../state/types';

export class FarmScene extends Scene {
  private crops: Phaser.GameObjects.Group;
  private player: Phaser.GameObjects.Sprite;
  private playerStore: PlayerState; // Reference to actual game state
  
  constructor() {
    super('FarmScene');
  }

  preload() {
    // Load crop assets
    this.load.image('crop_wheat', 'assets/crops/wheat.png');
    this.load.image('crop_carrot', 'assets/crops/carrot.png');
    // Add other crop assets as needed
  }

  create() {
    // Initialize crops group
    this.crops = this.add.group();
    
    // Get player state from global game store (assumed to be attached via plugin or scene system)
    this.playerStore = this.scene.sys.game.globals.playerState;
    
    // Create sample crops
    this.createCrops();
    
    // Create player
    this.player = this.add.sprite(100, 100, 'player');
    
    // Add input for tapping on crops
    this.input.on('pointerdown', this.handleTap.bind(this));
  }

  private createCrops() {
    const cropPositions = [
      { x: 200, y: 200, type: 'wheat', stage: 3 }, // mature
      { x: 300, y: 200, type: 'carrot', stage: 1 }, // immature
    ];
    
    cropPositions.forEach(pos => {
      const crop = this.add.sprite(pos.x, pos.y, `crop_${pos.type}`);
      crop.setData('type', pos.type);
      crop.setData('stage', pos.stage);
      crop.setData('maxStage', 3); 
      crop.setInteractive({ useHandCursor: true });
      
      this.crops.add(crop);
    });
  }

  private handleTap(pointer: Phaser.Input.Pointer) {
    // Check if pointer clicked on a crop
    const crop = this.crops.getChildren().find(c => 
      c.getBounds().contains(pointer.x, pointer.y)
    ) as Phaser.GameObjects.Sprite;
    
    if (!crop) return;
    
    const cropType = crop.getData('type');
    const currentStage = crop.getData('stage');
    const maxStage = crop.getData('maxStage');
    
    // Only harvest if crop is mature (at max stage)
    if (currentStage >= maxStage) {
      // Add to player inventory
      this.addToInventory(cropType);
      
      // Reduce plant state - reset to seed for regrowth
      this.resetCropState(crop);
      
      // Visual feedback
      crop.setScale(0.8);
      this.tweens.add({
        targets: crop,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          crop.destroy();
        }
      });
    }
  }

  private addToInventory(cropType: string) {
    // Update player inventory in global state
    // This assumes PlayerState has an updateInventory method or we can modify directly
    if (this.playerStore && typeof this.playerStore.updateInventory === 'function') {
      this.playerStore.updateInventory({ type: cropType, quantity: 1 });
    } else {
      // Fallback for direct state mutation (if using plain object)
      if (this.playerStore.inventory) {
        const existing = this.playerStore.inventory.find(item => item.type === cropType);
        if (existing) {
          existing.quantity += 1;
        } else {
          this.playerStore.inventory.push({ type: cropType, quantity: 1 });
        }
      }
    }
    
    console.log(`Harvested ${cropType}!`);
  }

  private resetCropState(crop: Phaser.GameObjects.Sprite) {
    // Reset to seed stage for regrowth (option 1 - preferred for farming game logic)
    crop.setData('stage', 0);
    
    // Note: We don't destroy the crop object immediately since we're using tween
    // The visual destruction happens in the tween callback, but the data state is reset here
    // so if the crop were to be re-added later (e.g., regrown), it would start at stage 0
  }
}
