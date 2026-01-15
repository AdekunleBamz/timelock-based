/**
 * Rate limiting utility
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if action is allowed
   */
  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];

    // Filter out old requests outside the window
    timestamps = timestamps.filter(ts => ts > windowStart);

    // Check if limit exceeded
    if (timestamps.length >= config.maxRequests) {
      return false;
    }

    // Add current request
    timestamps.push(now);
    this.requests.set(key, timestamps);

    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string, config: RateLimitConfig): number {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    const timestamps = this.requests.get(key) || [];
    const validRequests = timestamps.filter(ts => ts > windowStart);

    return Math.max(0, config.maxRequests - validRequests.length);
  }

  /**
   * Get time until next request is allowed
   */
  getTimeUntilReset(key: string, config: RateLimitConfig): number {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    const timestamps = this.requests.get(key) || [];
    const validRequests = timestamps.filter(ts => ts > windowStart);

    if (validRequests.length < config.maxRequests) {
      return 0;
    }

    const oldestRequest = Math.min(...validRequests);
    return Math.max(0, oldestRequest + config.windowMs - now);
  }

  /**
   * Reset rate limit for key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();

// Common rate limit presets
export const RATE_LIMITS = {
  // API calls
  API_CALLS: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 per minute
  
  // Transaction submissions
  TRANSACTIONS: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  
  // Data refreshes
  REFRESH: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  
  // Export operations
  EXPORTS: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
};
