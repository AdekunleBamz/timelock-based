/**
 * Keyboard shortcuts hook and manager
 */

import { useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Command on Mac
  description: string;
  handler: () => void;
}

/**
 * Hook to register keyboard shortcuts
 */
export function useKeyboardShortcut(config: ShortcutConfig) {
  const { key, ctrl, shift, alt, meta, handler } = config;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = ctrl ? event.ctrlKey : !event.ctrlKey;
      const matchesShift = shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = alt ? event.altKey : !event.altKey;
      const matchesMeta = meta ? event.metaKey : !event.metaKey;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, ctrl, shift, alt, meta, handler]);
}

/**
 * Hook to register multiple shortcuts
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const matchesAlt = shortcut.alt ? event.altKey : !event.altKey;
        const matchesMeta = shortcut.meta ? event.metaKey : !event.metaKey;

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
}

/**
 * Format shortcut for display
 */
export function formatShortcut(config: Pick<ShortcutConfig, 'key' | 'ctrl' | 'shift' | 'alt' | 'meta'>): string {
  const parts: string[] = [];

  if (config.meta) parts.push('⌘');
  if (config.ctrl) parts.push('Ctrl');
  if (config.alt) parts.push('Alt');
  if (config.shift) parts.push('Shift');
  parts.push(config.key.toUpperCase());

  return parts.join(' + ');
}

/**
 * Default app shortcuts
 */
export const DEFAULT_SHORTCUTS: Omit<ShortcutConfig, 'handler'>[] = [
  {
    key: 'k',
    meta: true,
    description: 'Open command palette',
  },
  {
    key: 'd',
    meta: true,
    description: 'New deposit',
  },
  {
    key: 'r',
    meta: true,
    description: 'Refresh data',
  },
  {
    key: 't',
    meta: true,
    description: 'Toggle theme',
  },
  {
    key: 's',
    meta: true,
    description: 'Open settings',
  },
  {
    key: '/',
    ctrl: true,
    description: 'Open search',
  },
  {
    key: 'Escape',
    description: 'Close modal/dialog',
  },
];
