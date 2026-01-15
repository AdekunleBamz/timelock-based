/**
 * Configuration for different environments
 */

interface EnvironmentConfig {
  apiUrl: string;
  chainId: number;
  networkName: string;
  blockExplorer: string;
  contracts: {
    vault: string;
    router: string;
    usdc: string;
  };
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableDebugMode: boolean;
  };
}

const development: EnvironmentConfig = {
  apiUrl: 'http://localhost:3000/api',
  chainId: 8453,
  networkName: 'Base Mainnet',
  blockExplorer: 'https://basescan.org',
  contracts: {
    vault: '0x0000000000000000000000000000000000000000',
    router: '0x0000000000000000000000000000000000000000',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  features: {
    enableAnalytics: false,
    enableNotifications: true,
    enableDebugMode: true,
  },
};

const production: EnvironmentConfig = {
  apiUrl: 'https://api.timelockv ault.com',
  chainId: 8453,
  networkName: 'Base Mainnet',
  blockExplorer: 'https://basescan.org',
  contracts: {
    vault: '0x0000000000000000000000000000000000000000', // Replace with actual
    router: '0x0000000000000000000000000000000000000000', // Replace with actual
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableDebugMode: false,
  },
};

const test: EnvironmentConfig = {
  apiUrl: 'http://localhost:3001/api',
  chainId: 84532, // Base Sepolia testnet
  networkName: 'Base Sepolia',
  blockExplorer: 'https://sepolia.basescan.org',
  contracts: {
    vault: '0x0000000000000000000000000000000000000000',
    router: '0x0000000000000000000000000000000000000000',
    usdc: '0x0000000000000000000000000000000000000000',
  },
  features: {
    enableAnalytics: false,
    enableNotifications: false,
    enableDebugMode: true,
  },
};

function getConfig(): EnvironmentConfig {
  const env = import.meta.env.MODE;

  switch (env) {
    case 'production':
      return production;
    case 'test':
      return test;
    default:
      return development;
  }
}

export const config = getConfig();
export type { EnvironmentConfig };
