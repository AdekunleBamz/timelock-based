import type { Transaction } from '../types';
import { Badge } from './Badge';
import { AmountDisplay } from './AmountDisplay';
import { TimeDisplay } from './TimeDisplay';
import { ExternalLink } from './ExternalLink';
import './TransactionItem.css';

interface TransactionItemProps {
  transaction: Transaction;
}

const TX_TYPE_CONFIG = {
  deposit: { icon: '📥', label: 'Deposit', variant: 'success' as const },
  withdraw: { icon: '📤', label: 'Withdraw', variant: 'info' as const },
  emergency_withdraw: { icon: '⚠️', label: 'Emergency', variant: 'warning' as const },
  approve: { icon: '✅', label: 'Approve', variant: 'default' as const },
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'warning' as const },
  success: { label: 'Success', variant: 'success' as const },
  error: { label: 'Failed', variant: 'error' as const },
  cancelled: { label: 'Cancelled', variant: 'default' as const },
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const typeConfig = TX_TYPE_CONFIG[transaction.type];
  const statusConfig = STATUS_CONFIG[transaction.status];

  return (
    <div className="transaction-item">
      <div className="transaction-icon">{typeConfig.icon}</div>
      
      <div className="transaction-details">
        <div className="transaction-header">
          <span className="transaction-type">{typeConfig.label}</span>
          <Badge variant={statusConfig.variant} size="small">
            {statusConfig.label}
          </Badge>
        </div>
        
        {transaction.amount && (
          <AmountDisplay amount={transaction.amount} size="small" />
        )}
        
        <div className="transaction-meta">
          <TimeDisplay date={transaction.timestamp} format="relative" />
          <ExternalLink 
            href={`https://basescan.org/tx/${transaction.hash}`}
            showIcon={true}
          >
            View
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
