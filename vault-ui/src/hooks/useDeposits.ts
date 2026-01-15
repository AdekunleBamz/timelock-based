/**
 * Custom hook for managing deposits
 */

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export interface Deposit {
  depositId: string;
  amount: bigint;
  depositTime: number;
  lockDuration: number;
  isEmergency: boolean;
}

export function useDeposits(
  vaultContract: ethers.Contract | null,
  userAddress: string | null
) {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeposits = useCallback(async () => {
    if (!vaultContract || !userAddress) {
      setDeposits([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get deposit count
      const count = await vaultContract.getUserDepositCount(userAddress);
      const depositCount = Number(count);

      // Fetch all deposits
      const depositPromises = Array.from({ length: depositCount }, (_, i) =>
        vaultContract.getUserDeposit(userAddress, i)
      );

      const depositsData = await Promise.all(depositPromises);

      const formattedDeposits: Deposit[] = depositsData.map((d, index) => ({
        depositId: `${userAddress}-${index}`,
        amount: d.amount,
        depositTime: Number(d.depositTime),
        lockDuration: Number(d.lockDuration),
        isEmergency: d.isEmergency || false,
      }));

      setDeposits(formattedDeposits);
    } catch (err) {
      console.error('Failed to fetch deposits:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [vaultContract, userAddress]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const refresh = useCallback(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  return {
    deposits,
    loading,
    error,
    refresh,
  };
}
