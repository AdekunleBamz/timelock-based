/**
 * Notification utilities
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const NOTIFICATION_KEY = 'app_notifications';
const MAX_NOTIFICATIONS = 50;

/**
 * Generate notification ID
 */
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all notifications
 */
export function getNotifications(): Notification[] {
  const data = localStorage.getItem(NOTIFICATION_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Add notification
 */
export function addNotification(
  type: NotificationType,
  title: string,
  message: string,
  options: {
    actionLabel?: string;
    actionUrl?: string;
  } = {}
): Notification {
  const notification: Notification = {
    id: generateNotificationId(),
    type,
    title,
    message,
    timestamp: Date.now(),
    read: false,
    ...options,
  };

  const notifications = getNotifications();
  notifications.unshift(notification);

  // Keep only most recent notifications
  const trimmed = notifications.slice(0, MAX_NOTIFICATIONS);
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(trimmed));

  // Request browser notification permission if not already granted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/logo.png',
      badge: '/logo.png',
    });
  }

  return notification;
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);

  if (notification) {
    notification.read = true;
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
  }
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsAsRead(): void {
  const notifications = getNotifications();
  notifications.forEach(n => n.read = true);
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
}

/**
 * Delete notification
 */
export function deleteNotification(id: string): void {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== id);
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(filtered));
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  localStorage.removeItem(NOTIFICATION_KEY);
}

/**
 * Get unread count
 */
export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}

/**
 * Send browser notification
 */
export function sendBrowserNotification(
  title: string,
  options: NotificationOptions = {}
): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options,
    });
  }
}

/**
 * Notification presets
 */
export const NotificationPresets = {
  depositSuccess: (amount: string) => addNotification(
    'success',
    'Deposit Successful',
    `Successfully deposited ${amount} USDC`
  ),

  withdrawSuccess: (amount: string) => addNotification(
    'success',
    'Withdrawal Successful',
    `Successfully withdrew ${amount} USDC`
  ),

  emergencyWithdraw: (amount: string) => addNotification(
    'warning',
    'Emergency Withdrawal',
    `Emergency withdrew ${amount} USDC with penalty`
  ),

  depositUnlocked: (amount: string) => addNotification(
    'info',
    'Deposit Unlocked',
    `Your deposit of ${amount} USDC is now available for withdrawal`,
    {
      actionLabel: 'Withdraw Now',
      actionUrl: '/deposits',
    }
  ),

  transactionFailed: (reason: string) => addNotification(
    'error',
    'Transaction Failed',
    reason
  ),

  walletConnected: (address: string) => addNotification(
    'success',
    'Wallet Connected',
    `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
  ),

  networkChanged: (network: string) => addNotification(
    'info',
    'Network Changed',
    `Switched to ${network}`
  ),
};
