// BaseScan API service for fetching blockchain data

import { CONTRACTS, BASE_MAINNET } from '../config/contracts';

interface BaseScanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  isError: string;
  txreceipt_status: string;
  methodId: string;
  functionName: string;
}

interface BaseScanResponse<T> {
  status: string;
  message: string;
  result: T;
}

const BASESCAN_API = 'https://api.basescan.org/api';

class BaseScanService {
  private async fetchFromBaseScan<T>(params: Record<string, string>): Promise<T> {
    const searchParams = new URLSearchParams({
      ...params,
      // Note: In production, use an API key
    });

    const response = await fetch(`${BASESCAN_API}?${searchParams}`);
    const data: BaseScanResponse<T> = await response.json();

    if (data.status !== '1' && data.message !== 'No transactions found') {
      throw new Error(data.message || 'BaseScan API error');
    }

    return data.result;
  }

  async getTransactionHistory(
    address: string,
    startBlock = 0,
    endBlock = 99999999
  ): Promise<BaseScanTransaction[]> {
    try {
      return await this.fetchFromBaseScan<BaseScanTransaction[]>({
        module: 'account',
        action: 'txlist',
        address,
        startblock: startBlock.toString(),
        endblock: endBlock.toString(),
        sort: 'desc',
      });
    } catch {
      return [];
    }
  }

  async getTokenTransfers(
    address: string,
    contractAddress: string = CONTRACTS.USDC
  ): Promise<BaseScanTransaction[]> {
    try {
      return await this.fetchFromBaseScan<BaseScanTransaction[]>({
        module: 'account',
        action: 'tokentx',
        address,
        contractaddress: contractAddress,
        sort: 'desc',
      });
    } catch {
      return [];
    }
  }

  async getInternalTransactions(address: string): Promise<BaseScanTransaction[]> {
    try {
      return await this.fetchFromBaseScan<BaseScanTransaction[]>({
        module: 'account',
        action: 'txlistinternal',
        address,
        sort: 'desc',
      });
    } catch {
      return [];
    }
  }

  getTransactionUrl(hash: string): string {
    return `${BASE_MAINNET.blockExplorer}/tx/${hash}`;
  }

  getAddressUrl(address: string): string {
    return `${BASE_MAINNET.blockExplorer}/address/${address}`;
  }
}

export const baseScanService = new BaseScanService();
export type { BaseScanTransaction };
