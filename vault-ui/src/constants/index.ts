// Application-wide constants

// Time constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Toast notification durations
export const TOAST_DURATION = {
  SUCCESS: 4000,
  ERROR: 6000,
  WARNING: 5000,
  INFO: 4000,
} as const;

// Refresh intervals
export const REFRESH_INTERVAL = {
  BALANCE: 30000,      // 30 seconds
  DEPOSITS: 60000,     // 1 minute
  COUNTDOWN: 1000,     // 1 second
  VAULT_STATS: 120000, // 2 minutes
} as const;

// UI limits
export const UI_LIMITS = {
  MAX_DEPOSITS_SHOWN: 50,
  MAX_TRANSACTIONS_SHOWN: 10,
  ADDRESS_PREFIX_LENGTH: 6,
  ADDRESS_SUFFIX_LENGTH: 4,
  MAX_DECIMAL_DISPLAY: 4,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'timevault-theme',
  LAST_WALLET: 'timevault-last-wallet',
  HIDDEN_DEPOSITS: 'timevault-hidden-deposits',
} as const;
