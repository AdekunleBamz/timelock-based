import { useState } from 'react';
import './DepositCalculator.css';

interface DepositCalculatorProps {
  className?: string;
}

interface CalculationResult {
  totalDeposit: number;
  lockPeriodDays: number;
  maturityDate: Date;
  estimatedReturns: number;
  penaltyAmount: number;
  netAfterPenalty: number;
}

export function DepositCalculator({ className = '' }: DepositCalculatorProps) {
  const [amount, setAmount] = useState<string>('');
  const [lockDays, setLockDays] = useState<string>('30');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const depositAmount = parseFloat(amount);
    const days = parseInt(lockDays);

    if (isNaN(depositAmount) || depositAmount <= 0 || isNaN(days) || days < 0) {
      return;
    }

    const maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + days);

    // Example calculations (adjust based on actual vault logic)
    const estimatedAPY = 0.05; // 5% APY
    const estimatedReturns = (depositAmount * estimatedAPY * days) / 365;
    
    // Emergency withdrawal penalty (10%)
    const penaltyRate = 0.10;
    const penaltyAmount = depositAmount * penaltyRate;
    const netAfterPenalty = depositAmount - penaltyAmount + estimatedReturns;

    setResult({
      totalDeposit: depositAmount,
      lockPeriodDays: days,
      maturityDate,
      estimatedReturns,
      penaltyAmount,
      netAfterPenalty,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={`deposit-calculator ${className}`}>
      <h3>Deposit Calculator</h3>
      <p className="calculator-description">
        Calculate your potential returns and see what happens if you need an emergency withdrawal
      </p>

      <div className="calculator-inputs">
        <div className="input-group">
          <label htmlFor="calc-amount">
            Deposit Amount (USDC)
          </label>
          <input
            id="calc-amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="100.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label htmlFor="calc-days">
            Lock Period (Days)
          </label>
          <input
            id="calc-days"
            type="number"
            value={lockDays}
            onChange={e => setLockDays(e.target.value)}
            placeholder="30"
            min="0"
            step="1"
          />
          <div className="quick-select">
            {[7, 30, 90, 180, 365].map(days => (
              <button
                key={days}
                type="button"
                onClick={() => setLockDays(days.toString())}
                className={lockDays === days.toString() ? 'active' : ''}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="calculate-btn"
          disabled={!amount || !lockDays}
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="calculator-results">
          <h4>Calculation Results</h4>

          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Total Deposit:</span>
              <span className="result-value">{formatCurrency(result.totalDeposit)}</span>
            </div>

            <div className="result-item">
              <span className="result-label">Lock Period:</span>
              <span className="result-value">{result.lockPeriodDays} days</span>
            </div>

            <div className="result-item">
              <span className="result-label">Maturity Date:</span>
              <span className="result-value">{formatDate(result.maturityDate)}</span>
            </div>

            <div className="result-item highlight">
              <span className="result-label">Est. Returns:</span>
              <span className="result-value positive">
                +{formatCurrency(result.estimatedReturns)}
              </span>
            </div>
          </div>

          <div className="emergency-scenario">
            <h5>Emergency Withdrawal Scenario</h5>
            <p className="scenario-warning">
              If you need to withdraw early, a 10% penalty will be applied
            </p>
            
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Penalty Amount:</span>
                <span className="result-value negative">
                  -{formatCurrency(result.penaltyAmount)}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Net After Penalty:</span>
                <span className="result-value">
                  {formatCurrency(result.netAfterPenalty)}
                </span>
              </div>
            </div>
          </div>

          <div className="calculator-disclaimer">
            <small>
              * Estimated returns are for illustration purposes only and do not represent guaranteed returns.
              Actual returns may vary based on vault performance and market conditions.
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
