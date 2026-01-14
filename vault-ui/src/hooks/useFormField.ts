import { useCallback, useRef, useEffect, useState } from 'react';

interface FormFieldState<T> {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

type ValidationRule<T> = (value: T) => string | null;

interface UseFormFieldOptions<T> {
  initialValue: T;
  validate?: ValidationRule<T>[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormField<T>({
  initialValue,
  validate = [],
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormFieldOptions<T>) {
  const [state, setState] = useState<FormFieldState<T>>({
    value: initialValue,
    error: null,
    touched: false,
    dirty: false,
  });

  const initialRef = useRef(initialValue);

  const runValidation = useCallback(
    (value: T): string | null => {
      for (const rule of validate) {
        const error = rule(value);
        if (error) return error;
      }
      return null;
    },
    [validate]
  );

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setState((prev) => {
        const value = typeof newValue === 'function' 
          ? (newValue as (prev: T) => T)(prev.value) 
          : newValue;
        const dirty = value !== initialRef.current;
        const error = validateOnChange ? runValidation(value) : prev.error;
        return { ...prev, value, dirty, error };
      });
    },
    [validateOnChange, runValidation]
  );

  const setTouched = useCallback(
    (touched = true) => {
      setState((prev) => {
        const error = validateOnBlur && touched ? runValidation(prev.value) : prev.error;
        return { ...prev, touched, error };
      });
    },
    [validateOnBlur, runValidation]
  );

  const validateField = useCallback(() => {
    const error = runValidation(state.value);
    setState((prev) => ({ ...prev, error }));
    return error === null;
  }, [state.value, runValidation]);

  const reset = useCallback(() => {
    setState({
      value: initialRef.current,
      error: null,
      touched: false,
      dirty: false,
    });
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    setValue,
    setTouched,
    validate: validateField,
    reset,
    setError,
    isValid: state.error === null,
    showError: state.touched && state.error !== null,
  };
}

// Common validators
export const validators = {
  required: (message = 'This field is required') => 
    (value: unknown): string | null => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      if (Array.isArray(value) && value.length === 0) {
        return message;
      }
      return null;
    },

  minLength: (min: number, message?: string) => 
    (value: string): string | null => {
      if (value.length < min) {
        return message ?? `Must be at least ${min} characters`;
      }
      return null;
    },

  maxLength: (max: number, message?: string) => 
    (value: string): string | null => {
      if (value.length > max) {
        return message ?? `Must be no more than ${max} characters`;
      }
      return null;
    },

  min: (min: number, message?: string) => 
    (value: number): string | null => {
      if (value < min) {
        return message ?? `Must be at least ${min}`;
      }
      return null;
    },

  max: (max: number, message?: string) => 
    (value: number): string | null => {
      if (value > max) {
        return message ?? `Must be no more than ${max}`;
      }
      return null;
    },

  pattern: (regex: RegExp, message = 'Invalid format') => 
    (value: string): string | null => {
      if (!regex.test(value)) {
        return message;
      }
      return null;
    },

  email: (message = 'Invalid email address') => 
    (value: string): string | null => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return message;
      }
      return null;
    },

  address: (message = 'Invalid Ethereum address') => 
    (value: string): string | null => {
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        return message;
      }
      return null;
    },
};
