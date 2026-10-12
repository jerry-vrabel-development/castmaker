// Local character library. IndexedDB when available, in-memory otherwise
// (private windows, blocked storage), so the app always works.

const DB_NAME = "castmaker";
const STORE = "characters";
let dbPromise = null;
const memory = new Map();

function openDb() {
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

function tx(db, mode, fn) {
  return new Promise((resolve, reject) => {
    try {
      const t = db.transaction(STORE, mode);
      const store = t.objectStore(STORE);
      const out = fn(store);
      t.oncomplete = () => resolve(out?.result ?? out);
      t.onerror = () => reject(t.error);
    } catch (e) {
      reject(e);
    }
  });
}

export const storage = {
  persistent: false,

  async init() {
    const db = await openDb();
    this.persistent = !!db;
    return this.persistent;
  },

  async list() {
    const db = await openDb();
    let items;
    if (db) {
      try { items = await tx(db, "readonly", (s) => s.getAll()); } catch { items = [...memory.values()]; }
    } else items = [...memory.values()];
    return (items || []).sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
  },

  async save(character) {
    const c = { ...character, updated: new Date().toISOString() };
    memory.set(c.id, c);
    const db = await openDb();
    if (db) { try { await tx(db, "readwrite", (s) => s.put(c)); } catch { /* memory copy kept */ } }
    return c;
  },

  async remove(id) {
    memory.delete(id);
    const db = await openDb();
    if (db) { try { await tx(db, "readwrite", (s) => s.delete(id)); } catch { /* ignore */ } }
  },
};
