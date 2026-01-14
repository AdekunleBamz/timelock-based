import { useState, useMemo, useCallback } from 'react';

type FilterFn<T> = (item: T) => boolean;

interface FilterConfig<T> {
  [key: string]: FilterFn<T>;
}

export function useFilter<T>(items: T[]) {
  const [filters, setFilters] = useState<FilterConfig<T>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchKeys, setSearchKeys] = useState<(keyof T)[]>([]);

  const filteredItems = useMemo(() => {
    let result = items;

    // Apply all filters
    Object.values(filters).forEach((filterFn) => {
      result = result.filter(filterFn);
    });

    // Apply search
    if (searchTerm && searchKeys.length > 0) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(lowerSearch);
        })
      );
    }

    return result;
  }, [items, filters, searchTerm, searchKeys]);

  const addFilter = useCallback((key: string, filterFn: FilterFn<T>) => {
    setFilters((prev) => ({ ...prev, [key]: filterFn }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const search = useCallback((term: string, keys: (keyof T)[]) => {
    setSearchTerm(term);
    setSearchKeys(keys);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const clearAll = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  return {
    items: filteredItems,
    originalItems: items,
    filters,
    searchTerm,
    addFilter,
    removeFilter,
    clearFilters,
    search,
    clearSearch,
    clearAll,
    hasFilters: Object.keys(filters).length > 0 || searchTerm.length > 0,
    filterCount: Object.keys(filters).length + (searchTerm ? 1 : 0),
  };
}

// Convenience helper for common filters
export function createFilters<T>() {
  return {
    equals: <K extends keyof T>(key: K, value: T[K]): FilterFn<T> => 
      (item) => item[key] === value,
    
    notEquals: <K extends keyof T>(key: K, value: T[K]): FilterFn<T> => 
      (item) => item[key] !== value,
    
    includes: <K extends keyof T>(key: K, values: T[K][]): FilterFn<T> => 
      (item) => values.includes(item[key]),
    
    greaterThan: <K extends keyof T>(key: K, value: number): FilterFn<T> => 
      (item) => (item[key] as unknown as number) > value,
    
    lessThan: <K extends keyof T>(key: K, value: number): FilterFn<T> => 
      (item) => (item[key] as unknown as number) < value,
    
    between: <K extends keyof T>(key: K, min: number, max: number): FilterFn<T> => 
      (item) => {
        const val = item[key] as unknown as number;
        return val >= min && val <= max;
      },
    
    contains: <K extends keyof T>(key: K, substr: string): FilterFn<T> => 
      (item) => String(item[key]).toLowerCase().includes(substr.toLowerCase()),
    
    startsWith: <K extends keyof T>(key: K, prefix: string): FilterFn<T> => 
      (item) => String(item[key]).toLowerCase().startsWith(prefix.toLowerCase()),
  };
}
