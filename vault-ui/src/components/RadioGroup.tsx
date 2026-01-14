import './RadioGroup.css';
import { createContext, useContext, useId, type ReactNode } from 'react';

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  disabled?: boolean;
  label?: string;
  direction?: 'horizontal' | 'vertical';
  error?: string;
}

export function RadioGroup({
  children,
  value,
  onChange,
  name: customName,
  disabled = false,
  label,
  direction = 'vertical',
  error,
}: RadioGroupProps) {
  const generatedName = useId();
  const name = customName ?? generatedName;

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, disabled }}>
      <div 
        className={`radio-group radio-group--${direction} ${error ? 'radio-group--error' : ''}`}
        role="radiogroup"
        aria-label={label}
      >
        {label && <span className="radio-group-label">{label}</span>}
        <div className="radio-group-options">
          {children}
        </div>
        {error && <span className="radio-group-error">{error}</span>}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioOptionProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export function RadioOption({ value, label, disabled = false }: RadioOptionProps) {
  const context = useContext(RadioGroupContext);
  
  if (!context) {
    throw new Error('RadioOption must be used within a RadioGroup');
  }

  const { name, value: selectedValue, onChange, disabled: groupDisabled } = context;
  const isDisabled = disabled || groupDisabled;
  const isSelected = selectedValue === value;
  const id = `${name}-${value}`;

  return (
    <label 
      className={`radio-option ${isSelected ? 'radio-option--selected' : ''} ${isDisabled ? 'radio-option--disabled' : ''}`}
      htmlFor={id}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        disabled={isDisabled}
        className="radio-option-input"
      />
      <span className="radio-option-circle">
        {isSelected && <span className="radio-option-dot" />}
      </span>
      <span className="radio-option-label">{label}</span>
    </label>
  );
}
