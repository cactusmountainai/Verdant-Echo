declare module 'pako' {
  export interface InflateOptions {
    windowBits?: number;
    to?: 'string' | 'arraybuffer' | 'uint8array';
  }
  
  export interface DeflateOptions {
    level?: number;
    windowBits?: number;
    memLevel?: number;
    strategy?: number;
    dictionary?: Uint8Array;
  }
  
  export function inflate(input: Uint8Array | ArrayBuffer, options?: InflateOptions): Uint8Array;
  export function deflate(input: Uint8Array | ArrayBuffer, options?: DeflateOptions): Uint8Array;
}
