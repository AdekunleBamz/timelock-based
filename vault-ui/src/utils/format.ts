import { UI_LIMITS } from '../constants';

/**
 * Format a wallet address for display
 */
export function formatAddress(
  address: string,
  prefixLength = UI_LIMITS.ADDRESS_PREFIX_LENGTH,
  suffixLength = UI_LIMITS.ADDRESS_SUFFIX_LENGTH
): string {
  if (!address || address.length < prefixLength + suffixLength) {
    return address || '';
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Format a number with commas for readability
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format USDC amount with dollar sign
 */
export function formatUSDC(amount: string | number, showSymbol = true): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = formatNumber(num);
  return showSymbol ? `$${formatted}` : formatted;
}

/**
 * Format ETH balance
 */
export function formatETH(balance: string | number, decimals = 4): string {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  return `${num.toFixed(decimals)} ETH`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Parse and validate numeric input
 */
export function parseNumericInput(value: string): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}
