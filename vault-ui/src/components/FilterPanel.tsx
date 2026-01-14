import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { RadioGroup, RadioOption } from './RadioGroup';
import { Button } from './Button';
import { Divider } from './Divider';
import './FilterPanel.css';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, unknown>;
  onChange: (filterId: string, value: unknown) => void;
  onReset?: () => void;
  onApply?: () => void;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onReset,
  onApply,
}: FilterPanelProps) {
  const handleCheckboxChange = (filterId: string, optionValue: string, checked: boolean) => {
    const currentValues = (values[filterId] as string[]) || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
    onChange(filterId, newValues);
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3 className="filter-panel-title">Filters</h3>
        {onReset && (
          <button className="filter-panel-reset" onClick={onReset}>
            Reset
          </button>
        )}
      </div>

      <div className="filter-panel-content">
        {filters.map((filter, index) => (
          <div key={filter.id}>
            {index > 0 && <Divider />}
            <div className="filter-section">
              <h4 className="filter-section-title">{filter.label}</h4>

              {filter.type === 'checkbox' && filter.options && (
                <div className="filter-options">
                  {filter.options.map((option) => (
                    <Checkbox
                      key={option.value}
                      label={option.label}
                      checked={((values[filter.id] as string[]) || []).includes(option.value)}
                      onChange={(checked) => handleCheckboxChange(filter.id, option.value, checked)}
                    />
                  ))}
                </div>
              )}

              {filter.type === 'radio' && filter.options && (
                <RadioGroup
                  value={(values[filter.id] as string) || ''}
                  onChange={(value) => onChange(filter.id, value)}
                  options={filter.options.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                />
              )}

              {filter.type === 'range' && (
                <div className="filter-range">
                  <input
                    type="range"
                    min={filter.min || 0}
                    max={filter.max || 100}
                    value={(values[filter.id] as number) || filter.min || 0}
                    onChange={(e) => onChange(filter.id, Number(e.target.value))}
                    className="filter-range-input"
                  />
                  <div className="filter-range-value">
                    {values[filter.id] || filter.min || 0}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {onApply && (
        <div className="filter-panel-footer">
          <Button variant="primary" fullWidth onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}

interface SortControlsProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  direction: 'asc' | 'desc';
  onChange: (value: string) => void;
  onDirectionChange: (direction: 'asc' | 'desc') => void;
}

export function SortControls({
  options,
  value,
  direction,
  onChange,
  onDirectionChange,
}: SortControlsProps) {
  return (
    <div className="sort-controls">
      <span className="sort-controls-label">Sort by:</span>
      <select
        className="sort-controls-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        className="sort-controls-direction"
        onClick={() => onDirectionChange(direction === 'asc' ? 'desc' : 'asc')}
        aria-label={`Sort ${direction === 'asc' ? 'descending' : 'ascending'}`}
      >
        {direction === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}
