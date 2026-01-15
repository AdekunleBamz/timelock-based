/**
 * Custom hook for detecting if element is on screen (Intersection Observer)
 */

import { useState, useEffect, RefObject } from 'react';

export function useOnScreen(
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Hook for lazy loading on scroll
 */
export function useLazyLoad(ref: RefObject<Element>): boolean {
  const [hasLoaded, setHasLoaded] = useState(false);
  const isOnScreen = useOnScreen(ref);

  useEffect(() => {
    if (isOnScreen && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isOnScreen, hasLoaded]);

  return hasLoaded;
}
