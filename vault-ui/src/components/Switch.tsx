import './Switch.css';
import { useId } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  id: customId,
}: SwitchProps) {
  const generatedId = useId();
  const id = customId ?? generatedId;

  return (
    <div className={`switch switch--${size} ${disabled ? 'switch--disabled' : ''}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="switch-input"
        role="switch"
        aria-checked={checked}
      />
      <label htmlFor={id} className="switch-track">
        <span className="switch-thumb" />
      </label>
      {label && (
        <label htmlFor={id} className="switch-label">
          {label}
        </label>
      )}
    </div>
  );
}
