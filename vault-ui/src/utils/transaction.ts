/**
 * Web3 Transaction Helper - Retry and queue management
 */

import { JsonRpcSigner, TransactionResponse } from 'ethers';

interface Transaction {
  id: string;
  execute: () => Promise<TransactionResponse>;
  onSuccess?: (receipt: any) => void;
  onError?: (error: Error) => void;
  retries: number;
  maxRetries: number;
}

class TransactionQueue {
  private queue: Transaction[] = [];
  private isProcessing = false;
  private currentTx: Transaction | null = null;

  /**
   * Add transaction to queue
   */
  add(tx: Omit<Transaction, 'retries'>): string {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.queue.push({
      ...tx,
      id,
      retries: 0,
      maxRetries: tx.maxRetries || 3,
    });

    this.process();
    return id;
  }

  /**
   * Process transaction queue
   */
  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const tx = this.queue.shift()!;
    this.currentTx = tx;

    try {
      const response = await tx.execute();
      const receipt = await response.wait();
      
      tx.onSuccess?.(receipt);
      this.currentTx = null;
    } catch (error) {
      const err = error as Error;
      
      // Retry logic
      if (tx.retries < tx.maxRetries && !err.message.includes('user rejected')) {
        tx.retries++;
        console.log(`Retrying transaction ${tx.id} (${tx.retries}/${tx.maxRetries})`);
        this.queue.unshift(tx); // Add back to front of queue
      } else {
        tx.onError?.(err);
        this.currentTx = null;
      }
    }

    this.isProcessing = false;
    
    // Process next transaction
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), 1000); // Small delay between transactions
    }
  }

  /**
   * Cancel a pending transaction
   */
  cancel(id: string): boolean {
    const index = this.queue.findIndex(tx => tx.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get current transaction status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      currentTx: this.currentTx?.id || null,
    };
  }

  /**
   * Clear all pending transactions
   */
  clear() {
    this.queue = [];
  }
}

export const txQueue = new TransactionQueue();

/**
 * Execute transaction with automatic retry
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if user rejected
      if (lastError.message.includes('user rejected')) {
        throw lastError;
      }

      if (i < maxRetries) {
        console.log(`Attempt ${i + 1} failed, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

/**
 * Wait for transaction confirmation with timeout
 */
export async function waitForTransaction(
  tx: TransactionResponse,
  timeoutMs: number = 60000
): Promise<any> {
  return Promise.race([
    tx.wait(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Transaction timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Estimate transaction confirmation time
 */
export function estimateConfirmationTime(gasPrice: bigint): number {
  // Rough estimates based on gas price (in seconds)
  const gasPriceGwei = Number(gasPrice) / 1e9;

  if (gasPriceGwei > 100) return 15; // Fast
  if (gasPriceGwei > 50) return 30; // Normal
  if (gasPriceGwei > 20) return 60; // Slow
  return 120; // Very slow
}
