/**
 * Blockchain utility functions
 */

import { ethers } from 'ethers';

/**
 * Format a blockchain transaction hash for display
 */
export function formatTxHash(hash: string, chars = 8): string {
  if (!hash || hash.length < chars * 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerTxUrl(txHash: string, chainId = 8453): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/tx/',
    8453: 'https://basescan.org/tx/',
    84531: 'https://goerli.basescan.org/tx/',
    84532: 'https://sepolia.basescan.org/tx/',
  };
  const baseUrl = explorers[chainId] ?? explorers[8453];
  return `${baseUrl}${txHash}`;
}

/**
 * Get explorer URL for an address
 */
export function getExplorerAddressUrl(address: string, chainId = 8453): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/address/',
    8453: 'https://basescan.org/address/',
    84531: 'https://goerli.basescan.org/address/',
    84532: 'https://sepolia.basescan.org/address/',
  };
  const baseUrl = explorers[chainId] ?? explorers[8453];
  return `${baseUrl}${address}`;
}

/**
 * Check if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Convert Wei to Ether
 */
export function weiToEther(wei: bigint | string): string {
  return ethers.formatEther(wei);
}

/**
 * Convert Ether to Wei
 */
export function etherToWei(ether: string | number): bigint {
  return ethers.parseEther(String(ether));
}

/**
 * Parse USDC amount (6 decimals)
 */
export function parseUSDC(amount: string | number): bigint {
  return ethers.parseUnits(String(amount), 6);
}

/**
 * Format USDC amount from raw value
 */
export function formatUSDCRaw(raw: bigint | string): string {
  return ethers.formatUnits(raw, 6);
}

/**
 * Get short network name
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum',
    8453: 'Base',
    84531: 'Base Goerli',
    84532: 'Base Sepolia',
  };
  return networks[chainId] ?? `Chain ${chainId}`;
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  provider: ethers.Provider,
  txHash: string,
  confirmations = 1
): Promise<ethers.TransactionReceipt | null> {
  return provider.waitForTransaction(txHash, confirmations);
}
