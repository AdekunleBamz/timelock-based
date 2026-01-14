import './WithdrawalFlow.css';
import { useState } from 'react';
import { Button } from './Button';
import { Loading } from './Loading';
import { Alert } from './Alert';

interface WithdrawalFlowProps {
  deposits: Array<{
    id: string;
    amount: string;
    unlockTime: number;
  }>;
  onWithdraw: (depositId: string) => Promise<void>;
  onCancel: () => void;
}

export function WithdrawalFlow({ deposits, onWithdraw, onCancel }: WithdrawalFlowProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>();

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(deposits.map((d) => d.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleWithdraw = async () => {
    setIsProcessing(true);
    setError(undefined);

    try {
      for (const id of selectedIds) {
        await onWithdraw(id);
      }
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="withdrawal-flow">
      <div className="withdrawal-flow-header">
        <h3>Select Deposits to Withdraw</h3>
        <div className="withdrawal-flow-bulk-actions">
          <button onClick={selectAll} className="bulk-action-button">
            Select All
          </button>
          <button onClick={deselectAll} className="bulk-action-button">
            Deselect All
          </button>
        </div>
      </div>

      {error && <Alert variant="error" message={error} />}

      <div className="withdrawal-flow-list">
        {deposits.map((deposit) => {
          const isUnlocked = Date.now() / 1000 > deposit.unlockTime;
          const isSelected = selectedIds.has(deposit.id);

          return (
            <div
              key={deposit.id}
              className={`withdrawal-item ${isSelected ? 'selected' : ''} ${
                !isUnlocked ? 'locked' : ''
              }`}
              onClick={() => isUnlocked && toggleSelect(deposit.id)}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(deposit.id)}
                disabled={!isUnlocked}
              />
              <div className="withdrawal-item-info">
                <div className="withdrawal-item-amount">{deposit.amount} USDC</div>
                <div className="withdrawal-item-status">
                  {isUnlocked ? 'Ready to withdraw' : 'Still locked'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isProcessing && <Loading message="Processing withdrawals..." />}

      <div className="withdrawal-flow-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={handleWithdraw}
          disabled={selectedIds.size === 0 || isProcessing}
        >
          Withdraw {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
        </Button>
      </div>
    </div>
  );
}
