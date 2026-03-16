// Minimal declaration for pako library (gzip compression)
// pako is a UMD module that exports functions directly on the module object.
// DO NOT use named exports — use export = to match its actual runtime behavior.
// Installed via: npm install pako
// If @types/pako exists, prefer it. This is only for when types are missing.

declare function inflate(data: Uint8Array | ArrayBuffer, options?: { raw?: boolean; to?: string }): Uint8Array;
declare function deflate(data: Uint8Array | ArrayBuffer, options?: {
  level?: number;
  windowBits?: number;
  memLevel?: number;
  strategy?: number;
  chunkSize?: number;
  raw?: boolean;
  to?: string;
}): Uint8Array;

export = { inflate, deflate };
