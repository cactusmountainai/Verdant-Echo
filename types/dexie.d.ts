// Minimal declaration for Dexie.js (IndexedDB wrapper)
// Dexie exports a single class: Dexie. Use it via new Dexie('name').table('store').
// DO NOT mock Version or Database interfaces — they are internal.
// Installed via: npm install dexie
// If @types/dexie exists, prefer it. This is only for when types are missing.

declare class Dexie {
  constructor(name: string);
  open(): Promise<void>;
  close(): Promise<void>;
  table<T>(name: string): Dexie.Table<T, any>;
}

namespace Dexie {
  interface Table<T, K> {
    add(item: T): Promise<K>;
    bulkAdd(items: T[]): Promise<K[]>;
    get(key: K): Promise<T | undefined>;
    where(condition: any): any; // Simplified for minimal use
    toArray(): Promise<T[]>;
  }
}

export = Dexie;
