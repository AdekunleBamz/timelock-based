import { formatDate, formatRelativeTime, formatDuration } from '../utils';
import { Tooltip } from './Tooltip';
import './TimeDisplay.css';

interface TimeDisplayProps {
  date: Date | string | number;
  format?: 'relative' | 'absolute' | 'duration';
  showTooltip?: boolean;
  className?: string;
}

export function TimeDisplay({
  date,
  format = 'relative',
  showTooltip = true,
  className = '',
}: TimeDisplayProps) {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  let displayText: string;
  let tooltipText: string;

  switch (format) {
    case 'relative':
      displayText = formatRelativeTime(dateObj);
      tooltipText = formatDate(dateObj);
      break;
    case 'absolute':
      displayText = formatDate(dateObj);
      tooltipText = formatRelativeTime(dateObj);
      break;
    case 'duration':
      displayText = formatDuration(Math.floor((dateObj.getTime() - Date.now()) / 1000));
      tooltipText = formatDate(dateObj);
      break;
  }

  const content = (
    <time 
      className={`time-display ${className}`}
      dateTime={dateObj.toISOString()}
    >
      {displayText}
    </time>
  );

  if (showTooltip) {
    return (
      <Tooltip content={tooltipText} position="top">
        {content}
      </Tooltip>
    );
  }

  return content;
}

// Countdown display for lock times
export function UnlockCountdown({ unlockDate }: { unlockDate: Date }) {
  const isUnlocked = unlockDate <= new Date();
  
  if (isUnlocked) {
    return (
      <span className="unlock-countdown unlocked">
        🔓 Unlocked
      </span>
    );
  }

  return (
    <span className="unlock-countdown locked">
      🔒 <TimeDisplay date={unlockDate} format="duration" />
    </span>
  );
}
