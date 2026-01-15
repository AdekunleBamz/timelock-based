/**
 * Query parameter utilities
 */

/**
 * Parse query string from URL
 */
export function parseQueryParams(search: string = window.location.search): Record<string, string> {
  const params: Record<string, string> = {};
  const urlParams = new URLSearchParams(search);
  
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Stringify object to query string
 */
export function stringifyQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Add query params to URL
 */
export function addQueryParams(url: string, params: Record<string, any>): string {
  const queryString = stringifyQueryParams(params);
  const separator = url.includes('?') ? '&' : '?';
  return queryString ? `${url}${separator}${queryString}` : url;
}

/**
 * Remove query param from URL
 */
export function removeQueryParam(url: string, param: string): string {
  const [baseUrl, search] = url.split('?');
  if (!search) return url;
  
  const params = new URLSearchParams(search);
  params.delete(param);
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Update query param in URL
 */
export function updateQueryParam(url: string, key: string, value: string): string {
  const [baseUrl, search] = url.split('?');
  const params = new URLSearchParams(search);
  
  params.set(key, value);
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Get query param from current URL
 */
export function getQueryParam(key: string, defaultValue?: string): string | undefined {
  const params = parseQueryParams();
  return params[key] ?? defaultValue;
}

/**
 * Navigate with query params
 */
export function navigateWithParams(path: string, params: Record<string, any>): void {
  const url = addQueryParams(path, params);
  window.history.pushState({}, '', url);
}
