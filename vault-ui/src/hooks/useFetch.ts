import { useState, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseFetchOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export function useFetch<T = unknown>(defaultOptions?: UseFetchOptions) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (url: string, options?: RequestInit & UseFetchOptions): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const controller = new AbortController();
      const timeout = options?.timeout ?? defaultOptions?.timeout ?? 30000;
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...defaultOptions?.headers,
            ...options?.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as T;
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setState({ data: null, loading: false, error });
        return null;
      }
    },
    [defaultOptions?.headers, defaultOptions?.timeout]
  );

  const get = useCallback(
    (url: string, options?: UseFetchOptions) => fetchData(url, { method: 'GET', ...options }),
    [fetchData]
  );

  const post = useCallback(
    (url: string, body: unknown, options?: UseFetchOptions) =>
      fetchData(url, { method: 'POST', body: JSON.stringify(body), ...options }),
    [fetchData]
  );

  const put = useCallback(
    (url: string, body: unknown, options?: UseFetchOptions) =>
      fetchData(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
    [fetchData]
  );

  const del = useCallback(
    (url: string, options?: UseFetchOptions) => fetchData(url, { method: 'DELETE', ...options }),
    [fetchData]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    fetch: fetchData,
    get,
    post,
    put,
    delete: del,
    reset,
  };
}
