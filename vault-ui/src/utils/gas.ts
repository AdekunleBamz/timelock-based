/**
 * Gas estimation utilities
 */

import { JsonRpcSigner, Contract } from 'ethers';
import { formatEther, parseUnits } from 'ethers';

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  estimatedCost: string;
  estimatedCostUSD: string;
}

/**
 * Estimate gas for a transaction
 */
export async function estimateTransactionGas(
  contract: Contract,
  method: string,
  args: unknown[],
  ethPriceUSD: number = 3000
): Promise<GasEstimate | null> {
  try {
    // Estimate gas limit
    const gasLimit = await contract[method].estimateGas(...args);

    // Get current gas prices
    const provider = contract.runner?.provider;
    if (!provider) {
      throw new Error('No provider available');
    }

    const feeData = await provider.getFeeData();

    if (!feeData.gasPrice || !feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
      throw new Error('Unable to fetch gas prices');
    }

    // Calculate estimated cost
    const estimatedCostWei = gasLimit * feeData.maxFeePerGas;
    const estimatedCost = formatEther(estimatedCostWei);
    const estimatedCostUSD = (parseFloat(estimatedCost) * ethPriceUSD).toFixed(2);

    return {
      gasLimit,
      gasPrice: feeData.gasPrice,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      estimatedCost,
      estimatedCostUSD,
    };
  } catch (error) {
    console.error('Gas estimation failed:', error);
    return null;
  }
}

/**
 * Format gas estimate for display
 */
export function formatGasEstimate(estimate: GasEstimate): string {
  return `~${parseFloat(estimate.estimatedCost).toFixed(6)} ETH ($${estimate.estimatedCostUSD})`;
}

/**
 * Get current base fee from provider
 */
export async function getCurrentBaseFee(signer: JsonRpcSigner): Promise<bigint | null> {
  try {
    const provider = signer.provider;
    const block = await provider.getBlock('latest');
    return block?.baseFeePerGas ?? null;
  } catch (error) {
    console.error('Failed to get base fee:', error);
    return null;
  }
}

/**
 * Calculate gas savings percentage
 */
export function calculateGasSavings(
  previousGasPrice: bigint,
  currentGasPrice: bigint
): number {
  const previous = Number(previousGasPrice);
  const current = Number(currentGasPrice);
  
  if (previous === 0) return 0;
  
  return ((previous - current) / previous) * 100;
}
