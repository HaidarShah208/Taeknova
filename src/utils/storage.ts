import { safeJsonParse } from '@utils/misc';

export interface TypedStorage {
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

function createTypedStorage(storage: Storage): TypedStorage {
  return {
    get<T>(key: string, fallback: T): T {
      try {
        return safeJsonParse<T>(storage.getItem(key), fallback);
      } catch {
        return fallback;
      }
    },
    set<T>(key: string, value: T): void {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch {
        /* swallow quota errors */
      }
    },
    remove(key: string): void {
      try {
        storage.removeItem(key);
      } catch {
        /* noop */
      }
    },
    clear(): void {
      try {
        storage.clear();
      } catch {
        /* noop */
      }
    },
  };
}

const memoryStorageMap = new Map<string, string>();
const memoryStorage: Storage = {
  get length() {
    return memoryStorageMap.size;
  },
  clear() {
    memoryStorageMap.clear();
  },
  getItem(key) {
    return memoryStorageMap.get(key) ?? null;
  },
  key(index) {
    return Array.from(memoryStorageMap.keys())[index] ?? null;
  },
  removeItem(key) {
    memoryStorageMap.delete(key);
  },
  setItem(key, value) {
    memoryStorageMap.set(key, value);
  },
};

const isBrowser = typeof window !== 'undefined';

export const localStore: TypedStorage = createTypedStorage(
  isBrowser ? window.localStorage : memoryStorage,
);
export const sessionStore: TypedStorage = createTypedStorage(
  isBrowser ? window.sessionStorage : memoryStorage,
);
