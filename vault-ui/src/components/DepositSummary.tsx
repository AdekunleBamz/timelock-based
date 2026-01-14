import './DepositSummary.css';

interface DepositSummaryProps {
  amount: number;
  feeRate?: number;
  duration: number;
}

export function DepositSummary({ 
  amount, 
  feeRate = 0.005,
  duration 
}: DepositSummaryProps) {
  if (amount <= 0) return null;

  const fee = amount * feeRate;
  const netAmount = amount - fee;
  const days = Math.floor(duration / 86400);
  const unlockDate = new Date(Date.now() + duration * 1000);

  return (
    <div className="deposit-summary">
      <div className="summary-row">
        <span className="summary-label">Deposit Amount</span>
        <span className="summary-value">{amount.toFixed(2)} USDC</span>
      </div>
      <div className="summary-row fee">
        <span className="summary-label">Creator Fee ({(feeRate * 100).toFixed(1)}%)</span>
        <span className="summary-value">-{fee.toFixed(4)} USDC</span>
      </div>
      <div className="summary-divider"></div>
      <div className="summary-row net">
        <span className="summary-label">You'll Lock</span>
        <span className="summary-value">{netAmount.toFixed(4)} USDC</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">Lock Period</span>
        <span className="summary-value">{days} days</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">Unlock Date</span>
        <span className="summary-value">
          {unlockDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
}
