import { useState } from 'react';
import './NotificationCenter.css';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Deposit Unlocked',
      message: 'Your deposit #42 is now available for withdrawal',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      action: {
        label: 'Withdraw',
        onClick: () => console.log('Withdraw clicked'),
      },
    },
    {
      id: '2',
      type: 'info',
      title: 'New Lock Option',
      message: '90-day lock option now available with 8% APY',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Upcoming Unlock',
      message: 'Deposit #38 unlocks in 2 hours',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="notification-overlay" onClick={onClose} />
      <div className="notification-center">
        <div className="notification-header">
          <div className="notification-title-row">
            <h2 className="notification-title">Notifications</h2>
            {unreadCount > 0 && (
              <span className="notification-unread-badge">{unreadCount}</span>
            )}
          </div>
          <button className="notification-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="notification-actions">
            <button
              className="notification-action-btn"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
            <button className="notification-action-btn" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <span className="notification-empty-icon">🔔</span>
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'notification-item--unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`notification-icon notification-icon--${notification.type}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-item-header">
                    <span className="notification-item-title">{notification.title}</span>
                    <span className="notification-time">{formatTime(notification.timestamp)}</span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  {notification.action && (
                    <button
                      className="notification-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        notification.action!.onClick();
                      }}
                    >
                      {notification.action.label} →
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export function NotificationButton({ onClick, count = 0 }: { onClick: () => void; count?: number }) {
  return (
    <button className="notification-button" onClick={onClick} aria-label="Notifications">
      🔔
      {count > 0 && <span className="notification-button-badge">{count > 99 ? '99+' : count}</span>}
    </button>
  );
}
