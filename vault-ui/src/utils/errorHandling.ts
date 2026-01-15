/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class WalletError extends AppError {
  constructor(message: string, code?: string, details?: unknown) {
    super(message, code, details);
    this.name = 'WalletError';
    Object.setPrototypeOf(this, WalletError.prototype);
  }
}

export class TransactionError extends AppError {
  constructor(
    message: string,
    code?: string,
    public txHash?: string,
    details?: unknown
  ) {
    super(message, code, details);
    this.name = 'TransactionError';
    Object.setPrototypeOf(this, TransactionError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, code?: string, details?: unknown) {
    super(message, code, details);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    details?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Parse error and return user-friendly message
 */
export function parseError(error: unknown): {
  message: string;
  code?: string;
  details?: unknown;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    // Handle common blockchain errors
    if (error.message.includes('user rejected')) {
      return {
        message: 'Transaction was rejected',
        code: 'USER_REJECTED',
      };
    }

    if (error.message.includes('insufficient funds')) {
      return {
        message: 'Insufficient funds for transaction',
        code: 'INSUFFICIENT_FUNDS',
      };
    }

    if (error.message.includes('network')) {
      return {
        message: 'Network error occurred. Please check your connection',
        code: 'NETWORK_ERROR',
      };
    }

    if (error.message.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again',
        code: 'TIMEOUT',
      };
    }

    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Error handler for async functions
 */
export async function handleAsync<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as Error];
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
