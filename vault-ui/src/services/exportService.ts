/**
 * Data export service
 * Handles exporting data to various formats
 */

import { downloadCSV, downloadJSON } from './files';
import { formatDate } from './dates';
import { formatDepositAmount } from './vaultHelpers';

export interface ExportDeposit {
  depositId: string;
  amount: string;
  depositTime: string;
  lockDuration: string;
  maturityTime: string;
  status: string;
  isEmergency: boolean;
}

export interface ExportTransaction {
  hash: string;
  type: string;
  amount?: string;
  timestamp: string;
  status: string;
}

/**
 * Export deposits to CSV
 */
export function exportDepositsToCSV(
  deposits: Array<{
    depositId: string;
    amount: bigint;
    depositTime: number;
    lockDuration: number;
    isEmergency: boolean;
  }>,
  filename: string = `deposits_${Date.now()}.csv`
): void {
  const data: ExportDeposit[] = deposits.map(d => ({
    depositId: d.depositId,
    amount: formatDepositAmount(d.amount),
    depositTime: formatDate(d.depositTime, 'long'),
    lockDuration: `${Math.floor(d.lockDuration / 86400)} days`,
    maturityTime: formatDate(d.depositTime + d.lockDuration, 'long'),
    status: d.isEmergency ? 'Emergency' : 'Active',
    isEmergency: d.isEmergency,
  }));

  downloadCSV(data, filename);
}

/**
 * Export deposits to JSON
 */
export function exportDepositsToJSON(
  deposits: Array<{
    depositId: string;
    amount: bigint;
    depositTime: number;
    lockDuration: number;
    isEmergency: boolean;
  }>,
  filename: string = `deposits_${Date.now()}.json`
): void {
  const data = deposits.map(d => ({
    depositId: d.depositId,
    amount: d.amount.toString(),
    depositTime: d.depositTime,
    lockDuration: d.lockDuration,
    maturityTime: d.depositTime + d.lockDuration,
    isEmergency: d.isEmergency,
  }));

  downloadJSON({ deposits: data, exportedAt: Date.now() }, filename);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(
  transactions: Array<{
    hash: string;
    type: string;
    amount?: string;
    timestamp: number;
    status: string;
  }>,
  filename: string = `transactions_${Date.now()}.csv`
): void {
  const data: ExportTransaction[] = transactions.map(tx => ({
    hash: tx.hash,
    type: tx.type,
    amount: tx.amount || 'N/A',
    timestamp: formatDate(tx.timestamp, 'long'),
    status: tx.status,
  }));

  downloadCSV(data, filename);
}

/**
 * Export transactions to JSON
 */
export function exportTransactionsToJSON(
  transactions: Array<{
    hash: string;
    type: string;
    amount?: string;
    timestamp: number;
    status: string;
  }>,
  filename: string = `transactions_${Date.now()}.json`
): void {
  downloadJSON({ transactions, exportedAt: Date.now() }, filename);
}

/**
 * Export complete account data
 */
export function exportAccountData(
  data: {
    address: string;
    deposits: any[];
    transactions: any[];
    balance: string;
  },
  filename: string = `account_data_${Date.now()}.json`
): void {
  downloadJSON({
    ...data,
    exportedAt: Date.now(),
    exportedDate: new Date().toISOString(),
  }, filename);
}
