import './StatusDot.css';

type StatusType = 'online' | 'offline' | 'busy' | 'away' | 'pending';

interface StatusDotProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  label?: string;
  showLabel?: boolean;
}

const statusLabels: Record<StatusType, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
  pending: 'Pending',
};

export function StatusDot({
  status,
  size = 'md',
  pulse = false,
  label,
  showLabel = false,
}: StatusDotProps) {
  const displayLabel = label ?? statusLabels[status];
  
  return (
    <span className={`status-dot-container status-dot--${size}`}>
      <span 
        className={`status-dot status-dot--${status} ${pulse ? 'status-dot--pulse' : ''}`}
        aria-label={displayLabel}
      />
      {showLabel && (
        <span className="status-dot-label">{displayLabel}</span>
      )}
    </span>
  );
}
