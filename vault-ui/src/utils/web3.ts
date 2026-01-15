/**
 * Web3 wallet connection utilities
 */

import { ethers } from 'ethers';
import { logger } from './logger';

export interface WalletInfo {
  address: string;
  chainId: number;
  balance: string;
  ensName: string | null;
}

/**
 * Request wallet connection
 */
export async function connectWallet(): Promise<WalletInfo> {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected');
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
    
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    
    let ensName: string | null = null;
    try {
      ensName = await provider.lookupAddress(address);
    } catch {
      // ENS lookup failed, ignore
    }
    
    return {
      address,
      chainId: Number(network.chainId),
      balance: ethers.formatEther(balance),
      ensName,
    };
  } catch (error) {
    logger.error('Failed to connect wallet:', error);
    throw error;
  }
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet(): Promise<void> {
  // Clear any cached wallet data
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('walletAddress');
  
  // Some wallets support disconnect
  if (window.ethereum?.removeAllListeners) {
    window.ethereum.removeAllListeners();
  }
}

/**
 * Switch network
 */
export async function switchNetwork(chainId: number): Promise<void> {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // Chain not added to wallet
    if (error.code === 4902) {
      throw new Error('Network not added to wallet');
    }
    logger.error('Failed to switch network:', error);
    throw error;
  }
}

/**
 * Add network to wallet
 */
export async function addNetwork(params: {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}): Promise<void> {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${params.chainId.toString(16)}`,
        chainName: params.chainName,
        nativeCurrency: params.nativeCurrency,
        rpcUrls: params.rpcUrls,
        blockExplorerUrls: params.blockExplorerUrls,
      }],
    });
  } catch (error) {
    logger.error('Failed to add network:', error);
    throw error;
  }
}

/**
 * Add token to wallet
 */
export async function addTokenToWallet(params: {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
}): Promise<void> {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: params,
      },
    });
  } catch (error) {
    logger.error('Failed to add token:', error);
    throw error;
  }
}

/**
 * Sign message
 */
export async function signMessage(message: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected');
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  } catch (error) {
    logger.error('Failed to sign message:', error);
    throw error;
  }
}

/**
 * Verify signature
 */
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    logger.error('Failed to verify signature:', error);
    return false;
  }
}

/**
 * Get wallet type
 */
export function getWalletType(): string | null {
  if (!window.ethereum) return null;
  
  if (window.ethereum.isMetaMask) return 'MetaMask';
  if (window.ethereum.isCoinbaseWallet) return 'Coinbase Wallet';
  if (window.ethereum.isRabby) return 'Rabby';
  if (window.ethereum.isTrust) return 'Trust Wallet';
  
  return 'Unknown';
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected(): Promise<boolean> {
  if (!window.ethereum) return false;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get current account
 */
export async function getCurrentAccount(): Promise<string | null> {
  if (!window.ethereum) return null;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch {
    return null;
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(address: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected');
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    logger.error('Failed to get account balance:', error);
    throw error;
  }
}

/**
 * Request permissions
 */
export async function requestPermissions(): Promise<any> {
  if (!window.ethereum) {
    throw new Error('No wallet extension detected');
  }
  
  try {
    return await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    });
  } catch (error) {
    logger.error('Failed to request permissions:', error);
    throw error;
  }
}

// Extend Window interface
declare global {
  interface Window {
    ethereum?: any;
  }
}
