import { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook for handling async operations with loading/error states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const execute = useCallback(async () => {
    setState({
      data: null,
      error: null,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    try {
      const data = await asyncFunction();
      setState({
        data,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setState({
        data: null,
        error,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}
