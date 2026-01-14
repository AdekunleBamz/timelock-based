import './SelectInput.css';
import { useState, useRef } from 'react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  id?: string;
}

export function SelectInput({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  label,
  id,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(containerRef, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`select-input ${disabled ? 'select-input--disabled' : ''} ${error ? 'select-input--error' : ''}`}
    >
      {label && (
        <label className="select-input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div
        id={id}
        className={`select-input-trigger ${isOpen ? 'select-input-trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
      >
        <span className={selectedOption ? 'select-input-value' : 'select-input-placeholder'}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="select-input-icon">▼</span>
      </div>
      {isOpen && (
        <ul className="select-input-dropdown" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`select-input-option ${option.value === value ? 'select-input-option--selected' : ''} ${option.disabled ? 'select-input-option--disabled' : ''}`}
              onClick={() => !option.disabled && handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <span className="select-input-error">{error}</span>}
    </div>
  );
}
