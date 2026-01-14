import { useState, useCallback } from 'react';

export function useMap<K, V>(initialMap: Map<K, V> = new Map()) {
  const [map, setMap] = useState(initialMap);

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  }, []);

  const remove = useCallback((key: K) => {
    setMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const clear = useCallback(() => {
    setMap(new Map());
  }, []);

  const reset = useCallback(() => {
    setMap(initialMap);
  }, [initialMap]);

  return {
    map,
    set,
    remove,
    clear,
    reset,
    size: map.size,
    has: (key: K) => map.has(key),
    get: (key: K) => map.get(key),
  };
}
