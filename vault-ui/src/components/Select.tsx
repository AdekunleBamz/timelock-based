/**
 * Select component
 */

import './Select.css';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  placeholder?: string;
}

export function Select({
  label,
  error,
  helpText,
  options,
  fullWidth = false,
  placeholder,
  className = '',
  ...props
}: SelectProps) {
  const selectClass = `select ${error ? 'select--error' : ''} ${className}`;
  const containerClass = `select-container ${fullWidth ? 'select-container--full-width' : ''}`;

  return (
    <div className={containerClass}>
      {label && <label className="select__label">{label}</label>}
      <div className="select__wrapper">
        <select className={selectClass} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select__arrow">▼</span>
      </div>
      {error && <span className="select__error-message">{error}</span>}
      {helpText && !error && <span className="select__help-text">{helpText}</span>}
    </div>
  );
}
