/**
 * Browser and environment utilities
 */

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function isServer(): boolean {
  return !isBrowser();
}

export function getOS(): 'mac' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown' {
  if (!isBrowser()) return 'unknown';

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('mac')) return 'mac';
  if (userAgent.includes('win')) return 'windows';
  if (userAgent.includes('linux')) return 'linux';
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
  if (userAgent.includes('android')) return 'android';

  return 'unknown';
}

export function getBrowser(): 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown' {
  if (!isBrowser()) return 'unknown';

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('chrome') && !userAgent.includes('edge')) return 'chrome';
  if (userAgent.includes('firefox')) return 'firefox';
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
  if (userAgent.includes('edge')) return 'edge';
  if (userAgent.includes('opera') || userAgent.includes('opr')) return 'opera';

  return 'unknown';
}

export function isMobile(): boolean {
  if (!isBrowser()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

export function isTablet(): boolean {
  if (!isBrowser()) return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /ipad|android/i.test(userAgent) && !/mobile/i.test(userAgent);
}

export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser()) return Promise.resolve(false);

  if (navigator.clipboard) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  }

  // Fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve(success);
  } catch {
    document.body.removeChild(textarea);
    return Promise.resolve(false);
  }
}

export function getViewportSize() {
  if (!isBrowser()) return { width: 0, height: 0 };

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function scrollToTop(smooth = true) {
  if (!isBrowser()) return;

  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

export function scrollToElement(element: HTMLElement | string, smooth = true) {
  if (!isBrowser()) return;

  const target = typeof element === 'string' ? document.querySelector(element) : element;

  if (target) {
    target.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    });
  }
}
