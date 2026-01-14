// Math and calculation utilities

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a number from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculate compound interest
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  timeInYears: number,
  compoundsPerYear: number = 365
): number {
  return principal * Math.pow(1 + rate / compoundsPerYear, compoundsPerYear * timeInYears);
}

/**
 * Calculate APY from APR
 */
export function aprToApy(apr: number, compoundsPerYear: number = 365): number {
  return (Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1) * 100;
}

/**
 * Calculate simple interest
 */
export function calculateSimpleInterest(
  principal: number,
  rate: number,
  timeInYears: number
): number {
  return principal * rate * timeInYears;
}

/**
 * Format large numbers with suffixes (K, M, B)
 */
export function formatLargeNumber(value: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
  
  if (tier <= 0) return value.toString();
  
  const suffix = suffixes[tier] || '';
  const scaled = value / Math.pow(10, tier * 3);
  
  return `${scaled.toFixed(1)}${suffix}`;
}

/**
 * Calculate growth rate between two values
 */
export function calculateGrowthRate(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get average from array of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Get median from array of numbers
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
