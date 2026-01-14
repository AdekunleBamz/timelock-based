import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for setting up intervals
 * Automatically cleans up on unmount
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  immediate = false
): void {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Execute callback immediately if requested
  useEffect(() => {
    if (immediate && delay !== null) {
      savedCallback.current();
    }
  }, [immediate, delay]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) {
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Custom hook for intervals with pause/resume functionality
 */
export function useControllableInterval(
  callback: () => void,
  delay: number
): {
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
} {
  const savedCallback = useRef<() => void>(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      intervalRef.current = setInterval(() => {
        savedCallback.current();
      }, delay);
      isRunningRef.current = true;
    }
  }, [delay]);

  const toggle = useCallback(() => {
    if (isRunningRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning: isRunningRef.current,
    start,
    stop,
    toggle,
  };
}
