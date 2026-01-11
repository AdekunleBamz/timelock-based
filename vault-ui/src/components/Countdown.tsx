import { useState, useEffect } from "react";
import "./Countdown.css";

interface CountdownProps {
  unlockTime: Date;
  isUnlocked: boolean;
}

export function Countdown({ unlockTime, isUnlocked }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const target = unlockTime.getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      total: diff,
    };
  }

  useEffect(() => {
    if (isUnlocked) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockTime, isUnlocked]);

  if (isUnlocked) {
    return (
      <div className="countdown unlocked">
        <span className="countdown-icon">🔓</span>
        <span className="countdown-text">Ready to Withdraw!</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="countdown locked">
      <div className="countdown-blocks">
        {days > 0 && (
          <div className="countdown-block">
            <span className="countdown-value">{days}</span>
            <span className="countdown-label">days</span>
          </div>
        )}
        <div className="countdown-block">
          <span className="countdown-value">{hours.toString().padStart(2, "0")}</span>
          <span className="countdown-label">hrs</span>
        </div>
        <div className="countdown-block">
          <span className="countdown-value">{minutes.toString().padStart(2, "0")}</span>
          <span className="countdown-label">min</span>
        </div>
        <div className="countdown-block">
          <span className="countdown-value">{seconds.toString().padStart(2, "0")}</span>
          <span className="countdown-label">sec</span>
        </div>
      </div>
    </div>
  );
}
