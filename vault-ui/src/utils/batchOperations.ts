/**
 * Batch operations utilities for multiple deposits
 */

import { Contract } from 'ethers';

export interface BatchOperation {
  id: string;
  depositId: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
  txHash?: string;
}

export interface BatchResult {
  successful: number;
  failed: number;
  operations: BatchOperation[];
}

/**
 * Execute batch withdrawals
 */
export async function batchWithdraw(
  contract: Contract,
  depositIds: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchResult> {
  const operations: BatchOperation[] = depositIds.map(id => ({
    id: `withdraw-${id}`,
    depositId: id,
    status: 'pending' as const,
  }));

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < depositIds.length; i++) {
    const depositId = depositIds[i];
    const operation = operations[i];

    try {
      const tx = await contract.withdraw(depositId);
      const receipt = await tx.wait();
      
      operation.status = 'success';
      operation.txHash = receipt.hash;
      successful++;
    } catch (error: any) {
      operation.status = 'failed';
      operation.error = error.message || 'Transaction failed';
      failed++;
    }

    if (onProgress) {
      onProgress(i + 1, depositIds.length);
    }
  }

  return {
    successful,
    failed,
    operations,
  };
}

/**
 * Execute batch emergency withdrawals
 */
export async function batchEmergencyWithdraw(
  contract: Contract,
  depositIds: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchResult> {
  const operations: BatchOperation[] = depositIds.map(id => ({
    id: `emergency-${id}`,
    depositId: id,
    status: 'pending' as const,
  }));

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < depositIds.length; i++) {
    const depositId = depositIds[i];
    const operation = operations[i];

    try {
      const tx = await contract.emergencyWithdraw(depositId);
      const receipt = await tx.wait();
      
      operation.status = 'success';
      operation.txHash = receipt.hash;
      successful++;
    } catch (error: any) {
      operation.status = 'failed';
      operation.error = error.message || 'Transaction failed';
      failed++;
    }

    if (onProgress) {
      onProgress(i + 1, depositIds.length);
    }
  }

  return {
    successful,
    failed,
    operations,
  };
}

/**
 * Estimate gas for batch operations
 */
export async function estimateBatchGas(
  contract: Contract,
  method: 'withdraw' | 'emergencyWithdraw',
  depositIds: string[]
): Promise<{
  totalGas: bigint;
  averageGas: bigint;
  estimatedCost: bigint;
}> {
  let totalGas = 0n;

  // Estimate gas for each operation
  for (const depositId of depositIds) {
    try {
      const gas = await contract[method].estimateGas(depositId);
      totalGas += gas;
    } catch (error) {
      console.warn(`Failed to estimate gas for ${depositId}:`, error);
      // Use a default estimate if one fails
      totalGas += 100000n;
    }
  }

  const averageGas = totalGas / BigInt(depositIds.length);
  
  // Get current gas price
  const gasPrice = await contract.runner?.provider?.getFeeData();
  const estimatedCost = totalGas * (gasPrice?.gasPrice || 0n);

  return {
    totalGas,
    averageGas,
    estimatedCost,
  };
}

/**
 * Check if deposits are eligible for batch operation
 */
export function filterEligibleDeposits(
  deposits: Array<{
    depositId: string;
    depositTime: number;
    lockDuration: number;
    isEmergency: boolean;
  }>,
  operation: 'withdraw' | 'emergencyWithdraw'
): string[] {
  const now = Date.now() / 1000;

  if (operation === 'withdraw') {
    // Only matured deposits
    return deposits
      .filter(d => {
        const maturityTime = d.depositTime + d.lockDuration;
        return maturityTime <= now && !d.isEmergency;
      })
      .map(d => d.depositId);
  } else {
    // Only active deposits (not already emergency withdrawn)
    return deposits
      .filter(d => !d.isEmergency)
      .map(d => d.depositId);
  }
}

/**
 * Batch operation with retry logic
 */
export async function batchWithRetry(
  operation: (depositId: string) => Promise<void>,
  depositIds: string[],
  maxRetries: number = 2,
  onProgress?: (completed: number, total: number) => void
): Promise<BatchResult> {
  const operations: BatchOperation[] = depositIds.map(id => ({
    id: `op-${id}`,
    depositId: id,
    status: 'pending' as const,
  }));

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < depositIds.length; i++) {
    const depositId = depositIds[i];
    const op = operations[i];
    let retries = 0;

    while (retries <= maxRetries) {
      try {
        await operation(depositId);
        op.status = 'success';
        successful++;
        break;
      } catch (error: any) {
        retries++;
        if (retries > maxRetries) {
          op.status = 'failed';
          op.error = error.message || 'Max retries exceeded';
          failed++;
        } else {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }

    if (onProgress) {
      onProgress(i + 1, depositIds.length);
    }
  }

  return {
    successful,
    failed,
    operations,
  };
}
