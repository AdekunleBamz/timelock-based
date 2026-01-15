/**
 * Custom hook for copying to clipboard
 */

import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

export function useCopyToClipboard(resetDelay: number = 2000): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, resetDelay);
    } catch (error) {
      console.error('Failed to copy:', error);
      setIsCopied(false);
    }
  }, [resetDelay]);

  const reset = useCallback(() => {
    setIsCopied(false);
  }, []);

  return { isCopied, copy, reset };
}
