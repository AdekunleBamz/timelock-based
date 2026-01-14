import { useState, useMemo, useCallback } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

interface UseSortOptions<T> {
  initialSortKey?: keyof T;
  initialDirection?: SortDirection;
}

export function useSort<T>(items: T[], options: UseSortOptions<T> = {}) {
  const { initialSortKey = null, initialDirection = 'asc' } = options;

  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: initialSortKey,
    direction: initialDirection,
  });

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;

    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortConfig.key, sortConfig.direction]);

  const sort = useCallback((key: keyof T) => {
    setSortConfig((current) => {
      // If same key, toggle direction
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // New key, default to ascending
      return { key, direction: 'asc' };
    });
  }, []);

  const setDirection = useCallback((direction: SortDirection) => {
    setSortConfig((current) => ({ ...current, direction }));
  }, []);

  const clearSort = useCallback(() => {
    setSortConfig({ key: null, direction: 'asc' });
  }, []);

  return {
    items: sortedItems,
    sortKey: sortConfig.key,
    direction: sortConfig.direction,
    sort,
    setDirection,
    clearSort,
    isSorted: (key: keyof T) => sortConfig.key === key,
    getSortDirection: (key: keyof T) => 
      sortConfig.key === key ? sortConfig.direction : null,
  };
}
