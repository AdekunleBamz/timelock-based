import type { ReactNode } from 'react';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  children?: ReactNode;
}

export function ProgressIndicator({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  size = 'md',
  animate = false,
  children,
}: ProgressIndicatorProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`progress-ind-container progress-ind--${size}`}>
      {(label || showValue) && (
        <div className="progress-ind-header">
          {label && <span className="progress-ind-label">{label}</span>}
          {showValue && (
            <span className="progress-ind-value">
              {value.toFixed(value % 1 === 0 ? 0 : 2)}/{max}
            </span>
          )}
        </div>
      )}
      <div 
        className="progress-ind-track" 
        role="progressbar" 
        aria-valuenow={value} 
        aria-valuemin={0} 
        aria-valuemax={max}
      >
        <div 
          className={`progress-ind-fill progress-ind--${variant} ${animate ? 'progress-ind--animate' : ''}`}
          style={{ width: `${percentage}%` }}
        />
        {children && (
          <div className="progress-ind-content">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
