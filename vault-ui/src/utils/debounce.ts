/**
 * Advanced debounce and throttle utilities
 */

type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
};

/**
 * Advanced debounce with leading/trailing options
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true, maxWait } = options;
  
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let maxTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let result: ReturnType<T> | undefined;

  function invokeFunc(time: number) {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func(...args);
    return result;
  }

  function startTimer(pendingFunc: () => void, wait: number) {
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id: ReturnType<typeof setTimeout> | undefined) {
    if (id !== undefined) {
      clearTimeout(id);
    }
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeoutId = startTimer(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timeoutId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel() {
    cancelTimer(timeoutId);
    cancelTimer(maxTimeoutId);
    lastInvokeTime = 0;
    lastArgs = lastCallTime = timeoutId = maxTimeoutId = undefined;
  }

  function flush() {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timeoutId !== undefined;
  }

  function debounced(...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeoutId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = startTimer(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

type ThrottledFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

/**
 * Advanced throttle with leading/trailing options
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;
  
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  }) as ThrottledFunction<T>;
}

/**
 * Request animation frame debounce
 */
export function rafDebounce<T extends (...args: any[]) => any>(
  func: T
): DebouncedFunction<T> {
  let rafId: number | undefined;
  let lastArgs: Parameters<T> | undefined;

  function invokeFunc() {
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = undefined;
    }
  }

  function debounced(...args: Parameters<T>) {
    lastArgs = args;
    if (rafId === undefined) {
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        invokeFunc();
      });
    }
  }

  debounced.cancel = () => {
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId);
      rafId = undefined;
      lastArgs = undefined;
    }
  };

  debounced.flush = () => {
    debounced.cancel();
    invokeFunc();
  };

  debounced.pending = () => rafId !== undefined;

  return debounced;
}

/**
 * Throttle with requestAnimationFrame
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): ThrottledFunction<T> {
  let rafId: number | undefined;
  let lastArgs: Parameters<T> | undefined;

  function throttled(...args: Parameters<T>) {
    lastArgs = args;
    if (rafId === undefined) {
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = undefined;
        }
      });
    }
  }

  throttled.cancel = () => {
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId);
      rafId = undefined;
      lastArgs = undefined;
    }
  };

  throttled.flush = () => {
    throttled.cancel();
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = undefined;
    }
  };

  return throttled;
}
