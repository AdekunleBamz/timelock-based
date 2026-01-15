/**
 * Environment variable validation and loading
 */

interface RequiredEnvVars {
  VITE_CHAIN_ID: string;
  VITE_USDC_ADDRESS: string;
}

interface OptionalEnvVars {
  VITE_API_URL?: string;
  VITE_RPC_URL?: string;
  VITE_BLOCK_EXPLORER?: string;
  VITE_VAULT_ADDRESS?: string;
  VITE_ROUTER_ADDRESS?: string;
  VITE_ENABLE_ANALYTICS?: string;
  VITE_ENABLE_NOTIFICATIONS?: string;
}

type EnvVars = RequiredEnvVars & OptionalEnvVars;

/**
 * Validate required environment variables
 */
function validateEnv(): void {
  const required: (keyof RequiredEnvVars)[] = [
    'VITE_CHAIN_ID',
    'VITE_USDC_ADDRESS',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(message);
    
    if (import.meta.env.PROD) {
      throw new Error(message);
    }
  }
}

/**
 * Get environment variable with type safety
 */
export function getEnv<K extends keyof EnvVars>(
  key: K,
  defaultValue?: string
): string {
  const value = import.meta.env[key];
  
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set and has no default`);
    return '';
  }
  
  return value || defaultValue || '';
}

/**
 * Get boolean environment variable
 */
export function getEnvBoolean(key: string, defaultValue = false): boolean {
  const value = import.meta.env[key];
  
  if (!value) return defaultValue;
  
  return value.toLowerCase() === 'true';
}

/**
 * Get number environment variable
 */
export function getEnvNumber(key: string, defaultValue = 0): number {
  const value = import.meta.env[key];
  
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    console.warn(`Environment variable ${key} is not a valid number: ${value}`);
    return defaultValue;
  }
  
  return parsed;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return import.meta.env.MODE === 'test';
}

/**
 * Get current environment mode
 */
export function getMode(): string {
  return import.meta.env.MODE;
}

// Validate environment on module load
validateEnv();

// Log environment info in development
if (isDevelopment()) {
  console.group('Environment Configuration');
  console.log('Mode:', getMode());
  console.log('Chain ID:', getEnv('VITE_CHAIN_ID'));
  console.log('USDC Address:', getEnv('VITE_USDC_ADDRESS'));
  console.log('Analytics:', getEnvBoolean('VITE_ENABLE_ANALYTICS'));
  console.groupEnd();
}

export default {
  get: getEnv,
  getBoolean: getEnvBoolean,
  getNumber: getEnvNumber,
  isDevelopment,
  isProduction,
  isTest,
  getMode,
};
