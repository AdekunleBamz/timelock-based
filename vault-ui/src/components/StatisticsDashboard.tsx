import { useMemo } from 'react';
import './StatisticsDashboard.css';

interface DepositInfo {
  depositId: string;
  amount: string;
  depositTime: number;
  lockDuration: number;
  isEmergency: boolean;
}

interface StatisticsDashboardProps {
  deposits: DepositInfo[];
  totalBalance?: string;
  className?: string;
}

export function StatisticsDashboard({
  deposits,
  totalBalance = '0',
  className = '',
}: StatisticsDashboardProps) {
  const stats = useMemo(() => {
    const now = Date.now() / 1000;
    
    const totalDeposited = deposits.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0);
    const activeDeposits = deposits.filter(d => !d.isEmergency).length;
    const maturedDeposits = deposits.filter(d => {
      const maturityTime = d.depositTime + d.lockDuration;
      return maturityTime <= now && !d.isEmergency;
    }).length;
    
    const emergencyWithdrawals = deposits.filter(d => d.isEmergency).length;
    
    const avgLockDuration = deposits.length > 0
      ? deposits.reduce((sum, d) => sum + d.lockDuration, 0) / deposits.length / 86400
      : 0;
    
    const largestDeposit = deposits.length > 0
      ? Math.max(...deposits.map(d => parseFloat(d.amount || '0')))
      : 0;
    
    const oldestDeposit = deposits.length > 0
      ? Math.min(...deposits.map(d => d.depositTime))
      : 0;

    const completionRate = deposits.length > 0
      ? ((maturedDeposits / deposits.length) * 100)
      : 0;

    return {
      totalDeposited,
      activeDeposits,
      maturedDeposits,
      emergencyWithdrawals,
      avgLockDuration,
      largestDeposit,
      oldestDeposit,
      completionRate,
    };
  }, [deposits]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(timestamp * 1000));
  };

  return (
    <div className={`statistics-dashboard ${className}`}>
      <h2>Account Statistics</h2>

      <div className="stats-grid">
        {/* Primary Stats */}
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Deposited</div>
            <div className="stat-value">{formatCurrency(stats.totalDeposited)}</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Current Balance</div>
            <div className="stat-value">{formatCurrency(parseFloat(totalBalance))}</div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <div className="stat-label">Active Deposits</div>
            <div className="stat-value">{stats.activeDeposits}</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Matured</div>
            <div className="stat-value">{stats.maturedDeposits}</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-label">Emergency Withdrawals</div>
            <div className="stat-value">{stats.emergencyWithdrawals}</div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Completion Rate</div>
            <div className="stat-value">{stats.completionRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-label">Avg Lock Duration</div>
            <div className="stat-value">{stats.avgLockDuration.toFixed(0)} days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-label">Largest Deposit</div>
            <div className="stat-value">{formatCurrency(stats.largestDeposit)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-label">First Deposit</div>
            <div className="stat-value">{formatDate(stats.oldestDeposit)}</div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="insights">
        <h3>Insights</h3>
        <ul className="insights-list">
          {stats.completionRate >= 80 && (
            <li className="insight-item positive">
              🎉 Great discipline! You've completed {stats.completionRate.toFixed(0)}% of your lock periods without emergency withdrawals.
            </li>
          )}
          {stats.emergencyWithdrawals > 0 && (
            <li className="insight-item neutral">
              💡 You've made {stats.emergencyWithdrawals} emergency withdrawal{stats.emergencyWithdrawals > 1 ? 's' : ''}. 
              Consider longer lock periods for better discipline.
            </li>
          )}
          {stats.activeDeposits === 0 && deposits.length > 0 && (
            <li className="insight-item">
              📝 All your deposits have been withdrawn. Ready to start a new savings journey?
            </li>
          )}
          {stats.avgLockDuration < 30 && deposits.length > 0 && (
            <li className="insight-item">
              ⏰ Your average lock duration is {stats.avgLockDuration.toFixed(0)} days. 
              Consider longer periods for better savings habits.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
