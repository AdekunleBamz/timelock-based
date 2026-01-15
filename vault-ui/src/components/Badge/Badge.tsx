import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outline?: boolean;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  outline = false,
  dot = false,
  className = '',
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    rounded && 'badge-rounded',
    outline && 'badge-outline',
    dot && 'badge-dot',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {dot && <span className="badge-dot-indicator" />}
      {children}
    </span>
  );
};
