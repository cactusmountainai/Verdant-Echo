export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface WorldState {
  time: number; // total minutes elapsed since game start
  hour: number; // 0–23
  day: number;  // 1+
  season: Season;
}

export interface PlayerState {
  isAsleep: boolean;
  // ... other player fields ...
}

export interface GameState {
  world: WorldState;
  player: PlayerState;
}
