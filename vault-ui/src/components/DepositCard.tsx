import type { Deposit } from '../types';
import { Card } from './Card';
import { Badge, StatusBadge } from './Badge';
import { AmountDisplay } from './AmountDisplay';
import { TimeDisplay, UnlockCountdown } from './TimeDisplay';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import './DepositCard.css';

interface DepositCardProps {
  deposit: Deposit;
  onWithdraw: (depositId: number) => void;
  onEmergencyWithdraw: (depositId: number) => void;
  isPending: boolean;
}

function getDepositStatus(deposit: Deposit): 'active' | 'unlocked' | 'withdrawn' {
  if (deposit.withdrawn) return 'withdrawn';
  if (deposit.isUnlocked) return 'unlocked';
  return 'active';
}

function calculateProgress(deposit: Deposit): number {
  const now = Date.now();
  const start = deposit.startTime.getTime();
  const end = deposit.unlockTime.getTime();
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export function DepositCard({
  deposit,
  onWithdraw,
  onEmergencyWithdraw,
  isPending,
}: DepositCardProps) {
  const status = getDepositStatus(deposit);
  const progress = calculateProgress(deposit);
  const canWithdraw = deposit.isUnlocked && !deposit.withdrawn;
  const canEmergencyWithdraw = !deposit.withdrawn && !deposit.isUnlocked;

  return (
    <Card className="deposit-card" variant="default" padding="medium">
      <div className="deposit-card-header">
        <div className="deposit-card-info">
          <span className="deposit-id">#{deposit.id}</span>
          <StatusBadge status={status} />
        </div>
        <AmountDisplay amount={deposit.principalFormatted} size="large" />
      </div>

      {status === 'active' && (
        <div className="deposit-card-progress">
          <ProgressBar value={progress} />
          <div className="deposit-card-times">
            <TimeDisplay date={deposit.startTime} format="relative" />
            <UnlockCountdown unlockDate={deposit.unlockTime} />
          </div>
        </div>
      )}

      {!deposit.withdrawn && (
        <div className="deposit-card-actions">
          {canWithdraw && (
            <Button
              variant="primary"
              size="small"
              onClick={() => onWithdraw(deposit.id)}
              disabled={isPending}
              isLoading={isPending}
            >
              Withdraw
            </Button>
          )}
          {canEmergencyWithdraw && (
            <Button
              variant="danger"
              size="small"
              onClick={() => onEmergencyWithdraw(deposit.id)}
              disabled={isPending}
            >
              Emergency (-10%)
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
