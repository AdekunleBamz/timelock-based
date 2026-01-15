import './RewardsPanel.css';
import { formatCurrency, formatPercentage } from '../utils/format';
import { Card } from './Card';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';

interface RewardsPanelProps {
  totalEarned: string;
  pendingRewards: string;
  apy: number;
  nextDistribution: number;
  onClaim: () => void;
  isClaimable: boolean;
  isLoading?: boolean;
}

export function RewardsPanel({
  totalEarned,
  pendingRewards,
  apy,
  nextDistribution,
  onClaim,
  isClaimable,
  isLoading = false,
}: RewardsPanelProps) {
  const timeUntilNext = nextDistribution - Date.now() / 1000;
  const hoursRemaining = Math.max(0, Math.floor(timeUntilNext / 3600));
  const progress = Math.max(0, 100 - (timeUntilNext / 86400) * 100);

  return (
    <Card className="rewards-panel">
      <div className="rewards-panel-header">
        <h3>Your Rewards</h3>
        <div className="rewards-apy">{formatPercentage(apy)} APY</div>
      </div>

      <div className="rewards-stats">
        <div className="rewards-stat">
          <span className="rewards-stat-label">Total Earned</span>
          <span className="rewards-stat-value">{formatCurrency(totalEarned)} USDC</span>
        </div>
        <div className="rewards-stat">
          <span className="rewards-stat-label">Pending Rewards</span>
          <span className="rewards-stat-value pending">{formatCurrency(pendingRewards)} USDC</span>
        </div>
      </div>

      <div className="rewards-distribution">
        <div className="rewards-distribution-header">
          <span>Next Distribution</span>
          <span>{hoursRemaining}h remaining</span>
        </div>
        <ProgressBar startTime={new Date(Date.now() - progress * 1000)} unlockTime={new Date()} isUnlocked={progress >= 100} />
      </div>

      <Button
        onClick={onClaim}
        disabled={!isClaimable || isLoading}
        isLoading={isLoading}
        fullWidth
      >
        {isClaimable ? 'Claim Rewards' : 'No Rewards Available'}
      </Button>
    </Card>
  );
}
