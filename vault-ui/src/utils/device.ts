/**
 * Browser and device detection utilities
 */

/**
 * Detect if user is on mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detect if user is on iOS
 */
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Detect if user is on Android
 */
export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

/**
 * Get browser name
 */
export function getBrowserName(): string {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';

  return 'Unknown';
}

/**
 * Check if browser supports WebGL
 */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Check if browser supports Web3
 */
export function supportsWeb3(): boolean {
  return typeof (window as any).ethereum !== 'undefined';
}

/**
 * Get viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get OS name
 */
export function getOS(): string {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Win')) return 'Windows';
  if (userAgent.includes('Mac')) return 'MacOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (isIOS()) return 'iOS';

  return 'Unknown';
}

/**
 * Check if browser supports clipboard API
 */
export function supportsClipboard(): boolean {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

/**
 * Check if browser supports notifications
 */
export function supportsNotifications(): boolean {
  return 'Notification' in window;
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get connection type (if available)
 */
export function getConnectionType(): string {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  return connection?.effectiveType || 'unknown';
}

/**
 * Check if browser tab is visible
 */
export function isTabVisible(): boolean {
  return !document.hidden;
}

/**
 * Listen for tab visibility changes
 */
export function onVisibilityChange(callback: (isVisible: boolean) => void): () => void {
  const handler = () => callback(isTabVisible());
  document.addEventListener('visibilitychange', handler);
  
  return () => document.removeEventListener('visibilitychange', handler);
}
