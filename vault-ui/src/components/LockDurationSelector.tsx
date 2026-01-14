import { LOCK_DURATIONS } from '../config/contracts';
import './LockDurationSelector.css';

interface LockDurationSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function LockDurationSelector({
  value,
  onChange,
  disabled = false,
}: LockDurationSelectorProps) {
  return (
    <div className="lock-duration-selector">
      <label className="lock-duration-label">Lock Duration</label>
      <div className="lock-duration-options">
        {LOCK_DURATIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`lock-duration-option ${value === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
            disabled={disabled}
          >
            <span className="option-label">{option.label}</span>
            <span className="option-days">{Math.floor(option.value / 86400)} days</span>
          </button>
        ))}
      </div>
    </div>
  );
}
