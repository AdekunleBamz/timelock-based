import { useState, useEffect } from 'react';

interface UseKeyPressOptions {
  preventDefault?: boolean;
}

export function useKeyPress(targetKey: string, options: UseKeyPressOptions = {}) {
  const { preventDefault = false } = options;
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        if (preventDefault) event.preventDefault();
        setIsPressed(true);
      }
    };

    const handleUp = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);

    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [targetKey, preventDefault]);

  return isPressed;
}
