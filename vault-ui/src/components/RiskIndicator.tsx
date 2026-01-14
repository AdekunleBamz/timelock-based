import './RiskIndicator.css';

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high';
  score?: number;
  showLabel?: boolean;
}

export function RiskIndicator({ level, score, showLabel = true }: RiskIndicatorProps) {
  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  };

  const colors = {
    low: 'var(--color-success)',
    medium: 'var(--color-warning)',
    high: 'var(--color-error)',
  };

  return (
    <div className="risk-indicator">
      <div className="risk-indicator-bars">
        <div className={`risk-bar ${level === 'low' || level === 'medium' || level === 'high' ? 'active' : ''}`} />
        <div className={`risk-bar ${level === 'medium' || level === 'high' ? 'active' : ''}`} />
        <div className={`risk-bar ${level === 'high' ? 'active' : ''}`} />
      </div>
      {showLabel && (
        <div className="risk-indicator-label" style={{ color: colors[level] }}>
          {labels[level]}
          {score !== undefined && <span className="risk-score"> ({score}/100)</span>}
        </div>
      )}
    </div>
  );
}
