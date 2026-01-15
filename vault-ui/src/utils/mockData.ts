/**
 * Mock data generators for testing and development
 */

import type { VaultDeposit, TransactionHistory, VaultStats } from '../types/vault';

/**
 * Generate random address
 */
export function generateAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

/**
 * Generate random transaction hash
 */
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Generate mock deposit
 */
export function generateMockDeposit(overrides?: Partial<VaultDeposit>): VaultDeposit {
  const now = Math.floor(Date.now() / 1000);
  const lockDuration = [30, 90, 180, 365][Math.floor(Math.random() * 4)];
  const amount = (Math.random() * 10000 + 100).toFixed(2);
  const rewards = (parseFloat(amount) * 0.05 * (lockDuration / 365)).toFixed(2);

  return {
    id: Math.random().toString(36).substring(7),
    user: generateAddress(),
    amount,
    lockDuration,
    depositTime: now - Math.floor(Math.random() * 30 * 24 * 60 * 60),
    unlockTime: now + lockDuration * 24 * 60 * 60,
    isUnlocked: Math.random() > 0.7,
    rewards,
    apy: lockDuration >= 365 ? 15 : lockDuration >= 180 ? 10 : lockDuration >= 90 ? 7 : 5,
    tier: lockDuration >= 365 ? 'Platinum' : lockDuration >= 180 ? 'Gold' : lockDuration >= 90 ? 'Silver' : 'Bronze',
    ...overrides,
  };
}

/**
 * Generate multiple mock deposits
 */
export function generateMockDeposits(count: number): VaultDeposit[] {
  return Array.from({ length: count }, () => generateMockDeposit());
}

/**
 * Generate mock transaction
 */
export function generateMockTransaction(overrides?: Partial<TransactionHistory>): TransactionHistory {
  const now = Date.now();
  const type = Math.random() > 0.5 ? 'deposit' : 'withdrawal';
  const status = ['pending', 'confirmed', 'failed'][Math.floor(Math.random() * 3)] as TransactionHistory['status'];

  return {
    hash: generateTxHash(),
    type,
    amount: (Math.random() * 5000 + 10).toFixed(2),
    timestamp: now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
    status,
    blockNumber: Math.floor(Math.random() * 1000000 + 15000000),
    from: generateAddress(),
    to: generateAddress(),
    ...overrides,
  };
}

/**
 * Generate multiple mock transactions
 */
export function generateMockTransactions(count: number): TransactionHistory[] {
  return Array.from({ length: count }, () => generateMockTransaction());
}

/**
 * Generate mock vault stats
 */
export function generateMockVaultStats(overrides?: Partial<VaultStats>): VaultStats {
  return {
    totalValueLocked: (Math.random() * 10000000 + 1000000).toFixed(2),
    totalDeposits: Math.floor(Math.random() * 1000 + 100),
    totalUsers: Math.floor(Math.random() * 500 + 50),
    averageAPY: parseFloat((Math.random() * 10 + 5).toFixed(2)),
    totalRewardsDistributed: (Math.random() * 500000 + 10000).toFixed(2),
    ...overrides,
  };
}

/**
 * Generate time series data for charts
 */
export function generateTimeSeriesData(days: number): Array<{ date: string; value: number }> {
  const data: Array<{ date: string; value: number }> = [];
  const now = new Date();
  let value = Math.random() * 1000 + 500;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk
    value += (Math.random() - 0.5) * value * 0.1;
    value = Math.max(value, 100); // Minimum value

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
    });
  }

  return data;
}

/**
 * Generate APY comparison data
 */
export function generateAPYComparisonData(): Array<{ duration: string; apy: number }> {
  return [
    { duration: '1 Week', apy: 3.0 },
    { duration: '2 Weeks', apy: 4.0 },
    { duration: '1 Month', apy: 5.0 },
    { duration: '3 Months', apy: 7.0 },
    { duration: '6 Months', apy: 10.0 },
    { duration: '1 Year', apy: 15.0 },
  ];
}

/**
 * Simulate API delay
 */
export function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock API response
 */
export async function mockApiCall<T>(data: T, delay: number = 500): Promise<T> {
  await simulateDelay(delay);
  
  // Simulate occasional failures (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Simulated API error');
  }
  
  return data;
}
