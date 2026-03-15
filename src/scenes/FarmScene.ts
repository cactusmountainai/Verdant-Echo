import { Scene } from 'phaser';
import { PlayerState } from '../state/types';

export class FarmScene extends Scene {
  private player!: Phaser.GameObjects.Sprite;
  private tiles: Phaser.GameObjects.TilemapLayer[] = [];
  private waterCanActive = false;

  constructor() {
    super('FarmScene');
  }

  preload() {
    // Load assets
    this.load.image('tiles', 'assets/tiles.png');
    this.load.tilemapTiledJSON('farmMap', 'assets/farm-map.json');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('waterCan', 'assets/water-can.png');
  }

  create() {
    // Create tilemap
    const map = this.make.tilemap({ key: 'farmMap' });
    const tileset = map.addTilesetImage('tiles', 'tiles');
    
    // Create ground layer
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    groundLayer.setCollisionByProperty({ collides: true });

    // Create plant layers (for interaction)
    this.tiles = [
      map.createLayer('Plants1', tileset, 0, 0),
      map.createLayer('Plants2', tileset, 0, 0),
      map.createLayer('Plants3', tileset, 0, 0)
    ];

    // Create player
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);
    
    // Setup player controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, groundLayer);

    // Add water can interaction
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.canInteract()) return;
      
      const tile = this.getTileAtPointer(pointer);
      if (tile && this.isWaterableTile(tile)) {
        this.waterTile(tile);
      }
    });

    // Show water can UI
    this.add.image(50, 50, 'waterCan').setScale(0.5).setOrigin(0);
    
    // Add energy/water counter text
    this.add.text(100, 40, 'Water: 10/10\nEnergy: 100/100', {
      fontSize: '16px',
      fill: '#fff'
    });
  }

  private canInteract(): boolean {
    // Check if player has water and energy
    const state = this.sys.game.globals.playerState as PlayerState;
    return (state.water > 0 && state.energy > 5);
  }

  private getTileAtPointer(pointer: Phaser.Input.Pointer): Phaser.Tilemaps.Tile | null {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    
    for (const layer of this.tiles) {
      const tile = layer.getTileAtWorldXY(worldPoint.x, worldPoint.y, 32, 32, false);
      if (tile && tile.index > -1) {
        return tile;
      }
    }
    return null;
  }

  private isWaterableTile(tile: Phaser.Tilemaps.Tile): boolean {
    // Check if tile has a plant that needs water (non-zero index and not fully grown)
    const state = this.sys.game.globals.playerState as PlayerState;
    const plantData = state.plants?.[`${tile.x},${tile.y}`];
    
    return !!plantData && !plantData.isHarvestable && plantData.waterLevel < 100;
  }

  private waterTile(tile: Phaser.Tilemaps.Tile): void {
    // Get current player state
    const state = this.sys.game.globals.playerState as PlayerState;
    
    if (state.water <= 0 || state.energy <= 5) return;

    // Update plant water level
    const key = `${tile.x},${tile.y}`;
    const updatedPlants = { ...state.plants };
    if (!updatedPlants[key]) {
      updatedPlants[key] = { waterLevel: 25, growthStage: 1, isHarvestable: false };
    } else {
      updatedPlants[key].waterLevel = Math.min(100, updatedPlants[key].waterLevel + 25);
    }

    // Update player state
    this.sys.game.globals.playerState = {
      ...state,
      water: state.water - 1,
      energy: state.energy - 5,
      plants: updatedPlants
    };

    // Visual feedback - create splash effect
    const splash = this.add.sprite(tile.pixelX + 16, tile.pixelY + 16, 'waterCan');
    splash.setScale(0.3);
    splash.alpha = 0.7;
    this.tweens.add({
      targets: splash,
      alpha: 0,
      scale: 0.5,
      duration: 500,
      onComplete: () => splash.destroy()
    });

    // Play water sound (if available)
    // this.sound.play('water');
  }

  update() {
    // Handle player movement
    const speed = 150;
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }
  }
}
