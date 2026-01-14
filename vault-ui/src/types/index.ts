// Common type definitions for the application

/**
 * Wallet connection state
 */
export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectChain: boolean;
  chainId: number | null;
  error: string | null;
}

/**
 * Wallet actions interface
 */
export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
  refreshEthBalance: () => Promise<void>;
}

/**
 * Complete wallet interface
 */
export type Wallet = WalletState & WalletActions & {
  ethBalance: string;
  signer: unknown | null;
};

/**
 * Deposit information from contract
 */
export interface Deposit {
  id: number;
  owner: string;
  principal: bigint;
  principalFormatted: string;
  startTime: Date;
  unlockTime: Date;
  withdrawn: boolean;
  isUnlocked: boolean;
}

/**
 * Deposit status enum
 */
export type DepositStatus = 'active' | 'unlocked' | 'withdrawn';

/**
 * Lock duration option
 */
export interface LockOption {
  label: string;
  value: number;
  description?: string;
}

/**
 * Transaction status
 */
export type TransactionStatus = 'pending' | 'success' | 'error' | 'cancelled';

/**
 * Transaction information
 */
export interface Transaction {
  hash: string;
  type: 'deposit' | 'withdraw' | 'emergency_withdraw' | 'approve';
  amount?: string;
  status: TransactionStatus;
  timestamp: Date;
  blockNumber?: number;
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'pending';

/**
 * Toast message
 */
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

/**
 * Stats card item
 */
export interface StatItem {
  label: string;
  value: string;
  icon?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

/**
 * Contract addresses
 */
export interface ContractAddresses {
  USDC: string;
  LOCK_OPTIONS: string;
  VAULT_TREASURY: string;
  TIMELOCK_VAULT: string;
  VAULT_ROUTER: string;
}
