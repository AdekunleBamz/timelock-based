/**
 * Animation utilities and hooks
 */

import { useEffect, useRef } from 'react';

/**
 * Fade in animation
 */
export function fadeIn(element: HTMLElement, duration: number = 300): Promise<void> {
  return new Promise(resolve => {
    element.style.opacity = '0';
    element.style.display = 'block';

    let start: number | null = null;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);

      element.style.opacity = opacity.toString();

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

/**
 * Fade out animation
 */
export function fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
  return new Promise(resolve => {
    let start: number | null = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = initialOpacity * (1 - Math.min(progress / duration, 1));

      element.style.opacity = opacity.toString();

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

/**
 * Slide in animation
 */
export function slideIn(
  element: HTMLElement,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
  duration: number = 300
): Promise<void> {
  return new Promise(resolve => {
    element.style.display = 'block';
    
    const transforms: Record<string, string> = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)',
    };

    element.style.transform = transforms[direction];
    element.style.transition = `transform ${duration}ms ease`;

    requestAnimationFrame(() => {
      element.style.transform = 'translate(0, 0)';
      setTimeout(resolve, duration);
    });
  });
}

/**
 * Bounce animation
 */
export function bounce(element: HTMLElement, intensity: number = 10): Promise<void> {
  return new Promise(resolve => {
    const keyframes = [
      { transform: 'translateY(0)' },
      { transform: `translateY(-${intensity}px)` },
      { transform: 'translateY(0)' },
      { transform: `translateY(-${intensity / 2}px)` },
      { transform: 'translateY(0)' },
    ];

    element.animate(keyframes, {
      duration: 600,
      easing: 'ease-out',
    }).onfinish = () => resolve();
  });
}

/**
 * Shake animation
 */
export function shake(element: HTMLElement, intensity: number = 10): Promise<void> {
  return new Promise(resolve => {
    const keyframes = [
      { transform: 'translateX(0)' },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: 'translateX(0)' },
    ];

    element.animate(keyframes, {
      duration: 500,
      easing: 'ease-in-out',
    }).onfinish = () => resolve();
  });
}

/**
 * Pulse animation
 */
export function pulse(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    const keyframes = [
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' },
    ];

    element.animate(keyframes, {
      duration: 300,
      easing: 'ease-in-out',
    }).onfinish = () => resolve();
  });
}

/**
 * Hook for intersection observer (scroll animations)
 */
export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(callback);
    }, options);

    observer.observe(target);

    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
}

/**
 * Hook for animation on mount
 */
export function useAnimateOnMount(
  animation: (element: HTMLElement) => Promise<void>
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      animation(ref.current);
    }
  }, [animation]);

  return ref;
}

/**
 * Stagger animation for lists
 */
export async function staggerAnimation(
  elements: HTMLElement[],
  animation: (el: HTMLElement) => Promise<void>,
  delay: number = 100
): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    animation(elements[i]);
    if (i < elements.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
