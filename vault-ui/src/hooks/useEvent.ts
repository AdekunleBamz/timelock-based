/**
 * Custom hook for using event emitter
 */

import { useEffect } from 'react';
import { eventEmitter, AppEventType } from '../utils/eventEmitter';

export function useEvent(event: AppEventType | string, handler: (...args: any[]) => void): void {
  useEffect(() => {
    return eventEmitter.on(event, handler);
  }, [event, handler]);
}

export function useEventOnce(event: AppEventType | string, handler: (...args: any[]) => void): void {
  useEffect(() => {
    return eventEmitter.once(event, handler);
  }, [event, handler]);
}
