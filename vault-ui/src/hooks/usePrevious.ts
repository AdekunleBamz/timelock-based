import { useRef, useEffect } from 'react';

/**
 * Hook that returns the previous value of a variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook that returns whether a value has changed since last render
 */
export function useHasChanged<T>(value: T): boolean {
  const previousValue = usePrevious(value);
  return previousValue !== value;
}
