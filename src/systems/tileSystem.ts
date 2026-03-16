import { updateTile } from '../state/slices/farmSlice';
import { TileState, ToolType } from '../types/farm';

// Define valid transitions per tool
const validTransitions = new Map<ToolType, Set<TileState>>([
  [
    ToolType.HOE,
    new Set(['tilled'])
  ],
  [
    ToolType.WATERING_CAN,
    new Set(['watered', 'planted'])
  ],
  [
    ToolType.HARVEST_TOOL,
    new Set(['dead'])
  ]
]);

/**
 * Validates if a transition from one tile state to another is allowed with the given tool
 * @param from - current tile state
 * @param to - target tile state
 * @param tool - tool being used
 * @returns boolean indicating if transition is valid
 */
export function canTransition(from: TileState, to: TileState, tool: ToolType): boolean {
  // Watering can cannot be used on untilled tiles (explicit rejection per acceptance criteria)
  if (tool === ToolType.WATERING_CAN && from === 'untilled') {
    return false;
  }

  // Get allowed target states for this tool
  const allowedTargets = validTransitions.get(tool);
  
  // If tool has no defined transitions, deny
  if (!allowedTargets) {
    return false;
  }
  
  // Check if target state is in the allowed set
  return allowedTargets.has(to);
}

/**
 * Attempts to transition a tile from its current state to a new state using a tool
 * Dispatches updateTile action if transition is valid
 * @param id - tile ID
 * @param fromState - current tile state
 * @param newState - target tile state
 * @param tool - tool being used
 * @returns boolean indicating if transition was successful
 */
export function transition(id: string, fromState: TileState, newState: TileState, tool: ToolType): boolean {
  // Check if transition is valid using the validation logic
  if (!canTransition(fromState, newState, tool)) {
    return false;
  }
  
  // Dispatch update action to Redux store
  updateTile({ id, newState });
  
  return true;
}
