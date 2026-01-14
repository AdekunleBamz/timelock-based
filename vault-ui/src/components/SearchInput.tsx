import './SearchInput.css';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
  onClear?: () => void;
  autoFocus?: boolean;
}

export function SearchInput({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  loading = false,
  onClear,
  autoFocus = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const debouncedValue = useDebounce(internalValue, debounceMs);

  // Sync with controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Notify parent on debounced value change
  useEffect(() => {
    if (debouncedValue !== controlledValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, controlledValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInternalValue('');
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  const hasValue = internalValue.length > 0;

  return (
    <div className="search-input">
      <span className="search-input-icon">🔍</span>
      <input
        type="text"
        className="search-input-field"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      {loading && <span className="search-input-spinner" />}
      {hasValue && !loading && (
        <button
          className="search-input-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
