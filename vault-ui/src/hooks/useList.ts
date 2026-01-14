import { useState, useCallback } from 'react';

interface ListState<T> {
  items: T[];
  add: (item: T) => void;
  remove: (index: number) => void;
  update: (index: number, item: T) => void;
  clear: () => void;
  set: (items: T[]) => void;
  filter: (predicate: (item: T) => boolean) => void;
  sort: (compareFn: (a: T, b: T) => number) => void;
}

/**
 * Hook for managing list state with common operations
 */
export function useList<T>(initialItems: T[] = []): ListState<T> {
  const [items, setItems] = useState<T[]>(initialItems);

  const add = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setItems((prev) => prev.map((existing, i) => (i === index ? item : existing)));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const set = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  const filter = useCallback((predicate: (item: T) => boolean) => {
    setItems((prev) => prev.filter(predicate));
  }, []);

  const sort = useCallback((compareFn: (a: T, b: T) => number) => {
    setItems((prev) => [...prev].sort(compareFn));
  }, []);

  return {
    items,
    add,
    remove,
    update,
    clear,
    set,
    filter,
    sort,
  };
}
