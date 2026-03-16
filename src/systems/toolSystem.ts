import { store } from '../../state/store';
import { TileState, ToolType } from '../../types/farm';
import { transition } from './tileSystem';

export function useTool(toolId: string, tileX: number, tileY: number): void {
  const state = store.getState();
  
  // Check energy
  if (state.energy.value < 5) {
    return; // Not enough energy
  }
  
  // Consume 5 energy immediately
  store.dispatch({ type: 'energy/decrement', payload: 5 });
  
  const currentTileState = state.farm.tiles[tileY]?.[tileX];
  if (!currentTileState) return;
  
  // Handle tool-specific transitions
  switch (toolId) {
    case ToolType.HOE:
      if (currentTileState === TileState.UNTILLED) {
        transition(tileX, tileY, TileState.UNTILLED, TileState.TILLED);
      }
      break;
      
    case ToolType.WATERING_CAN:
      if (currentTileState === TileState.TILLED) {
        transition(tileX, tileY, TileState.TILLED, TileState.WATERED);
      }
      break;
      
    case ToolType.HARVEST_TOOL: // Note: Harvest tool isn't mentioned in requirements but included per enum
      // No transition defined for harvest tool in requirements
      break;
      
    default:
      // Assume any other toolId is a seed planting action
      if (
        (currentTileState === TileState.TILLED || currentTileState === TileState.WATERED)
      ) {
        // Check inventory has seeds
        if (state.player.inventory.seeds > 0) {
          // Consume one seed
          store.dispatch({ type: 'player/removeItemFromInventory', payload: { item: 'seeds', count: 1 } });
          // Transition to planted state
          transition(tileX, tileY, currentTileState, TileState.PLANTED);
        }
      }
      break;
  }
}
