/**
 * Data export utilities - Export deposits and transactions to CSV/JSON
 */

import { formatDate, formatCurrency } from './format';

export interface ExportDeposit {
  id: number;
  amount: string;
  lockDuration: string;
  startDate: string;
  unlockDate: string;
  status: string;
  withdrawn: boolean;
}

export interface ExportTransaction {
  hash: string;
  type: string;
  amount: string;
  date: string;
  status: string;
}

/**
 * Convert data to CSV format
 */
function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape values that contain commas or quotes
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Download file to user's computer
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export deposits to CSV
 */
export function exportDepositsToCSV(deposits: ExportDeposit[]): void {
  const csv = convertToCSV(deposits);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `timelock-deposits-${timestamp}.csv`, 'text/csv');
}

/**
 * Export deposits to JSON
 */
export function exportDepositsToJSON(deposits: ExportDeposit[]): void {
  const json = JSON.stringify(deposits, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `timelock-deposits-${timestamp}.json`, 'application/json');
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(transactions: ExportTransaction[]): void {
  const csv = convertToCSV(transactions);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `timelock-transactions-${timestamp}.csv`, 'text/csv');
}

/**
 * Export transactions to JSON
 */
export function exportTransactionsToJSON(transactions: ExportTransaction[]): void {
  const json = JSON.stringify(transactions, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `timelock-transactions-${timestamp}.json`, 'application/json');
}

/**
 * Export statistics summary
 */
export interface StatsExport {
  generatedAt: string;
  totalDeposits: number;
  totalLocked: string;
  totalWithdrawn: string;
  activeDeposits: number;
  completedDeposits: number;
}

export function exportStatsToJSON(stats: StatsExport): void {
  const json = JSON.stringify(stats, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `timelock-stats-${timestamp}.json`, 'application/json');
}

/**
 * Generate and export comprehensive report
 */
export function exportComprehensiveReport(
  deposits: ExportDeposit[],
  transactions: ExportTransaction[],
  stats: StatsExport
): void {
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    statistics: stats,
    deposits,
    transactions,
  };

  const json = JSON.stringify(report, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `timelock-report-${timestamp}.json`, 'application/json');
}
