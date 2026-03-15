import { update as updateTime } from '../systems/timeSystem';

export class FarmScene extends Phaser.Scene {
  update(time, delta) {
    // ... existing joystick + player sync logic ...
    updateTime(); // ← Already correctly imported and called
  }
}
