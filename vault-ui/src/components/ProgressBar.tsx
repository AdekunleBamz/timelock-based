import "./ProgressBar.css";

interface ProgressBarProps {
  startTime: Date;
  unlockTime: Date;
  isUnlocked: boolean;
}

export function ProgressBar({ startTime, unlockTime, isUnlocked }: ProgressBarProps) {
  const now = new Date().getTime();
  const start = startTime.getTime();
  const end = unlockTime.getTime();
  
  const totalDuration = end - start;
  const elapsed = now - start;
  
  const progress = isUnlocked ? 100 : Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div 
          className={`progress-fill ${isUnlocked ? "complete" : ""}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="progress-percent">{Math.floor(progress)}%</span>
    </div>
  );
}
