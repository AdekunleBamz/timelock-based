// URL and query parameter utilities

/**
 * Build a query string from an object
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Parse a query string into an object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Update a single query parameter in a URL
 */
export function updateQueryParam(
  url: string,
  key: string,
  value: string | number | boolean | null
): string {
  const [base, queryString] = url.split('?');
  const params = parseQueryString(queryString || '');
  
  if (value === null) {
    delete params[key];
  } else {
    params[key] = String(value);
  }
  
  const newQuery = buildQueryString(params);
  return newQuery ? `${base}${newQuery}` : base;
}

/**
 * Get current page URL without query parameters
 */
export function getBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Build an explorer URL for a transaction hash
 */
export function getExplorerUrl(
  txHash: string,
  chainId: number,
  type: 'tx' | 'address' | 'block' = 'tx'
): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    8453: 'https://basescan.org',
    // Add more as needed
  };

  const baseUrl = explorers[chainId] || explorers[1];
  return `${baseUrl}/${type}/${txHash}`;
}
