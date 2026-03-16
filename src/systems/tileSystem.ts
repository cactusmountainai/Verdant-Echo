import { TileState } from '../types/farm';
import { updateTile } from '../state/slices/farmSlice';

// Define valid transitions based on tool usage
const validTransitions: Map<string, Set<TileState>> = new Map([
  // Hoe transitions
  ['hoe', new Set(['tilled'])],
  // WateringCan transitions
  ['wateringCan', new Set(['watered', 'planted'])],
  // HarvestTool transitions
  ['harvestTool', new Set(['dead'])],
  // Automatic transitions (any tool or no tool allowed)
  ['', new Set(['planted', 'growing', 'harvestable', 'dead'])]
]);

/**
 * Validates if a transition from one tile state to another is allowed with the given tool
 * @param from - Current tile state
 * @param to - Target tile state
 * @param tool - Tool being used
 * @returns boolean indicating if transition is valid
 */
export function canTransition(from: TileState, to: TileState, tool: ToolType): boolean {
  // Special case: water cannot be applied to untilled tiles
  if (tool === ToolType.WATERING_CAN && from === 'untillled') {
    return false;
  }

  // Check if there's a specific rule for this tool
  const toolRules = validTransitions.get(tool);
  if (toolRules && toolRules.has(to)) {
    return true;
  }

  // Check for automatic transitions (any tool allowed)
  const autoRules = validTransitions.get('');
  if (autoRules && autoRules.has(to)) {
    return true;
  }

  // Default: transition not allowed
  return false;
}

/**
 * Applies a state transition to a tile if valid, otherwise does nothing
 * @param id - Tile ID to update
 * @param from - Current tile state
 * @param to - Target tile state
 * @param tool - Tool being used for the transition
 * @returns boolean indicating if transition was successful
 */
export function transition(id: string, from: TileState, to: TileState, tool: ToolType): boolean {
  // Validate transition before applying
  if (!canTransition(from, to, tool)) {
    return false;
  }

  // Dispatch the update action to change tile state
  updateTile({ id, newState: to });
  return true;
}
