/**
 * Vault-specific utility functions
 */

import { ethers } from 'ethers';

/**
 * Calculate penalty for early withdrawal
 */
export function calculatePenalty(
  amount: bigint,
  lockDuration: number,
  elapsedTime: number,
  penaltyRate: number = 10 // 10%
): bigint {
  if (elapsedTime >= lockDuration) {
    return BigInt(0);
  }

  const remainingTime = lockDuration - elapsedTime;
  const penaltyPercent = (remainingTime / lockDuration) * penaltyRate;
  const penalty = (amount * BigInt(Math.floor(penaltyPercent * 100))) / BigInt(10000);

  return penalty;
}

/**
 * Calculate expected returns (without compounding)
 */
export function calculateReturns(
  amount: bigint,
  lockDuration: number,
  apy: number // Annual percentage yield (e.g., 5 for 5%)
): bigint {
  const yearInSeconds = 365 * 24 * 60 * 60;
  const durationInYears = lockDuration / yearInSeconds;
  const returns = (amount * BigInt(Math.floor(apy * durationInYears * 100))) / BigInt(10000);

  return returns;
}

/**
 * Calculate maturity timestamp
 */
export function calculateMaturity(depositTime: number, lockDuration: number): number {
  return depositTime + lockDuration;
}

/**
 * Check if deposit is mature
 */
export function isDepositMature(depositTime: number, lockDuration: number): boolean {
  const maturity = calculateMaturity(depositTime, lockDuration);
  const now = Math.floor(Date.now() / 1000);
  return now >= maturity;
}

/**
 * Calculate time until maturity
 */
export function timeUntilMaturity(depositTime: number, lockDuration: number): number {
  const maturity = calculateMaturity(depositTime, lockDuration);
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, maturity - now);
}

/**
 * Get deposit status
 */
export function getDepositStatus(
  depositTime: number,
  lockDuration: number,
  isEmergency: boolean
): 'locked' | 'unlocked' | 'emergency' {
  if (isEmergency) return 'emergency';
  return isDepositMature(depositTime, lockDuration) ? 'unlocked' : 'locked';
}

/**
 * Format deposit amount with token decimals
 */
export function formatDepositAmount(amount: bigint, decimals: number = 6): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Parse deposit amount to wei
 */
export function parseDepositAmount(amount: string, decimals: number = 6): bigint {
  try {
    return ethers.parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
}

/**
 * Calculate average lock duration from deposits
 */
export function calculateAverageLockDuration(
  deposits: Array<{ lockDuration: number }>
): number {
  if (deposits.length === 0) return 0;

  const total = deposits.reduce((sum, d) => sum + d.lockDuration, 0);
  return Math.floor(total / deposits.length);
}

/**
 * Calculate total locked value
 */
export function calculateTotalLocked(
  deposits: Array<{ amount: bigint; isEmergency: boolean }>
): bigint {
  return deposits
    .filter(d => !d.isEmergency)
    .reduce((sum, d) => sum + d.amount, BigInt(0));
}

/**
 * Filter deposits by status
 */
export function filterDepositsByStatus<T extends {
  depositTime: number;
  lockDuration: number;
  isEmergency: boolean;
}>(
  deposits: T[],
  status: 'locked' | 'unlocked' | 'emergency' | 'all'
): T[] {
  if (status === 'all') return deposits;

  return deposits.filter(d => {
    const depositStatus = getDepositStatus(d.depositTime, d.lockDuration, d.isEmergency);
    return depositStatus === status;
  });
}

/**
 * Sort deposits by maturity
 */
export function sortDepositsByMaturity<T extends {
  depositTime: number;
  lockDuration: number;
}>(
  deposits: T[],
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...deposits].sort((a, b) => {
    const maturityA = calculateMaturity(a.depositTime, a.lockDuration);
    const maturityB = calculateMaturity(b.depositTime, b.lockDuration);
    return order === 'asc' ? maturityA - maturityB : maturityB - maturityA;
  });
}

/**
 * Sort deposits by amount
 */
export function sortDepositsByAmount<T extends {
  amount: bigint;
}>(
  deposits: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...deposits].sort((a, b) => {
    const diff = a.amount - b.amount;
    return order === 'asc' 
      ? (diff > BigInt(0) ? 1 : diff < BigInt(0) ? -1 : 0)
      : (diff > BigInt(0) ? -1 : diff < BigInt(0) ? 1 : 0);
  });
}

/**
 * Get deposits expiring soon (within threshold)
 */
export function getExpiringSoonDeposits<T extends {
  depositTime: number;
  lockDuration: number;
  isEmergency: boolean;
}>(
  deposits: T[],
  thresholdSeconds: number = 86400 // 24 hours
): T[] {
  const now = Math.floor(Date.now() / 1000);

  return deposits.filter(d => {
    if (d.isEmergency) return false;
    
    const maturity = calculateMaturity(d.depositTime, d.lockDuration);
    const timeUntil = maturity - now;
    
    return timeUntil > 0 && timeUntil <= thresholdSeconds;
  });
}

/**
 * Calculate completion percentage
 */
export function calculateCompletionPercentage(
  depositTime: number,
  lockDuration: number
): number {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - depositTime;
  const percentage = (elapsed / lockDuration) * 100;
  return Math.min(100, Math.max(0, percentage));
}

/**
 * Estimate gas for deposit
 */
export function estimateDepositGas(amount: bigint): bigint {
  // Base gas + gas per token amount (simplified)
  const baseGas = BigInt(150000);
  const amountFactor = amount / BigInt(10 ** 6);
  return baseGas + (amountFactor * BigInt(1000));
}

/**
 * Validate lock duration
 */
export function isValidLockDuration(duration: number): boolean {
  const MIN_DURATION = 86400; // 1 day
  const MAX_DURATION = 31536000; // 1 year
  return duration >= MIN_DURATION && duration <= MAX_DURATION;
}
