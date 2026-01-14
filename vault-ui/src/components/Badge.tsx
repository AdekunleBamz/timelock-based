import type { HTMLAttributes, ReactNode } from 'react';
import './Badge.css';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'small' | 'medium';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  className = '',
  ...props
}: BadgeProps) {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    dot ? 'badge-dot' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {dot && <span className="badge-dot-indicator"></span>}
      {children}
    </span>
  );
}

// Status-specific badge variants
export function StatusBadge({ status }: { status: 'active' | 'locked' | 'unlocked' | 'withdrawn' }) {
  const config = {
    active: { variant: 'info' as const, label: 'Active', dot: true },
    locked: { variant: 'warning' as const, label: 'Locked', dot: true },
    unlocked: { variant: 'success' as const, label: 'Unlocked', dot: true },
    withdrawn: { variant: 'default' as const, label: 'Withdrawn', dot: false },
  };

  const { variant, label, dot } = config[status];

  return (
    <Badge variant={variant} size="small" dot={dot}>
      {label}
    </Badge>
  );
}
