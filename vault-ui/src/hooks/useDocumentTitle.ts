/**
 * Custom hook for managing document title
 */

import { useEffect } from 'react';

export function useDocumentTitle(title: string, keepOnUnmount: boolean = false): void {
  const defaultTitle = typeof document !== 'undefined' ? document.title : '';

  useEffect(() => {
    document.title = title;

    return () => {
      if (!keepOnUnmount) {
        document.title = defaultTitle;
      }
    };
  }, [title, keepOnUnmount, defaultTitle]);
}
