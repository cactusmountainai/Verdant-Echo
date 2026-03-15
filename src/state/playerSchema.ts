export interface PlayerSchema {
  position: { x: number; y: number };
  speed: number;
  health: number;
  energy: number;
  gold: number;
  tools: string[];
  inventory: Record<string, number>;
  skills: {
    farming: number;
    mining: number;
    woodcutting: number;
  };
}
