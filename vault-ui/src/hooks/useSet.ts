import { useState, useCallback } from 'react';

export function useSet<T>(initialSet: Set<T> = new Set()) {
  const [set, setSet] = useState(initialSet);

  const add = useCallback((value: T) => {
    setSet((prev) => new Set(prev).add(value));
  }, []);

  const remove = useCallback((value: T) => {
    setSet((prev) => {
      const newSet = new Set(prev);
      newSet.delete(value);
      return newSet;
    });
  }, []);

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  }, []);

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  const reset = useCallback(() => {
    setSet(initialSet);
  }, [initialSet]);

  return {
    set,
    add,
    remove,
    toggle,
    clear,
    reset,
    size: set.size,
    has: (value: T) => set.has(value),
  };
}
