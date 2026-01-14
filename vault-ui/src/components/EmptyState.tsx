import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

// Pre-configured empty states
export function NoDepositsEmpty() {
  return (
    <EmptyState
      icon="📦"
      title="No Deposits Yet"
      description="Lock your USDC to start building savings discipline."
    />
  );
}

export function NoTransactionsEmpty() {
  return (
    <EmptyState
      icon="📝"
      title="No Transactions"
      description="Your transaction history will appear here."
    />
  );
}

export function WalletNotConnectedEmpty() {
  return (
    <EmptyState
      icon="🔗"
      title="Wallet Not Connected"
      description="Connect your wallet to view your deposits."
    />
  );
}
