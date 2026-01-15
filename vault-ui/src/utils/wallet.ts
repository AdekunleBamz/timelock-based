/**
 * Enhanced wallet utilities
 */

import { BrowserProvider, JsonRpcSigner } from 'ethers';

export interface WalletInfo {
  address: string;
  chainId: number;
  balance: string;
  ensName?: string;
}

/**
 * Get wallet balance in ETH
 */
export async function getWalletBalance(
  provider: BrowserProvider,
  address: string
): Promise<string> {
  const balance = await provider.getBalance(address);
  return (Number(balance) / 1e18).toFixed(4);
}

/**
 * Get ENS name for address
 */
export async function getEnsName(
  provider: BrowserProvider,
  address: string
): Promise<string | null> {
  try {
    return await provider.lookupAddress(address);
  } catch {
    return null;
  }
}

/**
 * Format wallet address for display
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Check if address is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get wallet info
 */
export async function getWalletInfo(
  provider: BrowserProvider,
  address: string
): Promise<WalletInfo> {
  const [balance, ensName, network] = await Promise.all([
    getWalletBalance(provider, address),
    getEnsName(provider, address),
    provider.getNetwork(),
  ]);

  return {
    address,
    chainId: Number(network.chainId),
    balance,
    ensName: ensName || undefined,
  };
}

/**
 * Switch network
 */
export async function switchNetwork(chainId: number): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // Chain not added yet
    if (error.code === 4902) {
      return false;
    }
    throw error;
  }
}

/**
 * Add network to wallet
 */
export async function addNetwork(config: {
  chainId: number;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${config.chainId.toString(16)}`,
          chainName: config.chainName,
          rpcUrls: config.rpcUrls,
          nativeCurrency: config.nativeCurrency,
          blockExplorerUrls: config.blockExplorerUrls,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Failed to add network:', error);
    return false;
  }
}

/**
 * Base Mainnet network config
 */
export const BASE_MAINNET_CONFIG = {
  chainId: 8453,
  chainName: 'Base Mainnet',
  rpcUrls: ['https://mainnet.base.org'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://basescan.org'],
};

/**
 * Request account access
 */
export async function requestAccounts(): Promise<string[]> {
  if (!window.ethereum) {
    throw new Error('No wallet detected');
  }

  return await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
}

/**
 * Watch for account changes
 */
export function watchAccountChanges(callback: (accounts: string[]) => void): () => void {
  if (!window.ethereum) return () => {};

  const handler = (accounts: string[]) => callback(accounts);
  window.ethereum.on('accountsChanged', handler);

  return () => {
    window.ethereum?.removeListener('accountsChanged', handler);
  };
}

/**
 * Watch for chain changes
 */
export function watchChainChanges(callback: (chainId: string) => void): () => void {
  if (!window.ethereum) return () => {};

  const handler = (chainId: string) => callback(chainId);
  window.ethereum.on('chainChanged', handler);

  return () => {
    window.ethereum?.removeListener('chainChanged', handler);
  };
}

/**
 * Sign message with wallet
 */
export async function signMessage(
  signer: JsonRpcSigner,
  message: string
): Promise<string> {
  return await signer.signMessage(message);
}

/**
 * Verify signed message
 */
export async function verifyMessage(
  message: string,
  signature: string,
  address: string
): Promise<boolean> {
  try {
    const { verifyMessage } = await import('ethers');
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Get wallet type
 */
export function getWalletType(): 'metamask' | 'coinbase' | 'trust' | 'other' | null {
  if (!window.ethereum) return null;

  if (window.ethereum.isMetaMask) return 'metamask';
  if (window.ethereum.isCoinbaseWallet) return 'coinbase';
  if (window.ethereum.isTrust) return 'trust';

  return 'other';
}

// Extend window type
declare global {
  interface Window {
    ethereum?: any;
  }
}
