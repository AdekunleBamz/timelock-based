/**
 * Utility functions for formatting blockchain data
 */

import { ethers } from 'ethers';

/**
 * Formats Wei to Ether with specified decimals
 */
export function formatEther(
  wei: string | bigint,
  decimals = 4
): string {
  try {
    const etherValue = ethers.formatEther(wei);
    const num = parseFloat(etherValue);
    return num.toFixed(decimals);
  } catch {
    return '0';
  }
}

/**
 * Formats tokens with custom decimals
 */
export function formatTokenAmount(
  amount: string | bigint,
  tokenDecimals = 18,
  displayDecimals = 4
): string {
  try {
    const formatted = ethers.formatUnits(amount, tokenDecimals);
    const num = parseFloat(formatted);
    return num.toFixed(displayDecimals);
  } catch {
    return '0';
  }
}

/**
 * Formats USDC amount (6 decimals)
 */
export function formatUSDC(amount: string | bigint, decimals = 2): string {
  return formatTokenAmount(amount, 6, decimals);
}

/**
 * Parses Ether to Wei
 */
export function parseEther(ether: string): bigint {
  try {
    return ethers.parseEther(ether);
  } catch {
    return BigInt(0);
  }
}

/**
 * Parses token amount with custom decimals
 */
export function parseTokenAmount(
  amount: string,
  decimals = 18
): bigint {
  try {
    return ethers.parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
}

/**
 * Parses USDC amount (6 decimals)
 */
export function parseUSDC(amount: string): bigint {
  return parseTokenAmount(amount, 6);
}

/**
 * Formats a transaction hash for display
 */
export function formatTxHash(hash: string, length = 8): string {
  if (!hash || hash.length < length * 2) {
    return hash;
  }
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

/**
 * Formats gas price in Gwei
 */
export function formatGwei(wei: string | bigint): string {
  try {
    return ethers.formatUnits(wei, 'gwei');
  } catch {
    return '0';
  }
}

/**
 * Formats block number with commas
 */
export function formatBlockNumber(blockNumber: number): string {
  return blockNumber.toLocaleString();
}

/**
 * Formats percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats USD amount
 */
export function formatUSD(amount: number, decimals = 2): string {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
