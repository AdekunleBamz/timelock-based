/**
 * Application constants
 */

// Time constants (in seconds)
export const TIME = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
  YEAR: 31536000,
} as const;

// Lock duration presets (in seconds)
export const LOCK_DURATIONS = {
  ONE_DAY: TIME.DAY,
  THREE_DAYS: TIME.DAY * 3,
  ONE_WEEK: TIME.WEEK,
  TWO_WEEKS: TIME.WEEK * 2,
  ONE_MONTH: TIME.MONTH,
  THREE_MONTHS: TIME.MONTH * 3,
  SIX_MONTHS: TIME.MONTH * 6,
  ONE_YEAR: TIME.YEAR,
} as const;

// Lock duration labels
export const LOCK_DURATION_LABELS: Record<number, string> = {
  [LOCK_DURATIONS.ONE_DAY]: '1 Day',
  [LOCK_DURATIONS.THREE_DAYS]: '3 Days',
  [LOCK_DURATIONS.ONE_WEEK]: '1 Week',
  [LOCK_DURATIONS.TWO_WEEKS]: '2 Weeks',
  [LOCK_DURATIONS.ONE_MONTH]: '1 Month',
  [LOCK_DURATIONS.THREE_MONTHS]: '3 Months',
  [LOCK_DURATIONS.SIX_MONTHS]: '6 Months',
  [LOCK_DURATIONS.ONE_YEAR]: '1 Year',
};

// Transaction status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMING: 'confirming',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  EMERGENCY: 'emergency',
  APPROVE: 'approve',
} as const;

// Deposit status
export const DEPOSIT_STATUS = {
  ACTIVE: 'active',
  MATURED: 'matured',
  WITHDRAWN: 'withdrawn',
  EMERGENCY: 'emergency',
} as const;

// Network constants
export const NETWORKS = {
  BASE_MAINNET: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  BASE_SEPOLIA: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as const;

// Gas limits
export const GAS_LIMITS = {
  APPROVE: 100000n,
  DEPOSIT: 250000n,
  WITHDRAW: 200000n,
  EMERGENCY: 200000n,
} as const;

// UI constants
export const UI = {
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  THROTTLE_DELAY: 200,
  POLLING_INTERVAL: 10000,
} as const;

// Validation constants
export const VALIDATION = {
  MIN_DEPOSIT_AMOUNT: 0.01,
  MAX_DEPOSIT_AMOUNT: 1000000,
  MIN_LOCK_DURATION: TIME.DAY,
  MAX_LOCK_DURATION: TIME.YEAR,
  ADDRESS_LENGTH: 42,
  TRANSACTION_HASH_LENGTH: 66,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'walletAddress',
  WALLET_CONNECTED: 'walletConnected',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  TRANSACTION_HISTORY: 'transactionHistory',
  RECENT_DEPOSITS: 'recentDeposits',
  USER_PREFERENCES: 'userPreferences',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  GAS_PRICE: 'https://gas.base.org/gas-price',
  TOKEN_PRICE: 'https://api.coingecko.com/api/v3/simple/price',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  WRONG_NETWORK: 'Please switch to Base network',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  TRANSACTION_REJECTED: 'Transaction was rejected',
  TRANSACTION_FAILED: 'Transaction failed',
  INVALID_AMOUNT: 'Invalid amount',
  INVALID_ADDRESS: 'Invalid address',
  INVALID_DURATION: 'Invalid lock duration',
  DEPOSIT_NOT_FOUND: 'Deposit not found',
  DEPOSIT_LOCKED: 'Deposit is still locked',
  APPROVAL_REQUIRED: 'Token approval required',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  TRANSACTION_SUBMITTED: 'Transaction submitted',
  TRANSACTION_CONFIRMED: 'Transaction confirmed',
  DEPOSIT_CREATED: 'Deposit created successfully',
  WITHDRAWAL_SUCCESSFUL: 'Withdrawal successful',
  EMERGENCY_SUCCESSFUL: 'Emergency withdrawal successful',
  APPROVAL_SUCCESSFUL: 'Approval successful',
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_PWA: true,
  ENABLE_DARK_MODE: true,
  ENABLE_EXPORT: true,
  ENABLE_CHARTS: true,
} as const;

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#6366f1',
  GRAY: '#6b7280',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;
