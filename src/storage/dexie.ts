import Dexie from 'dexie';

// Define exact schema matching Redux state
export const db = new Dexie('FarmGame');

db.version(1).stores({
  saveData: `
    ++id,
    saveSlot,           // 1,2,3 — primary key for saves
    timestamp,          // Date string
    state               // FULL serialized GameState (stringified JSON)
  `,
});

// Type the DB properly
export type SaveData = {
  id?: number;
  saveSlot: 1 | 2 | 3;
  timestamp: string;
  state: string; // JSON.stringify(GameState)
};

// Import GameState to ensure type safety in methods
export type GameState = {
  player: {
    position: { x: number; y: number };
    health: number;
    inventory: Record<string, number>;
  };
  world: {
    timeOfDay: 'day' | 'night';
    biome: string;
    entities: any[]; // Entity[] — we don't need full Entity definition here
  };
  meta: {
    score: number;
    level: number;
    isPaused: boolean;
  };
};

// Export typed interface for safe usage
export const SaveDataService = {
  async save(saveSlot: 1 | 2 | 3, gameState: GameState): Promise<void> {
    await db.saveData.put({
      saveSlot,
      timestamp: new Date().toISOString(),
      state: JSON.stringify(gameState),
    });
  },

  async load(saveSlot: 1 | 2 | 3): Promise<GameState | null> {
    const record = await db.saveData.get({ saveSlot });
    return record ? JSON.parse(record.state) : null;
  },

  async delete(saveSlot: 1 | 2 | 3): Promise<void> {
    await db.saveData.delete(saveSlot);
  },
};
