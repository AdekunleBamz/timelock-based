/**
 * Custom hook for managing wallet balance
 */

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export function useBalance(
  provider: ethers.Provider | null,
  address: string | null,
  tokenAddress?: string
) {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!provider || !address) {
      setBalance('0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (tokenAddress) {
        // Fetch ERC20 token balance
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );

        const tokenBalance = await tokenContract.balanceOf(address);
        setBalance(ethers.formatUnits(tokenBalance, 6)); // USDC has 6 decimals
      } else {
        // Fetch native token (ETH) balance
        const ethBalance = await provider.getBalance(address);
        setBalance(ethers.formatEther(ethBalance));
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setError(err as Error);
      setBalance('0');
    } finally {
      setLoading(false);
    }
  }, [provider, address, tokenAddress]);

  useEffect(() => {
    fetchBalance();

    // Set up polling
    const interval = setInterval(fetchBalance, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [fetchBalance]);

  const refresh = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    refresh,
  };
}
