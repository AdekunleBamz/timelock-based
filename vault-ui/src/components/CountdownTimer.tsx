import './CountdownTimer.css';
import { useInterval } from '../hooks/useInterval';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: number; // Unix timestamp in seconds
  onComplete?: () => void;
  showSeconds?: boolean;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function calculateTimeLeft(targetTime: number): TimeLeft {
  const now = Math.floor(Date.now() / 1000);
  const diff = targetTime - now;
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }
  
  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    isComplete: false,
  };
}

export function CountdownTimer({ 
  targetTime, 
  onComplete, 
  showSeconds = true,
  compact = false 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetTime));
  
  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetTime));
  }, [targetTime]);
  
  useInterval(() => {
    const newTimeLeft = calculateTimeLeft(targetTime);
    setTimeLeft(newTimeLeft);
    
    if (newTimeLeft.isComplete && onComplete) {
      onComplete();
    }
  }, timeLeft.isComplete ? null : 1000);
  
  if (timeLeft.isComplete) {
    return (
      <span className="countdown-timer countdown-timer--complete">
        Ready to withdraw
      </span>
    );
  }
  
  if (compact) {
    return (
      <span className="countdown-timer countdown-timer--compact">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours.toString().padStart(2, '0')}:
        {timeLeft.minutes.toString().padStart(2, '0')}
        {showSeconds && `:${timeLeft.seconds.toString().padStart(2, '0')}`}
      </span>
    );
  }
  
  return (
    <div className="countdown-timer">
      {timeLeft.days > 0 && (
        <div className="countdown-timer-unit">
          <span className="countdown-timer-value">{timeLeft.days}</span>
          <span className="countdown-timer-label">days</span>
        </div>
      )}
      <div className="countdown-timer-unit">
        <span className="countdown-timer-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="countdown-timer-label">hrs</span>
      </div>
      <div className="countdown-timer-unit">
        <span className="countdown-timer-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="countdown-timer-label">min</span>
      </div>
      {showSeconds && (
        <div className="countdown-timer-unit">
          <span className="countdown-timer-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="countdown-timer-label">sec</span>
        </div>
      )}
    </div>
  );
}
