/**
 * Advanced filtering and sorting for deposits
 */

import { DepositInfo } from '../hooks/useVault';

export type FilterStatus = 'all' | 'active' | 'unlocked' | 'withdrawn';
export type SortField = 'amount' | 'date' | 'unlock' | 'duration';
export type SortDirection = 'asc' | 'desc';

export interface DepositFilters {
  status: FilterStatus;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface DepositSort {
  field: SortField;
  direction: SortDirection;
}

/**
 * Filter deposits based on criteria
 */
export function filterDeposits(
  deposits: DepositInfo[],
  filters: DepositFilters
): DepositInfo[] {
  return deposits.filter(deposit => {
    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'withdrawn' && !deposit.withdrawn) return false;
      if (filters.status === 'active' && deposit.withdrawn) return false;
      if (filters.status === 'unlocked' && (!deposit.isUnlocked || deposit.withdrawn)) return false;
    }

    // Amount filter
    const amount = parseFloat(deposit.principalFormatted);
    if (filters.minAmount !== undefined && amount < filters.minAmount) return false;
    if (filters.maxAmount !== undefined && amount > filters.maxAmount) return false;

    // Date range filter
    if (filters.dateFrom && deposit.startTime < filters.dateFrom) return false;
    if (filters.dateTo && deposit.startTime > filters.dateTo) return false;

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        deposit.id.toString(),
        deposit.principalFormatted,
        deposit.owner,
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) return false;
    }

    return true;
  });
}

/**
 * Sort deposits
 */
export function sortDeposits(
  deposits: DepositInfo[],
  sort: DepositSort
): DepositInfo[] {
  const sorted = [...deposits];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'amount':
        comparison = parseFloat(a.principalFormatted) - parseFloat(b.principalFormatted);
        break;
      case 'date':
        comparison = a.startTime.getTime() - b.startTime.getTime();
        break;
      case 'unlock':
        comparison = a.unlockTime.getTime() - b.unlockTime.getTime();
        break;
      case 'duration':
        const aDuration = a.unlockTime.getTime() - a.startTime.getTime();
        const bDuration = b.unlockTime.getTime() - b.startTime.getTime();
        comparison = aDuration - bDuration;
        break;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Group deposits by criteria
 */
export type GroupBy = 'status' | 'amount' | 'date' | 'duration';

export function groupDeposits(
  deposits: DepositInfo[],
  groupBy: GroupBy
): Record<string, DepositInfo[]> {
  const groups: Record<string, DepositInfo[]> = {};

  deposits.forEach(deposit => {
    let key: string;

    switch (groupBy) {
      case 'status':
        if (deposit.withdrawn) {
          key = 'Withdrawn';
        } else if (deposit.isUnlocked) {
          key = 'Unlocked';
        } else {
          key = 'Locked';
        }
        break;

      case 'amount':
        const amount = parseFloat(deposit.principalFormatted);
        if (amount < 10) key = '< $10';
        else if (amount < 100) key = '$10 - $100';
        else if (amount < 1000) key = '$100 - $1,000';
        else key = '> $1,000';
        break;

      case 'date':
        const month = deposit.startTime.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
        key = month;
        break;

      case 'duration':
        const duration = deposit.unlockTime.getTime() - deposit.startTime.getTime();
        const days = Math.floor(duration / (24 * 60 * 60 * 1000));
        if (days <= 7) key = '1 Week';
        else if (days <= 14) key = '2 Weeks';
        else if (days <= 30) key = '1 Month';
        else key = '> 1 Month';
        break;
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(deposit);
  });

  return groups;
}

/**
 * Calculate deposit statistics
 */
export interface DepositStats {
  total: number;
  totalLocked: number;
  totalWithdrawn: number;
  averageAmount: number;
  largestDeposit: number;
  smallestDeposit: number;
  activeCount: number;
  withdrawnCount: number;
  unlockedCount: number;
}

export function calculateDepositStats(deposits: DepositInfo[]): DepositStats {
  if (deposits.length === 0) {
    return {
      total: 0,
      totalLocked: 0,
      totalWithdrawn: 0,
      averageAmount: 0,
      largestDeposit: 0,
      smallestDeposit: 0,
      activeCount: 0,
      withdrawnCount: 0,
      unlockedCount: 0,
    };
  }

  const amounts = deposits.map(d => parseFloat(d.principalFormatted));
  const activeDeposits = deposits.filter(d => !d.withdrawn);
  const withdrawnDeposits = deposits.filter(d => d.withdrawn);
  const unlockedDeposits = deposits.filter(d => !d.withdrawn && d.isUnlocked);

  return {
    total: deposits.length,
    totalLocked: activeDeposits.reduce((sum, d) => sum + parseFloat(d.principalFormatted), 0),
    totalWithdrawn: withdrawnDeposits.reduce((sum, d) => sum + parseFloat(d.principalFormatted), 0),
    averageAmount: amounts.reduce((sum, a) => sum + a, 0) / amounts.length,
    largestDeposit: Math.max(...amounts),
    smallestDeposit: Math.min(...amounts),
    activeCount: activeDeposits.length,
    withdrawnCount: withdrawnDeposits.length,
    unlockedCount: unlockedDeposits.length,
  };
}
