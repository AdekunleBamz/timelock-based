/**
 * Environment-specific configuration loader
 * Provides type-safe access to environment variables
 */

class Config {
  private static instance: Config;

  // API Configuration
  public readonly apiUrl: string;
  public readonly apiTimeout: number = 30000;

  // Blockchain Configuration
  public readonly chainId: number;
  public readonly rpcUrl: string;
  public readonly blockExplorer: string;

  // Contract Addresses
  public readonly vaultAddress: string;
  public readonly routerAddress: string;
  public readonly usdcAddress: string;

  // Feature Flags
  public readonly enableAnalytics: boolean;
  public readonly enableNotifications: boolean;
  public readonly enableDebugMode: boolean;

  // Environment
  public readonly isDevelopment: boolean;
  public readonly isProduction: boolean;
  public readonly isTest: boolean;

  private constructor() {
    // Load from environment variables
    this.apiUrl = this.getEnvVar('VITE_API_URL', 'http://localhost:3000/api');
    this.chainId = parseInt(this.getEnvVar('VITE_CHAIN_ID', '8453'));
    this.rpcUrl = this.getEnvVar('VITE_RPC_URL', 'https://mainnet.base.org');
    this.blockExplorer = this.getEnvVar(
      'VITE_BLOCK_EXPLORER',
      'https://basescan.org'
    );

    this.vaultAddress = this.getEnvVar(
      'VITE_VAULT_ADDRESS',
      '0x0000000000000000000000000000000000000000'
    );
    this.routerAddress = this.getEnvVar(
      'VITE_ROUTER_ADDRESS',
      '0x0000000000000000000000000000000000000000'
    );
    this.usdcAddress = this.getEnvVar(
      'VITE_USDC_ADDRESS',
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    );

    this.enableAnalytics = this.getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true';
    this.enableNotifications = this.getEnvVar('VITE_ENABLE_NOTIFICATIONS', 'true') === 'true';
    this.enableDebugMode = import.meta.env.DEV;

    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
    this.isTest = import.meta.env.MODE === 'test';

    // Validate required configurations
    this.validate();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Get environment variable with fallback
   */
  private getEnvVar(key: string, defaultValue: string): string {
    return import.meta.env[key] || defaultValue;
  }

  /**
   * Validate configuration
   */
  private validate(): void {
    const errors: string[] = [];

    if (!this.apiUrl) {
      errors.push('API URL is required');
    }

    if (!this.chainId || this.chainId <= 0) {
      errors.push('Valid Chain ID is required');
    }

    if (this.isProduction) {
      if (
        this.vaultAddress === '0x0000000000000000000000000000000000000000'
      ) {
        errors.push('Production vault address not configured');
      }

      if (
        this.routerAddress === '0x0000000000000000000000000000000000000000'
      ) {
        errors.push('Production router address not configured');
      }
    }

    if (errors.length > 0) {
      console.error('Configuration errors:', errors);
      if (this.isProduction) {
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
      }
    }
  }

  /**
   * Get network name from chain ID
   */
  public getNetworkName(): string {
    switch (this.chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 8453:
        return 'Base';
      case 84532:
        return 'Base Sepolia';
      default:
        return 'Unknown Network';
    }
  }

  /**
   * Check if current network is supported
   */
  public isSupportedNetwork(): boolean {
    return [1, 8453, 84532].includes(this.chainId);
  }

  /**
   * Get block explorer URL for address
   */
  public getExplorerUrl(address: string, type: 'address' | 'tx' = 'address'): string {
    return `${this.blockExplorer}/${type}/${address}`;
  }

  /**
   * Print configuration (for debugging)
   */
  public print(): void {
    if (!this.enableDebugMode) return;

    console.group('Application Configuration');
    console.log('Environment:', import.meta.env.MODE);
    console.log('API URL:', this.apiUrl);
    console.log('Chain ID:', this.chainId);
    console.log('Network:', this.getNetworkName());
    console.log('Vault Address:', this.vaultAddress);
    console.log('Router Address:', this.routerAddress);
    console.log('USDC Address:', this.usdcAddress);
    console.log('Analytics Enabled:', this.enableAnalytics);
    console.log('Notifications Enabled:', this.enableNotifications);
    console.groupEnd();
  }
}

// Export singleton instance
export const config = Config.getInstance();

// Print config in development
if (import.meta.env.DEV) {
  config.print();
}
