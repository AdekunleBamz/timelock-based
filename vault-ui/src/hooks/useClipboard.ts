import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseClipboardReturn {
  copy: (text: string) => Promise<void>;
  copied: boolean;
  error: Error | null;
}

/**
 * Hook for copying text to clipboard with feedback
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000, onSuccess, onError } = options;
  
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator.clipboard) {
      const err = new Error('Clipboard API not supported');
      setError(err);
      onError?.(err);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      onSuccess?.();

      setTimeout(() => {
        setCopied(false);
      }, timeout);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy');
      setError(error);
      onError?.(error);
    }
  }, [timeout, onSuccess, onError]);

  return { copy, copied, error };
}
