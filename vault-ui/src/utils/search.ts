/**
 * Search and filter utilities
 */

/**
 * Fuzzy search implementation
 */
export function fuzzySearch(query: string, text: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  
  if (normalizedQuery === '') return true;
  if (normalizedText.includes(normalizedQuery)) return true;
  
  // Check for fuzzy match
  let queryIndex = 0;
  for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedText[i] === normalizedQuery[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === normalizedQuery.length;
}

/**
 * Calculate search relevance score
 */
export function calculateRelevance(query: string, text: string): number {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  
  if (normalizedQuery === '') return 0;
  
  let score = 0;
  
  // Exact match bonus
  if (normalizedText === normalizedQuery) {
    score += 100;
  }
  
  // Starts with query bonus
  if (normalizedText.startsWith(normalizedQuery)) {
    score += 50;
  }
  
  // Contains query bonus
  if (normalizedText.includes(normalizedQuery)) {
    score += 25;
  }
  
  // Word boundary match bonus
  const words = normalizedText.split(/\s+/);
  for (const word of words) {
    if (word === normalizedQuery) {
      score += 30;
    } else if (word.startsWith(normalizedQuery)) {
      score += 15;
    }
  }
  
  return score;
}

/**
 * Highlight search matches in text
 */
export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Search through array of objects
 */
export function searchObjects<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return items;
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (value === undefined || value === null) return false;
      
      const textValue = String(value).toLowerCase();
      return textValue.includes(normalizedQuery);
    });
  });
}

/**
 * Advanced search with relevance scoring
 */
export function advancedSearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: (keyof T)[],
  minScore: number = 10
): Array<T & { _relevance: number }> {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return items.map(item => ({ ...item, _relevance: 0 }));
  }
  
  const results = items.map(item => {
    let maxScore = 0;
    
    fields.forEach(field => {
      const value = item[field];
      if (value !== undefined && value !== null) {
        const textValue = String(value);
        const score = calculateRelevance(normalizedQuery, textValue);
        maxScore = Math.max(maxScore, score);
      }
    });
    
    return {
      ...item,
      _relevance: maxScore,
    };
  });
  
  return results
    .filter(item => item._relevance >= minScore)
    .sort((a, b) => b._relevance - a._relevance);
}

/**
 * Tag-based filtering
 */
export function filterByTags<T extends { tags?: string[] }>(
  items: T[],
  selectedTags: string[],
  matchAll: boolean = false
): T[] {
  if (selectedTags.length === 0) return items;
  
  return items.filter(item => {
    if (!item.tags || item.tags.length === 0) return false;
    
    if (matchAll) {
      return selectedTags.every(tag => item.tags!.includes(tag));
    } else {
      return selectedTags.some(tag => item.tags!.includes(tag));
    }
  });
}

/**
 * Multi-field text search with weights
 */
export function weightedSearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  fieldWeights: Record<keyof T, number>
): Array<T & { _score: number }> {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return items.map(item => ({ ...item, _score: 0 }));
  }
  
  const results = items.map(item => {
    let totalScore = 0;
    
    Object.entries(fieldWeights).forEach(([field, weight]) => {
      const value = item[field as keyof T];
      if (value !== undefined && value !== null) {
        const textValue = String(value);
        const relevance = calculateRelevance(normalizedQuery, textValue);
        totalScore += relevance * (weight as number);
      }
    });
    
    return {
      ...item,
      _score: totalScore,
    };
  });
  
  return results
    .filter(item => item._score > 0)
    .sort((a, b) => b._score - a._score);
}
