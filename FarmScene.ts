export class FarmScene extends Phaser.GameObjects.Scene {
  private joystickBase!: Phaser.GameObjects.Sprite;
  private joystickThumb!: Phaser.GameObjects.Sprite;
  private playerSprite!: Phaser.GameObjects.Sprite;

  constructor() {
    super('FarmScene');
  }

  create() {
    // --- JOYSTICK ---
    this.joystickBase = this.add.sprite(100, 500, 'joystick-base').setOrigin(0.5);
    this.joystickThumb = this.add.sprite(100, 500, 'joystick').setOrigin(0.5);

    // --- PLAYER SPRITE (CRITICAL: ADDED) ---
    this.playerSprite = this.add.sprite(400, 300, 'player');
    this.physics.add.existing(this.playerSprite);

    // --- INPUT HANDLERS ---
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
  }

  update() {
    // Sync player position from Redux store
    const state = store.getState();
    if (this.playerSprite) {
      this.playerSprite.setPosition(state.player.x, state.player.y);
    }
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    const thumbRect = this.joystickThumb.getBounds();
    if (
      pointer.worldX >= thumbRect.left &&
      pointer.worldX <= thumbRect.right &&
      pointer.worldY >= thumbRect.top &&
      pointer.worldY <= thumbRect.bottom
    ) {
      // Dragging thumb — will be handled in pointermove
    }
    // Clicked elsewhere? Ignore — joystick only responds to thumb drag
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    const baseX = this.joystickBase.x;
    const baseY = this.joystickBase.y;
    const dx = pointer.worldX - baseX;
    const dy = pointer.worldY - baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Clamp to radius (50px)
    if (distance > 50) {
      const angle = Math.atan2(dy, dx);
      this.joystickThumb.x = baseX + Math.cos(angle) * 50;
      this.joystickThumb.y = baseY + Math.sin(angle) * 50;
    } else {
      this.joystickThumb.x = pointer.worldX;
      this.joystickThumb.y = pointer.worldY;
    }

    // Normalize input vector for movement
    const normalizedX = dx / 50;
    const normalizedY = dy / 50;

    // Dispatch to Redux
    store.dispatch(updatePlayerMovement({ x: normalizedX, y: normalizedY }));
  }

  private onPointerUp(): void {
    this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
    store.dispatch(updatePlayerMovement({ x: 0, y: 0 })); // Stop movement
  }
}
