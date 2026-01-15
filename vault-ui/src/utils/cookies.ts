/**
 * Cookie utilities
 */

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set cookie
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (options.expires) {
    const expires = options.expires instanceof Date
      ? options.expires
      : new Date(Date.now() + options.expires * 1000);
    cookieString += `; expires=${expires.toUTCString()}`;
  }
  
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }
  
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }
  
  if (options.secure) {
    cookieString += '; secure';
  }
  
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }
  
  document.cookie = cookieString;
}

/**
 * Get cookie
 */
export function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  
  return null;
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
}

/**
 * Check if cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Get all cookies
 */
export function getAllCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};
  const cookieStrings = document.cookie.split(';');
  
  for (let cookie of cookieStrings) {
    cookie = cookie.trim();
    const [name, value] = cookie.split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }
  
  return cookies;
}

/**
 * Clear all cookies
 */
export function clearAllCookies(): void {
  const cookies = getAllCookies();
  for (const name in cookies) {
    deleteCookie(name);
  }
}
