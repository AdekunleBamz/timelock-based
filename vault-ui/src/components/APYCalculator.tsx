import './APYCalculator.css';
import { useState } from 'react';
import { Card } from './Card';
import { AmountInput } from './AmountInput';
import { Button } from './Button';
import { formatCurrency } from '../utils/format';

export function APYCalculator() {
  const [amount, setAmount] = useState('1000');
  const [duration, setDuration] = useState('365');
  const [apy, setApy] = useState('12');
  const [result, setResult] = useState<{
    total: number;
    interest: number;
  } | null>(null);

  const calculate = () => {
    const principal = parseFloat(amount) || 0;
    const days = parseFloat(duration) || 0;
    const rate = parseFloat(apy) / 100 || 0;

    const interest = (principal * rate * days) / 365;
    const total = principal + interest;

    setResult({ total, interest });
  };

  return (
    <Card className="apy-calculator">
      <h3 className="calculator-title">APY Calculator</h3>
      <p className="calculator-description">
        Calculate your potential earnings based on deposit amount and lock duration.
      </p>

      <div className="calculator-inputs">
        <AmountInput
          value={amount}
          onChange={setAmount}
          label="Deposit Amount (USDC)"
          placeholder="1000"
        />

        <div className="calculator-input-group">
          <label>Lock Duration (days)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="calculator-input"
            min="1"
          />
        </div>

        <div className="calculator-input-group">
          <label>APY (%)</label>
          <input
            type="number"
            value={apy}
            onChange={(e) => setApy(e.target.value)}
            className="calculator-input"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <Button onClick={calculate} fullWidth>
        Calculate Earnings
      </Button>

      {result && (
        <div className="calculator-results">
          <div className="calculator-result-item">
            <span className="result-label">Interest Earned</span>
            <span className="result-value interest">+{formatCurrency(result.interest.toString())} USDC</span>
          </div>
          <div className="calculator-result-item">
            <span className="result-label">Total Value</span>
            <span className="result-value total">{formatCurrency(result.total.toString())} USDC</span>
          </div>
        </div>
      )}
    </Card>
  );
}
