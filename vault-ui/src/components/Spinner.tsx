/**
 * Loading Spinner Component
 */

import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
}

export function Spinner({ size = 'md', color = 'primary', fullScreen = false }: SpinnerProps) {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={`spinner spinner-${size} spinner-${color}`}>
          <div className="spinner-circle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner spinner-${size} spinner-${color}`}>
      <div className="spinner-circle"></div>
    </div>
  );
}

interface SpinnerOverlayProps {
  message?: string;
}

export function SpinnerOverlay({ message }: SpinnerOverlayProps) {
  return (
    <div className="spinner-overlay">
      <Spinner size="lg" color="white" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingDots({ size = 'md' }: LoadingDotsProps) {
  return (
    <div className={`loading-dots loading-dots-${size}`}>
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
}
