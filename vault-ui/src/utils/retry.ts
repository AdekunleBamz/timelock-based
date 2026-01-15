/**
 * Retry utilities for failed operations
 */

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Retry a function with configurable options
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    onRetry,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      const waitTime = backoff === 'exponential' 
        ? delay * Math.pow(2, attempt - 1)
        : delay * attempt;

      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}

/**
 * Retry specifically for transaction errors
 */
export async function retryTransaction<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  return retry(fn, {
    maxAttempts,
    delay: 2000,
    backoff: 'exponential',
    shouldRetry: (error: Error) => {
      const message = error.message.toLowerCase();
      // Retry on network errors, not on user rejection
      return !message.includes('user rejected') && 
             !message.includes('user denied');
    },
    onRetry: (attempt, error) => {
      console.log(`Transaction attempt ${attempt} failed:`, error.message);
    },
  });
}

/**
 * Circuit breaker pattern
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private resetTimeout: number = 30000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const now = Date.now();
      if (this.lastFailureTime && now - this.lastFailureTime > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  getState() {
    return this.state;
  }

  reset() {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = undefined;
  }
}

/**
 * Debounced retry - only retry after a period of inactivity
 */
export function debouncedRetry<T>(
  fn: () => Promise<T>,
  delay: number = 1000
): () => Promise<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let promise: Promise<T> | null = null;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!promise) {
      promise = new Promise<T>((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await fn();
            promise = null;
            resolve(result);
          } catch (error) {
            promise = null;
            reject(error);
          }
        }, delay);
      });
    }

    return promise;
  };
}
