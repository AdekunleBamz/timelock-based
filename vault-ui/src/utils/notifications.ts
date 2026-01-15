/**
 * Notification preferences and management
 */

import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storage';

export interface NotificationPreferences {
  enabled: boolean;
  depositSuccess: boolean;
  withdrawalSuccess: boolean;
  unlockReminder: boolean;
  priceAlerts: boolean;
  systemUpdates: boolean;
  soundEnabled: boolean;
  browserNotifications: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  depositSuccess: true,
  withdrawalSuccess: true,
  unlockReminder: true,
  priceAlerts: false,
  systemUpdates: true,
  soundEnabled: true,
  browserNotifications: false,
};

/**
 * Get notification preferences
 */
export function getNotificationPreferences(): NotificationPreferences {
  return getStorageItem(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_PREFERENCES);
}

/**
 * Save notification preferences
 */
export function saveNotificationPreferences(prefs: NotificationPreferences): boolean {
  return setStorageItem(STORAGE_KEYS.NOTIFICATIONS, prefs);
}

/**
 * Update specific preference
 */
export function updateNotificationPreference(
  key: keyof NotificationPreferences,
  value: boolean
): boolean {
  const prefs = getNotificationPreferences();
  prefs[key] = value;
  return saveNotificationPreferences(prefs);
}

/**
 * Check if notifications are allowed
 */
export function canShowNotification(type: keyof Omit<NotificationPreferences, 'enabled' | 'soundEnabled' | 'browserNotifications'>): boolean {
  const prefs = getNotificationPreferences();
  return prefs.enabled && prefs[type];
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Show browser notification
 */
export function showBrowserNotification(title: string, options?: NotificationOptions): void {
  const prefs = getNotificationPreferences();
  
  if (!prefs.browserNotifications || Notification.permission !== 'granted') {
    return;
  }

  new Notification(title, {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    ...options,
  });
}

/**
 * Play notification sound
 */
export function playNotificationSound(type: 'success' | 'error' | 'warning' = 'success'): void {
  const prefs = getNotificationPreferences();
  
  if (!prefs.soundEnabled) return;

  // Create and play audio element
  const audio = new Audio();
  
  switch (type) {
    case 'success':
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIF2i78OihUBELTKXh8bllHgU7k9jy'; // Simple beep sound
      break;
    case 'error':
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIF2i78OihUBELTKXh8bllHgU7k9jz'; // Different pitch
      break;
    case 'warning':
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIF2i78OihUBELTKXh8bllHgU8k9gy'; // Another pitch
      break;
  }

  audio.volume = 0.3;
  audio.play().catch(err => console.warn('Failed to play notification sound:', err));
}

/**
 * Schedule notification for unlock time
 */
export function scheduleUnlockNotification(depositId: number, unlockTime: Date): void {
  const prefs = getNotificationPreferences();
  
  if (!prefs.unlockReminder) return;

  const now = new Date();
  const timeUntilUnlock = unlockTime.getTime() - now.getTime();

  if (timeUntilUnlock > 0 && timeUntilUnlock < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      showBrowserNotification('Deposit Unlocked! 🎉', {
        body: `Your deposit #${depositId} is now available for withdrawal.`,
        tag: `unlock-${depositId}`,
        requireInteraction: true,
      });
      
      playNotificationSound('success');
    }, timeUntilUnlock);
  }
}
