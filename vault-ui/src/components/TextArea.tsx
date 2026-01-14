import './TextArea.css';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  maxLength?: number;
  showCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  value,
  onChange,
  label,
  error,
  hint,
  resize = 'vertical',
  maxLength,
  showCount = false,
  disabled,
  id,
  className = '',
  ...props
}, ref) => {
  const currentLength = value.length;
  const hasError = Boolean(error);

  return (
    <div className={`textarea-wrapper ${hasError ? 'textarea-wrapper--error' : ''} ${disabled ? 'textarea-wrapper--disabled' : ''}`}>
      {label && (
        <label className="textarea-label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={maxLength}
        className={`textarea textarea-resize--${resize} ${className}`}
        aria-invalid={hasError}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      <div className="textarea-footer">
        {error ? (
          <span id={`${id}-error`} className="textarea-error">{error}</span>
        ) : hint ? (
          <span id={`${id}-hint`} className="textarea-hint">{hint}</span>
        ) : (
          <span />
        )}
        {showCount && (
          <span className="textarea-count">
            {currentLength}{maxLength && `/${maxLength}`}
          </span>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';
