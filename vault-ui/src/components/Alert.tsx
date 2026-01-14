import type { ReactNode } from 'react';
import './Alert.css';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  className?: string;
}

const defaultIcons: Record<AlertVariant, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
}: AlertProps) {
  const displayIcon = icon ?? defaultIcons[variant];

  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      <span className="alert-icon">{displayIcon}</span>
      <div className="alert-content">
        {title && <strong className="alert-title">{title}</strong>}
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Dismiss alert">
          ✕
        </button>
      )}
    </div>
  );
}
