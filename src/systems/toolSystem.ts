import { store } from '../state/store';
import { transition } from './tileSystem';
import { ToolType, TileState } from '../state/types';

/**
 * Uses a tool on a specific tile, consuming energy and updating tile state
 * @param toolId - Type of tool being used (hoe, wateringCan, seeds)
 * @param tileX - X coordinate of the target tile
 * @param tileY - Y coordinate of the target tile
 */
export function useTool(toolId: ToolType, tileX: number, tileY: number): void {
  const state = store.getState();
  const { energy } = state.energy;
  const { inventory } = state.player;

  // Check if player has enough energy (5 per use)
  if (energy < 5) {
    return; // Not enough energy to use tool
  }

  // Dispatch energy reduction
  store.dispatch({ type: 'energy/decrement', payload: 5 });

  let canProceed = true;
  let newState: TileState | null = null;

  switch (toolId) {
    case ToolType.HOE:
      // Hoe: untilled → tilled
      if (!transition(tileX, tileY, TileState.UNTILLED, TileState.TILLED)) {
        return; // Cannot transition to tilled state
      }
      newState = TileState.TILLED;
      break;

    case ToolType.WATERING_CAN:
      // WateringCan: tilled → watered
      if (!transition(tileX, tileY, TileState.TILLED, TileState.WATERED)) {
        return; // Cannot transition to watered state
      }
      newState = TileState.WATERED;
      break;

    case ToolType.SEEDS:
      // Seeds: tilled or watered → planted (consume 1 seed)
      const hasSeeds = inventory.seeds && inventory.seeds > 0;
      if (!hasSeeds) {
        return; // No seeds in inventory
      }

      // Check if tile is either tilled or watered
      const currentTileState = state.farm.tiles[tileY]?.[tileX]?.state;
      if (
        currentTileState !== TileState.TILLED && 
        currentTileState !== TileState.WATERED
      ) {
        return; // Can only plant on tilled or watered tiles
      }

      // Consume one seed from inventory
      store.dispatch({ type: 'player/removeItemFromInventory', payload: { item: 'seeds', amount: 1 } });
      
      newState = TileState.PLANTED;
      transition(tileX, tileY, currentTileState as TileState, newState);
      break;

    default:
      return; // Unknown tool
  }

  // If we have a valid new state and animation is needed, trigger it
  // Note: Animation handling must be done in the Phaser scene (FarmScene.ts)
  // This system only handles state changes and resource consumption
  // The Phaser sprite animation should be triggered by the scene after this function call
  
  // For completeness, we assume FarmScene will handle animation based on toolId and tile position
}
