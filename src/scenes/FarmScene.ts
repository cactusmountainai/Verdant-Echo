import { Scene } from 'phaser';
import store from '../state/store';

export default class FarmScene extends Scene {
  private joystickBase!: Phaser.GameObjects.Sprite;
  private joystick!: Phaser.GameObjects.Sprite;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private isMoving: boolean = false;

  constructor() {
    super('FarmScene');
  }

  create(): void {
    // Initialize joystick base and thumb
    this.joystickBase = this.add.sprite(100, 500, 'joystick-base').setOrigin(0.5);
    this.joystick = this.add.sprite(100, 500, 'joystick').setOrigin(0.5);

    // Enable larger touch target for mobile
    this.input.setTouchTargetSize(64);

    // Initialize player sprite from Redux state
    const player = store.getState().player;
    this.playerSprite = this.add.sprite(player.x, player.y, 'player');

    // Pointer event handlers
    this.input.on('pointerdown', (pointer) => {
      if (this.joystickBase.getBounds().contains(pointer.x, pointer.y)) {
        this.isMoving = true;
        this.joystick.setPosition(pointer.x, pointer.y);
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (!this.isMoving) return;

      const dx = pointer.x - this.joystickBase.x;
      const dy = pointer.y - this.joystickBase.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Clamp to 50px radius
      if (distance > 50) {
        const angle = Math.atan2(dy, dx);
        this.joystick.setPosition(
          this.joystickBase.x + Math.cos(angle) * 50,
          this.joystickBase.y + Math.sin(angle) * 50
        );
      } else {
        this.joystick.setPosition(pointer.x, pointer.y);
      }

      // Dispatch movement to Redux (normalized vector)
      const speed = store.getState().player.speed || 1;
      store.dispatch(movePlayer({
        dx: (dx / 50) * speed,
        dy: (dy / 50) * speed
      }));
    });

    this.input.on('pointerup', () => {
      this.isMoving = false;
      this.joystick.setPosition(this.joystickBase.x, this.joystickBase.y);
    });
  }

  update(): void {
    // Sync player sprite position with Redux state every frame
    const { x, y } = store.getState().player;
    this.playerSprite.setPosition(x, y);
  }
}
