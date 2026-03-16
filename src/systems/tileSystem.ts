import { updateTile } from '../state/slices/farmSlice';
import { TileState, ToolType } from '../types/farm';

// Define transition rules: which states can be reached from a given tool
const transitionRules = new Map<ToolType, Set<TileState>>([
  ['hoe', new Set(['tilled'])], // hoe can only turn untilled → tilled
  ['wateringCan', new Set(['watered', 'planted', 'growing'])], // wateringCan can water tilled, planted, or growing
  ['harvestTool', new Set(['harvestable'])] // harvestTool can only harvest harvestable
]);

/**
 * Validates if a state transition is allowed based on the tool used.
 * @param from - current tile state
 * @param to - target tile state
 * @param tool - tool being used
 * @returns boolean indicating if transition is valid
 */
export function canTransition(from: TileState, to: TileState, tool: ToolType): boolean {
  // Special case: wateringCan cannot be used on untilled tiles
  if (tool === 'wateringCan' && from === 'untilled') {
    return false;
  }

  // Check if the target state is allowed by the tool's rules
  const allowedTargets = transitionRules.get(tool);
  if (!allowedTargets) {
    return false;
  }
  
  return allowedTargets.has(to);
}

/**
 * Applies a state transition to a tile and dispatches the update action.
 * @param id - tile identifier
 * @param from - current state of the tile
 * @param to - target state
 * @param tool - tool being used to trigger the transition
 * @returns boolean indicating if transition was successful
 */
export function transition(id: string, from: TileState, to: TileState, tool: ToolType): boolean {
  // Validate transition before applying
  if (!canTransition(from, to, tool)) {
    return false;
  }

  // Dispatch the update action to Redux store
  updateTile({ id, newState: to });
  
  return true;
}
