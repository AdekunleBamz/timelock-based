/**
 * Custom hook for managing array state
 */

import { useState, useCallback } from 'react';

interface UseArrayReturn<T> {
  value: T[];
  push: (element: T) => void;
  filter: (callback: (element: T) => boolean) => void;
  update: (index: number, element: T) => void;
  remove: (index: number) => void;
  clear: () => void;
  set: (value: T[]) => void;
}

export function useArray<T>(initialValue: T[] = []): UseArrayReturn<T> {
  const [value, setValue] = useState<T[]>(initialValue);

  const push = useCallback((element: T) => {
    setValue(arr => [...arr, element]);
  }, []);

  const filter = useCallback((callback: (element: T) => boolean) => {
    setValue(arr => arr.filter(callback));
  }, []);

  const update = useCallback((index: number, element: T) => {
    setValue(arr => [
      ...arr.slice(0, index),
      element,
      ...arr.slice(index + 1),
    ]);
  }, []);

  const remove = useCallback((index: number) => {
    setValue(arr => [
      ...arr.slice(0, index),
      ...arr.slice(index + 1),
    ]);
  }, []);

  const clear = useCallback(() => {
    setValue([]);
  }, []);

  const set = useCallback((newValue: T[]) => {
    setValue(newValue);
  }, []);

  return { value, push, filter, update, remove, clear, set };
}
