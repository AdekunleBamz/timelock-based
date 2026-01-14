import './RangeSlider.css';

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  unit?: string;
  disabled?: boolean;
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  unit = '',
  disabled = false,
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="range-slider">
      {label && (
        <div className="range-slider-header">
          <label className="range-slider-label">{label}</label>
          {showValue && (
            <span className="range-slider-value">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="range-slider-track-container">
        <input
          type="range"
          className="range-slider-input"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-bg-tertiary) ${percentage}%, var(--color-bg-tertiary) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
