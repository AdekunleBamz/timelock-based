import './StatItem.css';

interface StatItemProps {
  label: string;
  value: string;
  icon?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  size?: 'small' | 'medium' | 'large';
}

export function StatItem({ 
  label, 
  value, 
  icon, 
  trend, 
  size = 'medium' 
}: StatItemProps) {
  return (
    <div className={`stat-item stat-item-${size}`}>
      {icon && <span className="stat-icon">{icon}</span>}
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend stat-trend-${trend.direction}`}>
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// Stats row component
interface StatsRowProps {
  stats: StatItemProps[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="stats-row">
      {stats.map((stat, index) => (
        <StatItem key={`${stat.label}-${index}`} {...stat} />
      ))}
    </div>
  );
}
