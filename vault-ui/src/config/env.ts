/**
 * Environment variables with comprehensive type safety
 * Add new environment variables to .env.example and here
 */

interface EnvConfig {
  // Application
  APP_NAME: string;
  APP_VERSION: string;
  
  // Chain configuration
  CHAIN_ID: number;
  CHAIN_NAME: string;
  RPC_URL: string;
  BLOCK_EXPLORER: string;
  
  // Contract addresses
  VAULT_ADDRESS: string;
  ROUTER_ADDRESS: string;
  USDC_ADDRESS: string;
  TREASURY_ADDRESS: string;
  
  // Feature flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_DEBUG_MODE: boolean;
  ENABLE_PWA: boolean;
  ENABLE_NOTIFICATIONS: boolean;
  
  // API endpoints
  API_BASE_URL: string;
  BASESCAN_API_KEY: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] ?? defaultValue;
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  return value;
}

function getEnvBool(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export const env: EnvConfig = {
  // Application
  APP_NAME: getEnvVar('VITE_APP_NAME', 'Timelock Savings Vault'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // Chain configuration - defaults to Base Mainnet
  CHAIN_ID: getEnvNumber('VITE_CHAIN_ID', 8453),
  CHAIN_NAME: getEnvVar('VITE_CHAIN_NAME', 'Base'),
  RPC_URL: getEnvVar('VITE_RPC_URL', 'https://mainnet.base.org'),
  BLOCK_EXPLORER: getEnvVar('VITE_BLOCK_EXPLORER', 'https://basescan.org'),
  
  // Contract addresses
  VAULT_ADDRESS: getEnvVar('VITE_VAULT_ADDRESS', ''),
  ROUTER_ADDRESS: getEnvVar('VITE_ROUTER_ADDRESS', ''),
  USDC_ADDRESS: getEnvVar('VITE_USDC_ADDRESS', '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
  TREASURY_ADDRESS: getEnvVar('VITE_TREASURY_ADDRESS', ''),
  
  // Feature flags
  ENABLE_ANALYTICS: getEnvBool('VITE_ENABLE_ANALYTICS', false),
  ENABLE_DEBUG_MODE: getEnvBool('VITE_ENABLE_DEBUG_MODE', false),
  ENABLE_PWA: getEnvBool('VITE_ENABLE_PWA', true),
  ENABLE_NOTIFICATIONS: getEnvBool('VITE_ENABLE_NOTIFICATIONS', true),
  
  // API endpoints
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', ''),
  BASESCAN_API_KEY: getEnvVar('VITE_BASESCAN_API_KEY', ''),
};

// Export environment helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const isDebugMode = env.ENABLE_DEBUG_MODE || isDevelopment;

// Validate required environment variables
export function validateEnv(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check critical contract addresses in production
  if (isProduction) {
    if (!env.VAULT_ADDRESS || env.VAULT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      errors.push('VITE_VAULT_ADDRESS is not configured for production');
    }
    if (!env.ROUTER_ADDRESS || env.ROUTER_ADDRESS === '0x0000000000000000000000000000000000000000') {
      errors.push('VITE_ROUTER_ADDRESS is not configured for production');
    }
  } else {
    // Warnings for development
    if (!env.VAULT_ADDRESS) warnings.push('VITE_VAULT_ADDRESS not set');
    if (!env.ROUTER_ADDRESS) warnings.push('VITE_ROUTER_ADDRESS not set');
  }

  if (!env.RPC_URL) {
    errors.push('VITE_RPC_URL is required');
  }

  if (!env.USDC_ADDRESS) {
    warnings.push('VITE_USDC_ADDRESS not set, using default Base USDC');
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Log configuration in development
if (isDevelopment && isDebugMode) {
  console.log('🔧 Environment Configuration:', {
    app: `${env.APP_NAME} v${env.APP_VERSION}`,
    chain: `${env.CHAIN_NAME} (${env.CHAIN_ID})`,
    rpcUrl: env.RPC_URL.slice(0, 40) + '...',
    features: {
      pwa: env.ENABLE_PWA,
      notifications: env.ENABLE_NOTIFICATIONS,
      analytics: env.ENABLE_ANALYTICS,
    },
    mode: isDevelopment ? 'development' : 'production',
  });
  
  const validation = validateEnv();
  if (!validation.valid) {
    console.error('❌ Environment validation errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Environment warnings:', validation.warnings);
  }
}
