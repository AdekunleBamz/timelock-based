import './Checkbox.css';
import { useId } from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
  id?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  error,
  id: customId,
}: CheckboxProps) {
  const generatedId = useId();
  const id = customId ?? generatedId;

  return (
    <div className={`checkbox ${disabled ? 'checkbox--disabled' : ''} ${error ? 'checkbox--error' : ''}`}>
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate;
          }}
          className="checkbox-input"
        />
        <span className="checkbox-box">
          {checked && !indeterminate && (
            <svg viewBox="0 0 12 10" className="checkbox-check">
              <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {indeterminate && (
            <svg viewBox="0 0 12 2" className="checkbox-indeterminate">
              <path d="M1 1H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </span>
        {label && (
          <label htmlFor={id} className="checkbox-label">
            {label}
          </label>
        )}
      </div>
      {error && <span className="checkbox-error">{error}</span>}
    </div>
  );
}
