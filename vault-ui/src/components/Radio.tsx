/**
 * Radio button component
 */

import './Radio.css';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helpText?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  helpText,
  orientation = 'vertical',
}: RadioGroupProps) {
  return (
    <div className="radio-group">
      {label && <div className="radio-group__label">{label}</div>}
      <div className={`radio-group__options radio-group__options--${orientation}`}>
        {options.map(option => (
          <label key={option.value} className="radio">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              disabled={option.disabled}
              className="radio__input"
            />
            <span className="radio__circle"></span>
            <span className="radio__label">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="radio-group__error-message">{error}</span>}
      {helpText && !error && <span className="radio-group__help-text">{helpText}</span>}
    </div>
  );
}
