/**
 * TypeScript type definitions for vault operations
 */

export interface VaultDeposit {
  id: string;
  user: string;
  amount: string;
  lockDuration: number;
  depositTime: number;
  unlockTime: number;
  isUnlocked: boolean;
  rewards: string;
  apy: number;
  tier: string;
}

export interface VaultStats {
  totalValueLocked: string;
  totalDeposits: number;
  totalUsers: number;
  averageAPY: number;
  totalRewardsDistributed: string;
}

export interface TransactionHistory {
  hash: string;
  type: 'deposit' | 'withdrawal';
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  from: string;
  to: string;
}

export interface UserProfile {
  address: string;
  totalDeposited: string;
  totalWithdrawn: string;
  activeDeposits: number;
  totalRewards: string;
  joinedAt: number;
}

export interface LockOption {
  days: number;
  label: string;
  apy: number;
  tier: string;
  minAmount: string;
  maxAmount?: string;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ContractAddresses {
  vault: string;
  router: string;
  usdc: string;
  lockOptions?: string;
  treasury?: string;
}

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  estimatedCost: string;
  estimatedCostUSD?: string;
}

export interface WithdrawalRequest {
  depositId: string;
  amount: string;
  requestedAt: number;
  executedAt?: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  order: SortOrder;
}

export interface FilterConfig {
  search?: string;
  status?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}
