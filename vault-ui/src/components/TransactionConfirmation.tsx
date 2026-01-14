import './TransactionConfirmation.css';
import { Modal } from './Modal';
import { Button } from './Button';
import { formatCurrency } from '../utils/format';
import { GasEstimator } from './GasEstimator';

interface TransactionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'deposit' | 'withdraw' | 'claim';
  amount?: string;
  details: Array<{ label: string; value: string }>;
  isProcessing?: boolean;
}

export function TransactionConfirmation({
  isOpen,
  onClose,
  onConfirm,
  type,
  amount,
  details,
  isProcessing = false,
}: TransactionConfirmationProps) {
  const titles = {
    deposit: 'Confirm Deposit',
    withdraw: 'Confirm Withdrawal',
    claim: 'Confirm Claim',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titles[type]}>
      <div className="transaction-confirmation">
        {amount && (
          <div className="transaction-amount">
            <div className="transaction-amount-label">Amount</div>
            <div className="transaction-amount-value">{formatCurrency(amount)} USDC</div>
          </div>
        )}

        <div className="transaction-details">
          {details.map((detail, index) => (
            <div key={index} className="transaction-detail">
              <span className="transaction-detail-label">{detail.label}</span>
              <span className="transaction-detail-value">{detail.value}</span>
            </div>
          ))}
        </div>

        <GasEstimator operation={type} />

        <div className="transaction-warning">
          <div className="transaction-warning-icon">⚠️</div>
          <div className="transaction-warning-text">
            Please review the transaction details carefully before confirming.
            This action cannot be undone.
          </div>
        </div>

        <div className="transaction-actions">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={onConfirm} isLoading={isProcessing}>
            Confirm Transaction
          </Button>
        </div>
      </div>
    </Modal>
  );
}
