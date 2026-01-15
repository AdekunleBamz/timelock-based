/**
 * Clipboard utilities for copying text and showing feedback
 */

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      return fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Fallback clipboard copy for older browsers
 */
function fallbackCopyToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    opacity: 0;
  `;
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * Read from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    }
    return null;
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return null;
  }
}

/**
 * Copy with toast notification
 */
export async function copyWithFeedback(
  text: string,
  showToast?: (message: string, type: 'success' | 'error') => void
): Promise<boolean> {
  const success = await copyToClipboard(text);
  
  if (showToast) {
    if (success) {
      showToast('Copied to clipboard!', 'success');
    } else {
      showToast('Failed to copy', 'error');
    }
  }
  
  return success;
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!navigator.clipboard && window.isSecureContext;
}
