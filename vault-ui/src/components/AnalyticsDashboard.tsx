import { useState } from 'react';
import { Card } from './Card';
import './AnalyticsDashboard.css';

interface AnalyticsMetric {
  label: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

interface AnalyticsDashboardProps {
  totalLocked: string;
  activeDeposits: number;
  avgLockDuration: number;
  totalEarned: string;
}

export function AnalyticsDashboard({
  totalLocked,
  activeDeposits,
  avgLockDuration,
  totalEarned,
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const metrics: AnalyticsMetric[] = [
    {
      label: 'Total Value Locked',
      value: `$${totalLocked}`,
      change: 12.5,
      trend: 'up',
      icon: '🔒',
    },
    {
      label: 'Active Deposits',
      value: activeDeposits.toString(),
      change: -2.3,
      trend: 'down',
      icon: '📦',
    },
    {
      label: 'Avg Lock Duration',
      value: `${avgLockDuration} days`,
      change: 5.1,
      trend: 'up',
      icon: '⏱️',
    },
    {
      label: 'Total Earned',
      value: `$${totalEarned}`,
      change: 18.2,
      trend: 'up',
      icon: '💰',
    },
  ];

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (!trend || trend === 'neutral') return '—';
    return trend === 'up' ? '↑' : '↓';
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    if (!trend || trend === 'neutral') return 'neutral';
    return trend === 'up' ? 'positive' : 'negative';
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2 className="analytics-title">Analytics Overview</h2>
        <div className="analytics-time-range">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              className={`time-range-btn ${timeRange === range ? 'time-range-btn--active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-grid">
        {metrics.map((metric, index) => (
          <Card key={index} className="analytics-card" padding="medium">
            <div className="analytics-card-header">
              <span className="analytics-icon">{metric.icon}</span>
              <span className="analytics-label">{metric.label}</span>
            </div>
            <div className="analytics-value">{metric.value}</div>
            {metric.change !== undefined && (
              <div className={`analytics-change analytics-change--${getTrendColor(metric.trend)}`}>
                <span className="analytics-trend-icon">{getTrendIcon(metric.trend)}</span>
                <span className="analytics-change-value">{Math.abs(metric.change)}%</span>
                <span className="analytics-change-period">vs last period</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="analytics-charts">
        <Card className="analytics-chart-card" padding="large">
          <h3 className="analytics-chart-title">Deposit Activity</h3>
          <div className="analytics-chart-placeholder">
            <span className="chart-icon">📈</span>
            <p>Chart visualization coming soon</p>
          </div>
        </Card>

        <Card className="analytics-chart-card" padding="large">
          <h3 className="analytics-chart-title">Lock Duration Distribution</h3>
          <div className="analytics-chart-placeholder">
            <span className="chart-icon">📊</span>
            <p>Chart visualization coming soon</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
