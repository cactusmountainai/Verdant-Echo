import { TileState, ToolType } from '../types/farm';
import { updateTile } from '../state/slices/farmSlice';

// Define valid transitions based on tool usage
const validTransitions: Record<string, Record<string, ToolType[]>> = {
  untilled: {
    tilled: ['hoe'],
  },
  tilled: {
    watered: ['wateringCan'],
    planted: ['hoe'], // hoe can be used to plant (as per common farm mechanics)
  },
  watered: {
    planted: ['wateringCan'],
    growing: [], // automatic transition
  },
  planted: {
    growing: [], // automatic transition
  },
  growing: {
    harvestable: [], // automatic transition
  },
  harvestable: {},
  dead: {},
};

export function canTransition(from: TileState, to: TileState, tool: ToolType): boolean {
  if (!validTransitions[from] || !validTransitions[from][to]) {
    return false;
  }
  
  const allowedTools = validTransitions[from][to];
  // If no tools required (automatic transition), any tool or none is fine
  if (allowedTools.length === 0) {
    return true;
  }
  
  return allowedTools.includes(tool);
}

export function transition(id: string, from: TileState, to: TileState, tool: ToolType): void {
  if (canTransition(from, to, tool)) {
    updateTile({ id, newState: to });
  }
}
