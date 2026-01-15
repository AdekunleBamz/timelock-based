/**
 * Analytics service
 * Tracks user interactions and events
 */

export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean = false;

  constructor() {
    this.enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  }

  /**
   * Track event
   */
  track(name: string, category: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    this.track('page_view', 'navigation', { path, title });
  }

  /**
   * Track wallet connection
   */
  walletConnected(address: string, walletType: string): void {
    this.track('wallet_connected', 'wallet', { address, walletType });
  }

  /**
   * Track deposit creation
   */
  depositCreated(amount: string, lockDuration: number): void {
    this.track('deposit_created', 'transaction', { amount, lockDuration });
  }

  /**
   * Track withdrawal
   */
  withdrawalCompleted(amount: string, isEmergency: boolean): void {
    this.track('withdrawal_completed', 'transaction', { amount, isEmergency });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: string): void {
    this.track('error_occurred', 'error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear events
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Send event to analytics provider
   */
  private sendToAnalytics(event: AnalyticsEvent): void {
    // In production, this would send to your analytics provider
    // e.g., Google Analytics, Mixpanel, Amplitude, etc.
    console.log('[Analytics]', event);
  }
}

export const analytics = new AnalyticsService();
