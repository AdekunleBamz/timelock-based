import type { ReactNode } from 'react';
import './InfoBox.css';

type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface InfoBoxProps {
  children: ReactNode;
  variant?: InfoBoxVariant;
  title?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const defaultIcons: Record<InfoBoxVariant, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  error: '✕',
  neutral: '•',
};

export function InfoBox({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}: InfoBoxProps) {
  return (
    <div className={`info-box info-box--${variant} ${className}`} role="alert">
      <span className="info-box-icon">
        {icon ?? defaultIcons[variant]}
      </span>
      <div className="info-box-content">
        {title && <span className="info-box-title">{title}</span>}
        <div className="info-box-message">{children}</div>
      </div>
      {dismissible && (
        <button 
          className="info-box-dismiss" 
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
