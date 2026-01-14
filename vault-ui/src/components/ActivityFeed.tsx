import { formatDate, formatRelativeTime } from '../utils/time';
import { formatAddress } from '../utils/format';
import './ActivityFeed.css';

export interface Activity {
  id: string;
  type: 'deposit' | 'withdraw' | 'emergency-withdraw' | 'approval';
  amount?: string;
  address: string;
  txHash: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function ActivityFeed({
  activities,
  maxItems = 10,
  showViewAll = false,
  onViewAll,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'deposit':
        return '💰';
      case 'withdraw':
        return '💸';
      case 'emergency-withdraw':
        return '⚠️';
      case 'approval':
        return '✓';
      default:
        return '📄';
    }
  };

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'deposit':
        return 'Deposited';
      case 'withdraw':
        return 'Withdrawn';
      case 'emergency-withdraw':
        return 'Emergency Withdrawal';
      case 'approval':
        return 'Approved';
      default:
        return 'Transaction';
    }
  };

  const getStatusBadge = (status: Activity['status']) => {
    return (
      <span className={`activity-status activity-status--${status}`}>
        {status === 'pending' && '⏳'}
        {status === 'confirmed' && '✓'}
        {status === 'failed' && '✕'}
      </span>
    );
  };

  if (activities.length === 0) {
    return (
      <div className="activity-feed-empty">
        <span className="activity-feed-empty-icon">📊</span>
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-list">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">{getActivityIcon(activity.type)}</div>
            <div className="activity-content">
              <div className="activity-header">
                <span className="activity-label">{getActivityLabel(activity.type)}</span>
                {getStatusBadge(activity.status)}
              </div>
              {activity.amount && (
                <div className="activity-amount">{activity.amount} USDC</div>
              )}
              <div className="activity-details">
                <span className="activity-time">{formatRelativeTime(activity.timestamp)}</span>
                <span className="activity-separator">•</span>
                <a
                  href={`https://basescan.org/tx/${activity.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-tx-link"
                >
                  {formatAddress(activity.txHash)}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showViewAll && activities.length > maxItems && (
        <button className="activity-view-all" onClick={onViewAll}>
          View all activity ({activities.length}) →
        </button>
      )}
    </div>
  );
}
