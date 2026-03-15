import { Dexie } from 'dexie';

export const db = new Dexie('FarmGame');

db.version(1).stores({
  saves: '++id, saveSlot',
  saveData: 'saveSlot', // primary key is saveSlot (1, 2, or 3)
  settings: '++id',
  unlocks: '++id',
  achievements: '++id'
});

export const SaveDataService = {
  async get(saveSlot: number) {
    return db.saveData.get(saveSlot);
  },

  async put(saveSlot: number, data: { time: unknown; inventory: Record<string, number> }) {
    await db.saveData.put({ saveSlot, ...data });
  },

  async delete(saveSlot: number) {
    await db.saveData.delete(saveSlot);
  }
};
