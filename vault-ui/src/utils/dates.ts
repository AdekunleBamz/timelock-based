/**
 * Date and time utilities
 */

/**
 * Format date to human-readable string
 */
export function formatDate(timestamp: number, format: 'short' | 'long' | 'relative' = 'short'): string {
  const date = new Date(timestamp * 1000);
  
  if (format === 'relative') {
    return formatRelativeTime(timestamp);
  }
  
  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

/**
 * Format duration in seconds to human-readable
 */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}

/**
 * Format duration to long format
 */
export function formatDurationLong(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  
  return parts.join(', ') || 'less than a minute';
}

/**
 * Calculate time remaining
 */
export function getTimeRemaining(endTimestamp: number): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = Math.floor(Date.now() / 1000);
  const total = endTimestamp - now;
  
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  
  return {
    total,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    isExpired: false,
  };
}

/**
 * Get timestamp for start of day
 */
export function getStartOfDay(timestamp: number): number {
  const date = new Date(timestamp * 1000);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
}

/**
 * Get timestamp for end of day
 */
export function getEndOfDay(timestamp: number): number {
  const date = new Date(timestamp * 1000);
  date.setHours(23, 59, 59, 999);
  return Math.floor(date.getTime() / 1000);
}

/**
 * Add days to timestamp
 */
export function addDays(timestamp: number, days: number): number {
  return timestamp + (days * 86400);
}

/**
 * Add hours to timestamp
 */
export function addHours(timestamp: number, hours: number): number {
  return timestamp + (hours * 3600);
}

/**
 * Check if timestamp is today
 */
export function isToday(timestamp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return getStartOfDay(timestamp) === getStartOfDay(now);
}

/**
 * Check if timestamp is this week
 */
export function isThisWeek(timestamp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  const weekAgo = now - (7 * 86400);
  return timestamp >= weekAgo && timestamp <= now;
}

/**
 * Get day name
 */
export function getDayName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get month name
 */
export function getMonthName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Parse duration string to seconds
 */
export function parseDuration(str: string): number {
  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };
  
  const regex = /(\d+)([smhdw])/g;
  let total = 0;
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];
    total += value * (units[unit] || 0);
  }
  
  return total;
}

/**
 * Format timestamp to ISO string
 */
export function toISOString(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

/**
 * Parse ISO string to timestamp
 */
export function fromISOString(isoString: string): number {
  return Math.floor(new Date(isoString).getTime() / 1000);
}

/**
 * Get timezone offset in hours
 */
export function getTimezoneOffset(): number {
  return -new Date().getTimezoneOffset() / 60;
}

/**
 * Format time of day
 */
export function formatTimeOfDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
