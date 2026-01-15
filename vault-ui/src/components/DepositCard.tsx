import type { Deposit } from '../types';
import { Card } from './Card';
import { StatusBadge } from './Badge';
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

export function DepositCard({
  deposit,
  onWithdraw,
  onEmergencyWithdraw,
  isPending,
}: DepositCardProps) {
  const status = getDepositStatus(deposit);
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
          <ProgressBar startTime={new Date(deposit.startTime)} unlockTime={new Date(deposit.unlockTime)} isUnlocked={deposit.isUnlocked} />
          <div className="deposit-card-times">
            <TimeDisplay date={new Date(deposit.startTime)} format="relative" />
            <UnlockCountdown unlockDate={new Date(deposit.unlockTime)} />
          </div>
        </div>
      )}

      {!deposit.withdrawn && (
        <div className="deposit-card-actions">
          {canWithdraw && (
            <Button
              variant="primary"
              size="small"
              onClick={() => onWithdraw(Number(deposit.id))}
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
              onClick={() => onEmergencyWithdraw(Number(deposit.id))}
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
