/**
 * Event emitter for application-wide events
 */

type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, EventCallback[]> = new Map();

  /**
   * Subscribe to an event
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const callbacks = this.events.get(event)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event (fires once then unsubscribes)
   */
  once(event: string, callback: EventCallback): () => void {
    const wrappedCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, wrappedCallback);
    };

    return this.on(event, wrappedCallback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (!callbacks) return;

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }

    if (callbacks.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * Emit an event
   */
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (!callbacks) return;

    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.length || 0;
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

/**
 * Global event emitter instance
 */
export const eventEmitter = new EventEmitter();

/**
 * Application-specific event types
 */
export const AppEvents = {
  WALLET_CONNECTED: 'wallet:connected',
  WALLET_DISCONNECTED: 'wallet:disconnected',
  WALLET_CHANGED: 'wallet:changed',
  NETWORK_CHANGED: 'network:changed',
  TRANSACTION_PENDING: 'transaction:pending',
  TRANSACTION_CONFIRMED: 'transaction:confirmed',
  TRANSACTION_FAILED: 'transaction:failed',
  DEPOSIT_CREATED: 'deposit:created',
  DEPOSIT_WITHDRAWN: 'deposit:withdrawn',
  DEPOSIT_EMERGENCY: 'deposit:emergency',
  BALANCE_UPDATED: 'balance:updated',
  ERROR_OCCURRED: 'error:occurred',
  NOTIFICATION_ADDED: 'notification:added',
  THEME_CHANGED: 'theme:changed',
} as const;

export type AppEventType = typeof AppEvents[keyof typeof AppEvents];
