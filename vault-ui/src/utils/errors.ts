/**
 * Error handling utilities
 */

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Known error codes
 */
export const ErrorCodes = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_FAILED: 'WALLET_CONNECTION_FAILED',
  USER_REJECTED: 'USER_REJECTED',
  WRONG_NETWORK: 'WRONG_NETWORK',
  
  // Transaction errors
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_REVERTED: 'TRANSACTION_REVERTED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INSUFFICIENT_ALLOWANCE: 'INSUFFICIENT_ALLOWANCE',
  
  // Vault errors
  DEPOSIT_LOCKED: 'DEPOSIT_LOCKED',
  DEPOSIT_NOT_FOUND: 'DEPOSIT_NOT_FOUND',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  MIN_AMOUNT_NOT_MET: 'MIN_AMOUNT_NOT_MET',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  RPC_ERROR: 'RPC_ERROR',
  
  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Create a standardized error object
 */
export function createError(code: ErrorCode, message: string, details?: unknown): AppError {
  return { code, message, details };
}

/**
 * Parse error from various sources (ethers, MetaMask, etc.)
 */
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (isAppError(error)) {
    return error;
  }

  // Ethers error
  if (hasProperty(error, 'code')) {
    const ethersError = error as { code: string; reason?: string; message?: string };
    
    if (ethersError.code === 'ACTION_REJECTED' || ethersError.code === 'REJECTED') {
      return createError(ErrorCodes.USER_REJECTED, 'Transaction was rejected by user');
    }
    
    if (ethersError.code === 'INSUFFICIENT_FUNDS') {
      return createError(ErrorCodes.INSUFFICIENT_FUNDS, 'Insufficient funds for transaction');
    }
    
    if (ethersError.code === 'CALL_EXCEPTION') {
      return createError(
        ErrorCodes.TRANSACTION_REVERTED,
        ethersError.reason ?? 'Transaction reverted',
        error
      );
    }
    
    if (ethersError.code === 'NETWORK_ERROR') {
      return createError(ErrorCodes.NETWORK_ERROR, 'Network connection error');
    }
  }

  // MetaMask error
  if (hasProperty(error, 'code') && typeof (error as { code: unknown }).code === 'number') {
    const metaMaskError = error as { code: number; message?: string };
    
    if (metaMaskError.code === 4001) {
      return createError(ErrorCodes.USER_REJECTED, 'Request was rejected by user');
    }
    
    if (metaMaskError.code === 4902) {
      return createError(ErrorCodes.WRONG_NETWORK, 'Please switch to the correct network');
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return createError(ErrorCodes.UNKNOWN_ERROR, error.message, error);
  }

  // String
  if (typeof error === 'string') {
    return createError(ErrorCodes.UNKNOWN_ERROR, error);
  }

  return createError(ErrorCodes.UNKNOWN_ERROR, 'An unexpected error occurred', error);
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: AppError | unknown): string {
  const appError = isAppError(error) ? error : parseError(error);
  return appError.message;
}

/**
 * Type guard for AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Helper to check if object has property
 */
function hasProperty<K extends string>(obj: unknown, key: K): obj is { [P in K]: unknown } {
  return typeof obj === 'object' && obj !== null && key in obj;
}
