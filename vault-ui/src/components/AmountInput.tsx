import { forwardRef, type InputHTMLAttributes } from 'react';
import { Button } from './Button';
import './AmountInput.css';

interface AmountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  balance?: string;
  currency?: string;
  error?: string;
  onMaxClick?: () => void;
  showMax?: boolean;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ 
    label, 
    balance, 
    currency = 'USDC', 
    error, 
    onMaxClick, 
    showMax = true,
    className = '',
    ...props 
  }, ref) => {
    return (
      <div className={`amount-input-wrapper ${error ? 'has-error' : ''} ${className}`}>
        {label && <label className="amount-input-label">{label}</label>}
        
        <div className="amount-input-container">
          <input
            ref={ref}
            type="number"
            className="amount-input"
            step="0.01"
            min="0"
            {...props}
          />
          <div className="amount-input-suffix">
            <span className="amount-input-currency">{currency}</span>
            {showMax && onMaxClick && (
              <Button 
                variant="ghost" 
                size="small" 
                onClick={onMaxClick}
                type="button"
              >
                MAX
              </Button>
            )}
          </div>
        </div>
        
        <div className="amount-input-footer">
          {balance && (
            <span className="amount-input-balance">
              Balance: {parseFloat(balance).toFixed(2)} {currency}
            </span>
          )}
          {error && (
            <span className="amount-input-error" role="alert">
              {error}
            </span>
          )}
        </div>
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';
