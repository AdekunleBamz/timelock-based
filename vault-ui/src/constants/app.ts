/**
 * Constants for the application
 */

export const APP_NAME = 'Timelock Vault';
export const APP_VERSION = '1.0.0';

export const SECONDS_PER = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
  YEAR: 31536000,
} as const;

export const LOCK_DURATION_PRESETS = [
  { label: '1 Day', value: SECONDS_PER.DAY },
  { label: '1 Week', value: SECONDS_PER.WEEK },
  { label: '1 Month', value: SECONDS_PER.MONTH },
  { label: '3 Months', value: SECONDS_PER.MONTH * 3 },
  { label: '6 Months', value: SECONDS_PER.MONTH * 6 },
  { label: '1 Year', value: SECONDS_PER.YEAR },
] as const;

export const DEPOSIT_AMOUNTS_PRESETS = [
  { label: '100 USDC', value: '100' },
  { label: '500 USDC', value: '500' },
  { label: '1,000 USDC', value: '1000' },
  { label: '5,000 USDC', value: '5000' },
  { label: '10,000 USDC', value: '10000' },
] as const;

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  EMERGENCY: 'emergency',
  APPROVE: 'approve',
} as const;

export const DEPOSIT_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  EMERGENCY: 'emergency',
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const NETWORK_CONFIGS = {
  BASE_MAINNET: {
    chainId: 8453,
    name: 'Base Mainnet',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  BASE_SEPOLIA: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as const;

export const TOKEN_CONFIGS = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: {
      BASE_MAINNET: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      BASE_SEPOLIA: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    },
  },
} as const;

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
  ULTRA_WIDE: 1536,
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  SLOWER: 500,
} as const;

export const POLLING_INTERVALS = {
  FAST: 3000,
  NORMAL: 5000,
  SLOW: 10000,
  VERY_SLOW: 30000,
} as const;

export const CACHE_DURATIONS = {
  SHORT: 60000, // 1 minute
  MEDIUM: 300000, // 5 minutes
  LONG: 900000, // 15 minutes
  VERY_LONG: 3600000, // 1 hour
} as const;

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  INSUFFICIENT_ALLOWANCE: 'Please approve token spending first',
  TRANSACTION_REJECTED: 'Transaction was rejected',
  NETWORK_ERROR: 'Network error occurred. Please try again',
  INVALID_AMOUNT: 'Please enter a valid amount',
  INVALID_DURATION: 'Please select a valid lock duration',
  DEPOSIT_NOT_MATURE: 'Deposit is not yet mature for withdrawal',
  CONTRACT_ERROR: 'Contract interaction failed',
} as const;

export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  DEPOSIT_CREATED: 'Deposit created successfully',
  WITHDRAWAL_COMPLETED: 'Withdrawal completed successfully',
  APPROVAL_GRANTED: 'Token approval granted',
  TRANSACTION_CONFIRMED: 'Transaction confirmed',
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: 'app_theme',
  WALLET_ADDRESS: 'wallet_address',
  NOTIFICATIONS: 'app_notifications',
  TRANSACTION_HISTORY: 'tx_history',
  USER_PREFERENCES: 'user_preferences',
  CACHE_PREFIX: 'cache_',
} as const;

export const EXTERNAL_LINKS = {
  DOCUMENTATION: 'https://docs.example.com',
  GITHUB: 'https://github.com/example/timelock-vault',
  TWITTER: 'https://twitter.com/example',
  DISCORD: 'https://discord.gg/example',
  SUPPORT: 'mailto:support@example.com',
} as const;
