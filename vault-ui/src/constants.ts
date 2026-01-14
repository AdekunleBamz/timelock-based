/**
 * Constants for the application
 */

// Network constants
export const CHAIN_ID = 8453; // Base mainnet
export const CHAIN_NAME = 'Base';
export const RPC_URL = 'https://mainnet.base.org';
export const BLOCK_EXPLORER = 'https://basescan.org';

// Contract addresses (example addresses)
export const CONTRACT_ADDRESSES = {
  VAULT: '0x0000000000000000000000000000000000000000',
  ROUTER: '0x0000000000000000000000000000000000000000',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
  TREASURY: '0x0000000000000000000000000000000000000000',
} as const;

// Lock duration options (in days)
export const LOCK_DURATIONS = [7, 30, 90, 180, 365] as const;

// APY rates by duration
export const APY_RATES: Record<number, number> = {
  7: 5,
  30: 8,
  90: 10,
  180: 12,
  365: 15,
};

// Transaction types
export const TX_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  CLAIM: 'claim',
} as const;

// Status types
export const STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'timelock-vault-theme',
  WALLET_ADDRESS: 'timelock-vault-wallet',
  LAST_CONNECTED: 'timelock-vault-last-connected',
  DEPOSITS_CACHE: 'timelock-vault-deposits-cache',
} as const;

// UI constants
export const ITEMS_PER_PAGE = 10;
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;
export const MODAL_ANIMATION_DURATION = 200;

// Format constants
export const DECIMAL_PLACES = 2;
export const MAX_DECIMALS = 6;
export const MIN_DEPOSIT_AMOUNT = '10';
export const MAX_DEPOSIT_AMOUNT = '1000000';

// API endpoints
export const API_ENDPOINTS = {
  DEPOSITS: '/api/deposits',
  TRANSACTIONS: '/api/transactions',
  STATS: '/api/stats',
  REWARDS: '/api/rewards',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_AMOUNT: 'Invalid amount',
  TRANSACTION_FAILED: 'Transaction failed',
  NETWORK_ERROR: 'Network error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DEPOSIT_SUCCESS: 'Deposit successful',
  WITHDRAW_SUCCESS: 'Withdrawal successful',
  CLAIM_SUCCESS: 'Rewards claimed successfully',
} as const;
