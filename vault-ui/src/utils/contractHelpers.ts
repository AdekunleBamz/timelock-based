/**
 * Enhanced contract interaction helpers
 */

import { ethers } from 'ethers';
import { logger } from './logger';

/**
 * Estimate gas with buffer
 */
export async function estimateGasWithBuffer(
  transaction: ethers.TransactionRequest,
  bufferPercent: number = 20
): Promise<bigint> {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const estimate = await provider.estimateGas(transaction);
    const buffer = (estimate * BigInt(bufferPercent)) / BigInt(100);
    return estimate + buffer;
  } catch (error) {
    logger.error('Gas estimation failed:', error);
    throw error;
  }
}

/**
 * Get optimal gas price with priority
 */
export async function getOptimalGasPrice(priority: 'low' | 'medium' | 'high' = 'medium'): Promise<bigint> {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const feeData = await provider.getFeeData();
    
    if (!feeData.gasPrice) {
      throw new Error('Gas price not available');
    }
    
    const multipliers = {
      low: 100,
      medium: 110,
      high: 120,
    };
    
    const multiplier = BigInt(multipliers[priority]);
    return (feeData.gasPrice * multiplier) / BigInt(100);
  } catch (error) {
    logger.error('Failed to get optimal gas price:', error);
    throw error;
  }
}

/**
 * Wait for transaction with retries
 */
export async function waitForTransactionWithRetries(
  provider: ethers.Provider,
  txHash: string,
  confirmations: number = 1,
  maxRetries: number = 3
): Promise<ethers.TransactionReceipt> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const receipt = await provider.waitForTransaction(txHash, confirmations, 120000); // 2 min timeout
      
      if (!receipt) {
        throw new Error('Transaction receipt not found');
      }
      
      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }
      
      return receipt;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        logger.error('Max retries reached for transaction:', txHash);
        throw error;
      }
      logger.warn(`Retry ${retries}/${maxRetries} for transaction:`, txHash);
      await new Promise(resolve => setTimeout(resolve, 5000 * retries));
    }
  }
  
  throw new Error('Failed to get transaction receipt');
}

/**
 * Check if transaction is still pending
 */
export async function isTransactionPending(
  provider: ethers.Provider,
  txHash: string
): Promise<boolean> {
  try {
    const tx = await provider.getTransaction(txHash);
    return tx !== null && tx.blockNumber === null;
  } catch {
    return false;
  }
}

/**
 * Get transaction error reason
 */
export async function getTransactionError(
  provider: ethers.Provider,
  txHash: string
): Promise<string | null> {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx) return null;
    
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || receipt.status === 1) return null;
    
    // Try to get revert reason
    try {
      await provider.call({
        to: tx.to,
        data: tx.data,
        from: tx.from,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
        value: tx.value,
      }, receipt.blockNumber);
    } catch (error: any) {
      if (error.reason) return error.reason;
      if (error.message) return error.message;
    }
    
    return 'Transaction failed';
  } catch (error) {
    logger.error('Failed to get transaction error:', error);
    return null;
  }
}

/**
 * Batch contract calls
 */
export async function batchContractCalls<T>(
  calls: Array<() => Promise<T>>,
  batchSize: number = 5
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < calls.length; i += batchSize) {
    const batch = calls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(call => call()));
    results.push(...batchResults);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < calls.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Encode function data
 */
export function encodeFunctionData(
  iface: ethers.Interface,
  functionName: string,
  args: any[]
): string {
  return iface.encodeFunctionData(functionName, args);
}

/**
 * Decode function result
 */
export function decodeFunctionResult(
  iface: ethers.Interface,
  functionName: string,
  data: string
): any {
  return iface.decodeFunctionResult(functionName, data);
}

/**
 * Parse contract error
 */
export function parseContractError(error: any): string {
  if (error.reason) return error.reason;
  if (error.message) {
    // Extract revert reason from error message
    const match = error.message.match(/reason="([^"]+)"/);
    if (match) return match[1];
    
    // Common error patterns
    if (error.message.includes('user rejected')) return 'Transaction rejected by user';
    if (error.message.includes('insufficient funds')) return 'Insufficient funds for transaction';
    if (error.message.includes('nonce too low')) return 'Transaction nonce too low';
    if (error.message.includes('replacement transaction underpriced')) return 'Replacement transaction underpriced';
    
    return error.message;
  }
  
  return 'Unknown contract error';
}

/**
 * Create contract instance with error handling
 */
export function createContract<T extends ethers.Contract>(
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.Provider
): T {
  try {
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid contract address: ${address}`);
    }
    
    return new ethers.Contract(address, abi, signerOrProvider) as T;
  } catch (error) {
    logger.error('Failed to create contract instance:', error);
    throw error;
  }
}

/**
 * Check if address is contract
 */
export async function isContract(
  provider: ethers.Provider,
  address: string
): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch {
    return false;
  }
}

/**
 * Get contract creation block
 */
export async function getContractCreationBlock(
  provider: ethers.Provider,
  address: string
): Promise<number | null> {
  try {
    const currentBlock = await provider.getBlockNumber();
    let low = 0;
    let high = currentBlock;
    
    // Binary search for contract creation
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const code = await provider.getCode(address, mid);
      
      if (code === '0x') {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    
    return low <= currentBlock ? low : null;
  } catch (error) {
    logger.error('Failed to get contract creation block:', error);
    return null;
  }
}
