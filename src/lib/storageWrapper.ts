const testKey = '______TESTING_____';

export function storageFactory(keyFactory: (name: string) => string, storage?: Storage) {
  let inMemoryStorage: { [key: string]: string } = {};
  const length = 0;
  let isSupported: boolean | undefined;

  try {
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    isSupported = true;
  } catch (e) {
    isSupported = false;
  }

  function clear(): void {
    if (isSupported) storage.clear();
    else inMemoryStorage = {};
  }

  function getItem(name: string): string | null {
    const k = keyFactory(name);
    if (isSupported) return storage.getItem(k);
    if (k in inMemoryStorage) return inMemoryStorage[k];
    return null;
  }

  function key(index: number): string | null {
    if (isSupported) return storage.key(index);
    else return Object.keys(inMemoryStorage)[index] || null;
  }

  function removeItem(name: string): void {
    const k = keyFactory(name);
    if (isSupported) storage.removeItem(k);
    else delete inMemoryStorage[k];
  }

  function setItem(name: string, value: string): void {
    const k = keyFactory(name);
    if (isSupported) storage.setItem(k, value);
    else inMemoryStorage[k] = String(value);
  }

  function getJson(name: string) {
    try {
      return JSON.parse(getItem(name));
    } catch (e) {
      return null;
    }
  }

  function setJson(name: string, value: any) {
    return setItem(name, JSON.stringify(value));
  }

  return {
    getItem,
    getJson,
    setItem,
    setJson,
    removeItem,
    clear,
    key,
    length,
  } as Storage;
}
