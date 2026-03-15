import { GameState } from '../state/types';
import { pako } from 'pako';
import { db } from './dexie';

const saveService = {
  async save(gameState: GameState): Promise<void> {
    const compressed = pako.gzip(JSON.stringify(gameState), { to: 'string' });
    await db.saveData.put({ 
      saveSlot: gameState.meta.saveSlot, 
      data: compressed 
    });
  },

  async load(saveSlot: 1 | 2 | 3): Promise<GameState | null> {
    try {
      const record = await db.saveData.where('saveSlot').equals(saveSlot).first();
      if (!record) return null;
      
      const decompressed = pako.ungzip(record.data, { to: 'string' });
      return JSON.parse(decompressed);
    } catch (error) {
      console.warn(`Corrupted or invalid save data for slot ${saveSlot}`, error);
      return null;
    }
  },

  async delete(saveSlot: 1 | 2 | 3): Promise<void> {
    const record = await db.saveData.where('saveSlot').equals(saveSlot).first();
    if (record) await db.saveData.delete(record.id);
  }
};

export { saveService };
