import { formatNumber, formatUSDC } from '../utils';
import { Tooltip } from './Tooltip';
import './AmountDisplay.css';

interface AmountDisplayProps {
  amount: string | number;
  currency?: 'USDC' | 'ETH';
  showTooltip?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function AmountDisplay({
  amount,
  currency = 'USDC',
  showTooltip = true,
  size = 'medium',
  className = '',
}: AmountDisplayProps) {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format for display (truncated)
  const displayAmount = currency === 'USDC' 
    ? formatUSDC(numAmount) 
    : `${formatNumber(numAmount, 4)} ETH`;
  
  // Full precision for tooltip
  const fullAmount = currency === 'USDC'
    ? `$${numAmount.toFixed(6)} USDC`
    : `${numAmount.toFixed(18)} ETH`;

  const content = (
    <span className={`amount-display amount-${size} ${className}`}>
      <span className="amount-value">{displayAmount}</span>
      {currency === 'USDC' && <span className="amount-currency">USDC</span>}
    </span>
  );

  if (showTooltip) {
    return (
      <Tooltip content={fullAmount} position="top">
        {content}
      </Tooltip>
    );
  }

  return content;
}

// Large display for hero stats
export function AmountDisplayLarge({ amount, label }: { amount: string | number; label: string }) {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return (
    <div className="amount-display-large">
      <span className="amount-display-large-value">{formatUSDC(numAmount)}</span>
      <span className="amount-display-large-label">{label}</span>
    </div>
  );
}
