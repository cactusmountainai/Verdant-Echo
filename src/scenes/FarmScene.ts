// Inside FarmScene.create():
this.joystick = this.input.plugins.get(Phaser.Input.Plugins.TouchPlugin).addJoystick(
  this.scale.width - 120,
  this.scale.height - 120,
  80, // radius
  'joystick' // texture key (optional)
);

// Add visual feedback: circular indicator
this.joystickIndicator = this.add.graphics();
this.joystickIndicator.lineStyle(2, 0xffffff, 0.5);
this.joystickIndicator.fillCircle(this.scale.width - 120, this.scale.height - 120, 80);

// Handle joystick movement via Redux
this.input.on('pointermove', (pointer) => {
  if (this.joystick.isDown && pointer.isTouching) {
    const centerX = this.scale.width - 120;
    const centerY = this.scale.height - 120;
    const deltaX = pointer.x - centerX;
    const deltaY = pointer.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Deadzone: ignore small movements
    if (distance > 5) {
      // Normalize to unit vector
      const normalizedX = deltaX / distance;
      const normalizedY = deltaY / distance;
      
      // Dispatch movement with speed multiplier for smoothness
      this.dispatch(movePlayer({ x: normalizedX * 0.1, y: normalizedY * 0.1 }));
    }
  }
});
