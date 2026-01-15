/**
 * Analytics and event tracking
 */

import { env } from '../config/env';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  private enabled: boolean;

  constructor() {
    this.enabled = env.ENABLE_ANALYTICS && !env.ENABLE_DEBUG_MODE;
  }

  /**
   * Track a page view
   */
  pageView(path: string, title?: string) {
    if (!this.enabled) return;

    console.log(`[Analytics] Page View: ${path}`, title);
    
    // Integration with analytics services (Google Analytics, Plausible, etc.)
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_path: path,
    //   page_title: title,
    // });
  }

  /**
   * Track an event
   */
  event(event: AnalyticsEvent) {
    if (!this.enabled) return;

    console.log('[Analytics] Event:', event);

    // Integration with analytics services
    // gtag('event', event.action, {
    //   event_category: event.category,
    //   event_label: event.label,
    //   value: event.value,
    // });
  }

  /**
   * Track wallet connection
   */
  trackWalletConnect(address: string, chainId: number) {
    this.event({
      category: 'Wallet',
      action: 'Connect',
      label: `Chain: ${chainId}`,
    });
  }

  /**
   * Track deposit creation
   */
  trackDeposit(amount: number, duration: number) {
    this.event({
      category: 'Vault',
      action: 'Deposit',
      label: `Duration: ${duration}s`,
      value: Math.floor(amount),
    });
  }

  /**
   * Track withdrawal
   */
  trackWithdraw(depositId: number, isEmergency: boolean = false) {
    this.event({
      category: 'Vault',
      action: isEmergency ? 'Emergency Withdraw' : 'Withdraw',
      label: `Deposit ID: ${depositId}`,
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: string) {
    this.event({
      category: 'Error',
      action: error.name,
      label: context ? `${context}: ${error.message}` : error.message,
    });
  }

  /**
   * Track performance metrics
   */
  trackTiming(category: string, variable: string, time: number) {
    if (!this.enabled) return;

    console.log(`[Analytics] Timing: ${category}.${variable} = ${time}ms`);

    // gtag('event', 'timing_complete', {
    //   name: variable,
    //   value: time,
    //   event_category: category,
    // });
  }

  /**
   * Set user properties
   */
  setUserProperty(name: string, value: string | number) {
    if (!this.enabled) return;

    console.log(`[Analytics] User Property: ${name} = ${value}`);

    // gtag('set', 'user_properties', {
    //   [name]: value,
    // });
  }
}

export const analytics = new Analytics();
