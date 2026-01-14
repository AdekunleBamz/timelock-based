import { MIN_DEPOSIT } from '../config/contracts';

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate deposit amount
 */
export function validateDepositAmount(
  amount: number,
  balance: number
): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Please enter a valid amount' };
  }
  
  if (amount < MIN_DEPOSIT) {
    return { valid: false, error: `Minimum deposit is ${MIN_DEPOSIT} USDC` };
  }
  
  if (amount > balance) {
    return { valid: false, error: 'Insufficient USDC balance' };
  }
  
  return { valid: true };
}

/**
 * Validate lock duration
 */
export function validateLockDuration(
  duration: number,
  allowedDurations: number[]
): { valid: boolean; error?: string } {
  if (!allowedDurations.includes(duration)) {
    return { valid: false, error: 'Invalid lock duration selected' };
  }
  
  return { valid: true };
}

/**
 * Check if a deposit can be withdrawn
 */
export function canWithdraw(unlockTime: Date, withdrawn: boolean): boolean {
  return !withdrawn && new Date() >= unlockTime;
}

/**
 * Check if a deposit can emergency withdraw
 */
export function canEmergencyWithdraw(withdrawn: boolean): boolean {
  return !withdrawn;
}

/**
 * Calculate penalty amount for emergency withdrawal
 */
export function calculatePenalty(principal: number, penaltyRate = 0.1): number {
  return principal * penaltyRate;
}

/**
 * Calculate fee amount
 */
export function calculateFee(amount: number, feeRate = 0.005): number {
  return amount * feeRate;
}

/**
 * Calculate net deposit after fee
 */
export function calculateNetDeposit(amount: number, feeRate = 0.005): number {
  return amount - calculateFee(amount, feeRate);
}
