/**
 * Number formatting utilities
 */

/**
 * Format number with commas
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format as currency
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  decimals?: number
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format as percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers with suffixes (K, M, B, T)
 */
export function formatCompact(value: number, decimals: number = 1): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixIndex = 0;
  let scaledValue = value;
  
  while (Math.abs(scaledValue) >= 1000 && suffixIndex < suffixes.length - 1) {
    scaledValue /= 1000;
    suffixIndex++;
  }
  
  return `${formatNumber(scaledValue, decimals)}${suffixes[suffixIndex]}`;
}

/**
 * Format crypto amount (e.g., ETH with 18 decimals)
 */
export function formatCrypto(
  value: bigint | string,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  const num = typeof value === 'string' ? BigInt(value) : value;
  const divisor = BigInt(10 ** decimals);
  const whole = num / divisor;
  const fraction = num % divisor;
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  const displayFraction = fractionStr.slice(0, displayDecimals);
  
  return `${whole}.${displayFraction}`;
}

/**
 * Parse formatted number back to float
 */
export function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, ''));
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to specific decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculate percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Generate random number in range
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Check if number is in range (inclusive)
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${roundTo(size, 2)} ${units[unitIndex]}`;
}

/**
 * Format duration (milliseconds to human readable)
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Median of numbers
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const avg = average(numbers);
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(average(squareDiffs));
}
