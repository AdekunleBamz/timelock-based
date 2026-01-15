/**
 * Optimistic updates manager
 * Provides immediate UI feedback before blockchain confirmation
 */

interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
  revert?: () => void;
}

class OptimisticManager {
  private updates: Map<string, OptimisticUpdate<any>> = new Map();
  private listeners: Set<() => void> = new Set();

  /**
   * Add optimistic update
   */
  add<T>(id: string, data: T, revert?: () => void): void {
    this.updates.set(id, {
      id,
      data,
      timestamp: Date.now(),
      revert,
    });
    this.notify();
  }

  /**
   * Confirm and remove optimistic update
   */
  confirm(id: string): void {
    this.updates.delete(id);
    this.notify();
  }

  /**
   * Revert optimistic update
   */
  revert(id: string): void {
    const update = this.updates.get(id);
    if (update?.revert) {
      update.revert();
    }
    this.updates.delete(id);
    this.notify();
  }

  /**
   * Get optimistic update by ID
   */
  get<T>(id: string): T | null {
    return this.updates.get(id)?.data || null;
  }

  /**
   * Check if update exists
   */
  has(id: string): boolean {
    return this.updates.has(id);
  }

  /**
   * Clear all updates
   */
  clear(): void {
    this.updates.clear();
    this.notify();
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const optimisticManager = new OptimisticManager();
