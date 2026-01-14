import { useState, useEffect } from "react";
import { Contract, JsonRpcProvider, formatUnits } from "ethers";
import { CONTRACTS, USDC_DECIMALS, BASE_MAINNET } from "../config/contracts";
import { TIMELOCK_VAULT_ABI } from "../abi";
import "./TransactionHistory.css";

interface Transaction {
  id: number;
  type: "deposit" | "withdraw" | "emergency";
  amount: string;
  timestamp: Date;
  txHash?: string;
}

interface TransactionHistoryProps {
  address: string | null;
  refreshTrigger?: number;
}

export function TransactionHistory({ address, refreshTrigger }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const provider = new JsonRpcProvider(BASE_MAINNET.rpcUrl);
        const vault = new Contract(CONTRACTS.TIMELOCK_VAULT, TIMELOCK_VAULT_ABI, provider);

        const nextId = await vault['nextDepositId']();
        const txList: Transaction[] = [];

        // Scan for user's deposits
        for (let i = 1; i < Number(nextId); i++) {
          try {
            const deposit = await vault['deposits'](i);
            if (deposit.owner.toLowerCase() === address.toLowerCase()) {
              txList.push({
                id: i,
                type: deposit.withdrawn ? "withdraw" : "deposit",
                amount: formatUnits(deposit.principal, USDC_DECIMALS),
                timestamp: new Date(Number(deposit.startTime) * 1000),
              });
            }
          } catch {
            // Skip errors
          }
        }

        // Sort by most recent first
        txList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setTransactions(txList.slice(0, 10)); // Last 10 transactions
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [address, refreshTrigger]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!address) return null;

  return (
    <div className="transaction-history">
      <h3>📜 Recent Activity</h3>
      
      {isLoading ? (
        <div className="tx-loading">Loading history...</div>
      ) : transactions.length === 0 ? (
        <div className="tx-empty">No transactions yet</div>
      ) : (
        <div className="tx-list">
          {transactions.map((tx) => (
            <div key={tx.id} className={`tx-item ${tx.type}`}>
              <div className="tx-icon">
                {tx.type === "deposit" ? "📥" : tx.type === "withdraw" ? "📤" : "⚡"}
              </div>
              <div className="tx-details">
                <span className="tx-type">
                  {tx.type === "deposit" ? "Deposited" : tx.type === "withdraw" ? "Withdrawn" : "Emergency"}
                </span>
                <span className="tx-date">{formatDate(tx.timestamp)}</span>
              </div>
              <div className="tx-amount">
                <span className={tx.type === "deposit" ? "positive" : "neutral"}>
                  {tx.type === "deposit" ? "+" : "-"}{parseFloat(tx.amount).toFixed(2)} USDC
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
