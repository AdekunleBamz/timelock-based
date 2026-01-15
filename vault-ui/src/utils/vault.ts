/**
 * Timelock vault specific utilities
 */

/**
 * Calculate unlock date from lock duration
 */
export function calculateUnlockDate(
  depositDate: Date,
  lockDurationDays: number
): Date {
  const unlockDate = new Date(depositDate);
  unlockDate.setDate(unlockDate.getDate() + lockDurationDays);
  return unlockDate;
}

/**
 * Check if a deposit is unlocked
 */
export function isDepositUnlocked(unlockTimestamp: number): boolean {
  return Date.now() >= unlockTimestamp * 1000;
}

/**
 * Get time remaining until unlock
 */
export function getTimeUntilUnlock(unlockTimestamp: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = Date.now();
  const unlock = unlockTimestamp * 1000;
  const diff = Math.max(0, unlock - now);

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    total: diff,
  };
}

/**
 * Format time remaining as string
 */
export function formatTimeRemaining(unlockTimestamp: number): string {
  if (isDepositUnlocked(unlockTimestamp)) {
    return 'Unlocked';
  }

  const { days, hours, minutes } = getTimeUntilUnlock(unlockTimestamp);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Calculate APY for a lock duration
 */
export function calculateAPY(lockDurationDays: number): number {
  // Example tiered APY calculation
  if (lockDurationDays >= 365) return 15.0;
  if (lockDurationDays >= 180) return 10.0;
  if (lockDurationDays >= 90) return 7.0;
  if (lockDurationDays >= 30) return 5.0;
  return 3.0;
}

/**
 * Calculate expected rewards
 */
export function calculateExpectedRewards(
  amount: number,
  lockDurationDays: number
): number {
  const apy = calculateAPY(lockDurationDays);
  const yearFraction = lockDurationDays / 365;
  return (amount * apy * yearFraction) / 100;
}

/**
 * Get lock duration tier name
 */
export function getLockDurationTier(lockDurationDays: number): string {
  if (lockDurationDays >= 365) return 'Platinum';
  if (lockDurationDays >= 180) return 'Gold';
  if (lockDurationDays >= 90) return 'Silver';
  if (lockDurationDays >= 30) return 'Bronze';
  return 'Basic';
}

/**
 * Format lock duration for display
 */
export function formatLockDuration(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

/**
 * Validate lock duration
 */
export function isValidLockDuration(days: number): boolean {
  return days >= 1 && days <= 1825; // 1 day to 5 years
}

/**
 * Get popular lock durations
 */
export function getPopularLockDurations(): Array<{
  days: number;
  label: string;
  apy: number;
}> {
  return [
    { days: 30, label: '1 Month', apy: calculateAPY(30) },
    { days: 90, label: '3 Months', apy: calculateAPY(90) },
    { days: 180, label: '6 Months', apy: calculateAPY(180) },
    { days: 365, label: '1 Year', apy: calculateAPY(365) },
  ];
}
