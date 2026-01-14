/**
 * Type definitions for the application
 */

export interface Deposit {
  id: string;
  amount: string;
  lockDuration: number;
  depositTime: number;
  unlockTime: number;
  optionId: number;
  status: 'locked' | 'unlocked' | 'withdrawn';
  apy: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'claim';
  amount: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  hash?: string;
}

export interface UserStats {
  totalDeposited: string;
  totalWithdrawn: string;
  activeDeposits: number;
  totalEarned: string;
  pendingRewards: string;
}

export interface LockOption {
  id: number;
  duration: number;
  apy: number;
  minDeposit: string;
  maxDeposit: string;
}

export interface VaultStats {
  totalValueLocked: string;
  totalUsers: number;
  averageApy: number;
  totalRewardsDistributed: string;
}

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  chainId: number | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  value: any;
  operator?: 'eq' | 'gt' | 'lt' | 'contains';
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export type Theme = 'light' | 'dark' | 'auto';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type ButtonSize = 'small' | 'medium' | 'large';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
