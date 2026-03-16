import { TileState, ToolType } from '../types/farm';
import { updateTile } from '../state/slices/farmSlice';
import { store } from '../store';

export function canTransition(from: TileState, to: TileState, tool: ToolType): boolean {
  // Define valid transitions based on tool usage
  const validTransitions: Record<TileState, Record<TileState, ToolType[]>> = {
    untilled: {
      tilled: ['hoe'],
    },
    tilled: {
      watered: ['wateringCan'],
      planted: ['hoe'], // Assuming hoe can also plant (or we might need a separate planting tool)
    },
    watered: {
      planted: ['wateringCan'],
    },
    planted: {
      growing: [], // Automatic transition after time, no tool needed
    },
    growing: {
      harvestable: [], // Automatic transition after time, no tool needed
    },
    harvestable: {
      untilled: ['harvestTool'], // Harvest and return to untilled state
    },
    dead: {}, // No transitions from dead state
  };

  if (!validTransitions[from]) {
    return false;
  }

  const validToStates = validTransitions[from];
  if (!validToStates[to]) {
    return false;
  }

  return validToStates[to].includes(tool);
}

export function transition(id: string, from: TileState, to: TileState, tool: ToolType): boolean {
  if (canTransition(from, to, tool)) {
    store.dispatch(updateTile({ id, newState: to }));
    return true;
  }
  return false;
}
