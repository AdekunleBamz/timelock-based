/**
 * Enhanced local storage with type safety and expiration
 */

interface StorageItem<T> {
  value: T;
  expiry?: number;
}

/**
 * Type-safe local storage wrapper
 */
export class TypedStorage {
  /**
   * Set item with optional expiration
   */
  static set<T>(key: string, value: T, ttlMs?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        expiry: ttlMs ? Date.now() + ttlMs : undefined,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Get item from storage
   */
  static get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);

      // Check expiration
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove item
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clear all items
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Check if key exists
   */
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys
   */
  static keys(): string[] {
    return Object.keys(localStorage);
  }

  /**
   * Get storage size in bytes
   */
  static size(): number {
    return new Blob(Object.values(localStorage)).size;
  }
}

/**
 * Session storage wrapper
 */
export class TypedSessionStorage {
  static set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify({ value }));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);
      return item.value;
    } catch (error) {
      console.error('Failed to read from sessionStorage:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
    }
  }

  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
    }
  }

  static has(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }
}

/**
 * Storage keys (centralized)
 */
export const STORAGE_KEYS = {
  THEME: 'app_theme',
  WALLET_ADDRESS: 'wallet_address',
  USER_PREFERENCES: 'user_preferences',
  RECENT_TRANSACTIONS: 'recent_transactions',
  NOTIFICATION_SETTINGS: 'notification_settings',
  CACHED_DEPOSITS: 'cached_deposits',
  LAST_SYNC: 'last_sync',
  ANALYTICS_CONSENT: 'analytics_consent',
} as const;

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Migrate storage data (for versioning)
 */
export function migrateStorage(
  fromKey: string,
  toKey: string,
  transform?: (value: any) => any
): void {
  const oldValue = TypedStorage.get<any>(fromKey);
  if (oldValue !== null) {
    const newValue = transform ? transform(oldValue) : oldValue;
    TypedStorage.set(toKey, newValue);
    TypedStorage.remove(fromKey);
  }
}
