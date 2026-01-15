import React from 'react';
import './Alert.css';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon,
  className = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      <div className="alert-content">
        {icon && <div className="alert-icon">{icon}</div>}
        <div className="alert-body">
          {title && <div className="alert-title">{title}</div>}
          <div className="alert-message">{children}</div>
        </div>
      </div>
      {dismissible && (
        <button
          className="alert-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
