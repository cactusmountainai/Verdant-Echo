declare module 'dexie' {
  import { Database } from 'dexie';
  
  export class Dexie extends Database {
    constructor(name: string);
    version(versionNumber: number, updater: (db: Database) => void): Dexie;
    tables: Record<string, Table<any, any>>;
  }
  
  export interface Table<T, K = any> {
    get(key: K): Promise<T | undefined>;
    put(item: T): Promise<K>;
    add(item: T): Promise<K>;
    delete(key: K): Promise<void>;
    clear(): Promise<void>;
    count(): Promise<number>;
    toArray(): Promise<T[]>;
    where(property: string): any;
    filter(filterFn: (item: T) => boolean): Promise<T[]>;
  }
  
  export function table<T, K = any>(name: string): Table<T, K>;
}
