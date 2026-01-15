/**
 * Custom hook for managing contract interactions
 */

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { logger } from '../utils/logger';

export function useContract(
  contract: ethers.Contract | null
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T = any>(
    method: string,
    args: any[] = [],
    options: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<T | null> => {
    if (!contract) {
      const error = new Error('Contract not initialized');
      setError(error);
      options.onError?.(error);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await contract[method](...args);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      logger.error(`Contract method ${method} failed:`, error);
      setError(error);
      options.onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const call = useCallback(async <T = any>(
    method: string,
    args: any[] = []
  ): Promise<T | null> => {
    if (!contract) {
      return null;
    }

    try {
      return await contract[method](...args);
    } catch (err) {
      logger.error(`Contract call ${method} failed:`, err);
      return null;
    }
  }, [contract]);

  return {
    execute,
    call,
    loading,
    error,
  };
}
