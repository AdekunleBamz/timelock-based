import { useState, useEffect } from 'react';

interface UseScrollOptions {
  threshold?: number;
}

export function useScroll({ threshold = 0 }: UseScrollOptions = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [hasScrolledPastThreshold, setHasScrolledPastThreshold] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrollY(currentScrollY);
      setIsScrollingDown(currentScrollY > lastScrollY);
      setHasScrolledPastThreshold(currentScrollY > threshold);
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollY, isScrollingDown, hasScrolledPastThreshold };
}
