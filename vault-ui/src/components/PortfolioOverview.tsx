import './PortfolioOverview.css';
import { Card } from './Card';
import { formatCurrency } from '../utils/format';
import { Badge } from './Badge';

interface PortfolioOverviewProps {
  totalValue: string;
  activeDeposits: number;
  lockedValue: string;
  availableValue: string;
  totalGain: string;
  gainPercentage: number;
}

export function PortfolioOverview({
  totalValue,
  activeDeposits,
  lockedValue,
  availableValue,
  totalGain,
  gainPercentage,
}: PortfolioOverviewProps) {
  const isPositive = gainPercentage >= 0;

  return (
    <Card className="portfolio-overview">
      <div className="portfolio-main">
        <div className="portfolio-main-label">Total Portfolio Value</div>
        <div className="portfolio-main-value">{formatCurrency(totalValue)} USDC</div>
        <div className={`portfolio-main-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{formatCurrency(totalGain)} ({isPositive ? '+' : ''}{gainPercentage.toFixed(2)}%)
        </div>
      </div>

      <div className="portfolio-metrics">
        <div className="portfolio-metric">
          <span className="portfolio-metric-label">Active Deposits</span>
          <span className="portfolio-metric-value">
            {activeDeposits}
            <Badge variant="primary" size="small">Active</Badge>
          </span>
        </div>

        <div className="portfolio-metric">
          <span className="portfolio-metric-label">Locked Value</span>
          <span className="portfolio-metric-value">{formatCurrency(lockedValue)} USDC</span>
        </div>

        <div className="portfolio-metric">
          <span className="portfolio-metric-label">Available</span>
          <span className="portfolio-metric-value available">{formatCurrency(availableValue)} USDC</span>
        </div>
      </div>
    </Card>
  );
}
