// Local character library. IndexedDB when available, in-memory otherwise
// (private windows, blocked storage), so the app always works.

import type { Character } from "../engine/index.ts";

const DB_NAME = "castmaker";
const STORE = "characters";
let dbPromise: Promise<IDBDatabase | null> | null = null;
const memory = new Map<string, Character>();

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function tx<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const t = db.transaction(STORE, mode);
      const store = t.objectStore(STORE);
      const out = fn(store);
      t.oncomplete = () => resolve(out ? out.result : undefined);
      t.onerror = () => reject(t.error);
    } catch (e) {
      reject(e);
    }
  });
}

export const storage = {
  persistent: false,

  async init(): Promise<boolean> {
    const db = await openDb();
    this.persistent = !!db;
    return this.persistent;
  },

  async list(): Promise<Character[]> {
    const db = await openDb();
    let items: Character[] | undefined;
    if (db) {
      try {
        items = await tx<Character[]>(db, "readonly", (s) => s.getAll());
      } catch {
        items = [...memory.values()];
      }
    } else items = [...memory.values()];
    return (items || []).sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
  },

  async save(character: Character): Promise<Character> {
    const c = { ...character, updated: new Date().toISOString() };
    memory.set(c.id, c);
    const db = await openDb();
    if (db) {
      try {
        await tx(db, "readwrite", (s) => s.put(c));
      } catch {
        /* memory copy kept */
      }
    }
    return c;
  },

  async remove(id: string): Promise<void> {
    memory.delete(id);
    const db = await openDb();
    if (db) {
      try {
        await tx(db, "readwrite", (s) => s.delete(id));
      } catch {
        /* ignore */
      }
    }
  },
};
