// Export types to be shared across modules
export interface PlayerState {
  inventory: Record<string, number>;
  tools: {
    axe: number;
    pickaxe: number;
  };
  level: number;
  xp: number;
}

export interface WorldState {
  season: string;
  day: number;
  time: number; // milliseconds (0–86400000)
  buildings: Record<string, any>;
}

export interface MetaState {
  unlocks: Record<string, boolean>;
  achievements: Record<string, boolean>;
  settings: Record<string, any>;
}

export interface GameState {
  player: PlayerState;
  world: WorldState;
  meta: MetaState;
}
