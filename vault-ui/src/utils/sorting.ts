/**
 * Sorting utilities for arrays and objects
 */

export type SortDirection = 'asc' | 'desc';

/**
 * Sort array of objects by a key
 */
export function sortBy<T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  direction: SortDirection = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Multi-level sorting
 */
export function sortByMultiple<T extends Record<string, any>>(
  array: T[],
  sortKeys: Array<{ key: keyof T; direction?: SortDirection }>
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, direction = 'asc' } of sortKeys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal !== bVal) {
        const comparison = aVal < bVal ? -1 : 1;
        return direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

/**
 * Sort with custom comparator
 */
export function sortWithComparator<T>(
  array: T[],
  comparator: (a: T, b: T) => number
): T[] {
  return [...array].sort(comparator);
}

/**
 * Natural sort (handles numbers in strings correctly)
 */
export function naturalSort<T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  direction: SortDirection = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aStr = String(a[key]);
    const bStr = String(b[key]);
    
    const comparison = aStr.localeCompare(bStr, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort by date
 */
export function sortByDate<T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  direction: SortDirection = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aDate = new Date(a[key]).getTime();
    const bDate = new Date(b[key]).getTime();
    
    const comparison = aDate - bDate;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Group by key
 */
export function groupBy<T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Partition array by predicate
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T extends Record<string, any>>(
  array: T[],
  key: keyof T
): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
