/**
 * Transaction helper utilities
 */

import { ethers } from 'ethers';
import { logger } from './logger';

export interface TransactionMetadata {
  type: 'deposit' | 'withdraw' | 'emergency' | 'approve';
  amount?: string;
  depositId?: string;
  timestamp: number;
}

/**
 * Build transaction metadata
 */
export function buildTransactionMetadata(
  type: TransactionMetadata['type'],
  options: Partial<TransactionMetadata> = {}
): TransactionMetadata {
  return {
    type,
    timestamp: Math.floor(Date.now() / 1000),
    ...options,
  };
}

/**
 * Store pending transaction
 */
export function storePendingTransaction(
  hash: string,
  metadata: TransactionMetadata
): void {
  const key = `pending_tx_${hash}`;
  localStorage.setItem(key, JSON.stringify({
    hash,
    metadata,
    addedAt: Date.now(),
  }));
}

/**
 * Get pending transactions
 */
export function getPendingTransactions(): Array<{
  hash: string;
  metadata: TransactionMetadata;
  addedAt: number;
}> {
  const transactions: Array<{
    hash: string;
    metadata: TransactionMetadata;
    addedAt: number;
  }> = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('pending_tx_')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          transactions.push(JSON.parse(value));
        }
      } catch (error) {
        logger.error('Failed to parse pending transaction:', error);
      }
    }
  }

  return transactions;
}

/**
 * Remove pending transaction
 */
export function removePendingTransaction(hash: string): void {
  localStorage.removeItem(`pending_tx_${hash}`);
}

/**
 * Clear old pending transactions (older than 24 hours)
 */
export function clearOldPendingTransactions(): void {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const pending = getPendingTransactions();

  pending.forEach(tx => {
    if (tx.addedAt < oneDayAgo) {
      removePendingTransaction(tx.hash);
    }
  });
}

/**
 * Format transaction hash for display
 */
export function formatTransactionHash(hash: string, length: number = 10): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

/**
 * Get transaction URL for explorer
 */
export function getTransactionUrl(hash: string, explorerUrl: string = 'https://basescan.org'): string {
  return `${explorerUrl}/tx/${hash}`;
}

/**
 * Get address URL for explorer
 */
export function getAddressUrl(address: string, explorerUrl: string = 'https://basescan.org'): string {
  return `${explorerUrl}/address/${address}`;
}

/**
 * Wait for multiple transactions
 */
export async function waitForTransactions(
  provider: ethers.Provider,
  hashes: string[],
  confirmations: number = 1
): Promise<ethers.TransactionReceipt[]> {
  const promises = hashes.map(hash => 
    provider.waitForTransaction(hash, confirmations)
  );

  const receipts = await Promise.all(promises);
  return receipts.filter((receipt): receipt is ethers.TransactionReceipt => receipt !== null);
}

/**
 * Estimate total gas cost
 */
export async function estimateTotalGasCost(
  provider: ethers.Provider,
  gasLimit: bigint
): Promise<{ wei: bigint; eth: string; usd?: string }> {
  try {
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(0);
    const wei = gasPrice * gasLimit;
    const eth = ethers.formatEther(wei);

    return { wei, eth };
  } catch (error) {
    logger.error('Failed to estimate gas cost:', error);
    throw error;
  }
}

/**
 * Check if transaction succeeded
 */
export async function isTransactionSuccessful(
  provider: ethers.Provider,
  hash: string
): Promise<boolean> {
  try {
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt?.status === 1;
  } catch {
    return false;
  }
}

/**
 * Retry transaction with higher gas
 */
export async function retryTransaction(
  provider: ethers.Provider,
  originalTx: ethers.TransactionRequest,
  gasPriceIncrease: number = 20 // 20% increase
): Promise<ethers.TransactionResponse> {
  const feeData = await provider.getFeeData();
  const newGasPrice = feeData.gasPrice 
    ? (feeData.gasPrice * BigInt(100 + gasPriceIncrease)) / BigInt(100)
    : undefined;

  const signer = await provider.getSigner();
  return signer.sendTransaction({
    ...originalTx,
    gasPrice: newGasPrice,
  });
}

/**
 * Build transaction history key
 */
export function getTransactionHistoryKey(address: string): string {
  return `tx_history_${address.toLowerCase()}`;
}

/**
 * Save transaction to history
 */
export function saveTransactionToHistory(
  address: string,
  transaction: {
    hash: string;
    metadata: TransactionMetadata;
  }
): void {
  const key = getTransactionHistoryKey(address);
  const existing = localStorage.getItem(key);
  const history = existing ? JSON.parse(existing) : [];

  history.unshift({
    ...transaction,
    timestamp: Date.now(),
  });

  // Keep only last 100 transactions
  const trimmed = history.slice(0, 100);
  localStorage.setItem(key, JSON.stringify(trimmed));
}

/**
 * Get transaction history
 */
export function getTransactionHistory(address: string): Array<{
  hash: string;
  metadata: TransactionMetadata;
  timestamp: number;
}> {
  const key = getTransactionHistoryKey(address);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
