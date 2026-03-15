export interface MetaSchema {
  unlockedAreas: string[];
  achievements: Record<string, boolean>;
  totalPlaytime: number; // in milliseconds
  saveSlotCount: number;
  lastSaveTimestamp: number | null;
}
