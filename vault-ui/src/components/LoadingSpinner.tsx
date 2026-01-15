/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes
 */

import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullscreen?: boolean;
  text?: string;
}

export function LoadingSpinner({
  size = 'medium',
  color,
  fullscreen = false,
  text,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div 
        className="loading-spinner__ring"
        style={{ borderTopColor: color }}
      />
      {text && <div className="loading-spinner__text">{text}</div>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="loading-spinner__fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
}
