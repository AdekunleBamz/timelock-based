// Environment variables with type safety

interface EnvConfig {
  // Chain configuration
  CHAIN_ID: number;
  RPC_URL: string;
  BLOCK_EXPLORER: string;
  
  // Feature flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_DEBUG_MODE: boolean;
  
  // API endpoints
  API_BASE_URL: string;
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
  // Chain configuration - defaults to Base Mainnet
  CHAIN_ID: getEnvNumber('VITE_CHAIN_ID', 8453),
  RPC_URL: getEnvVar('VITE_RPC_URL', 'https://mainnet.base.org'),
  BLOCK_EXPLORER: getEnvVar('VITE_BLOCK_EXPLORER', 'https://basescan.org'),
  
  // Feature flags
  ENABLE_ANALYTICS: getEnvBool('VITE_ENABLE_ANALYTICS', false),
  ENABLE_DEBUG_MODE: getEnvBool('VITE_ENABLE_DEBUG_MODE', false),
  
  // API endpoints
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', ''),
};

// Validate required environment variables in development
if (import.meta.env.DEV) {
  console.log('Environment configuration loaded:', {
    chainId: env.CHAIN_ID,
    rpcUrl: env.RPC_URL.slice(0, 30) + '...',
    debugMode: env.ENABLE_DEBUG_MODE,
  });
}
