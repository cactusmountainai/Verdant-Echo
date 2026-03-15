import { saveService } from '../storage/saveService';
import { store } from '../store';

export class FarmScene {
  private hasSavedOnSleep: boolean = false;

  update() {
    const state = store.getState();
    this.playerSprite.setPosition(state.player.x, state.player.y);

    // Auto-save to slot 1 when player falls asleep (only once per sleep session)
    if (state.player.isAsleep && !this.hasSavedOnSleep) {
      saveService.saveGameState(1);
      this.hasSavedOnSleep = true;
    }

    // Reset flag when player wakes up
    if (!state.player.isAsleep) {
      this.hasSavedOnSleep = false;
    }
  }
}
