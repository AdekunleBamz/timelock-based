/**
 * Advanced form validation utilities
 */

export type ValidationRule<T = any> = {
  validator: (value: T) => boolean;
  message: string;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Validate a single field
 */
export function validateField<T>(
  value: T,
  rules: ValidationRule<T>[]
): string | undefined {
  for (const rule of rules) {
    if (!rule.validator(value)) {
      return rule.message;
    }
  }
  return undefined;
}

/**
 * Validate entire form
 */
export function validateForm<T extends Record<string, any>>(
  values: T,
  rules: ValidationRules<T>
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};
  
  for (const key in rules) {
    const fieldRules = rules[key];
    if (fieldRules) {
      const error = validateField(values[key], fieldRules);
      if (error) {
        errors[key] = error;
      }
    }
  }
  
  return errors;
}

/**
 * Common validation rules
 */
export const validators = {
  required: <T>(message: string = 'This field is required'): ValidationRule<T> => ({
    validator: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return !isNaN(value);
      return value != null;
    },
    message,
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validator: (value) => value >= min,
    message: message || `Value must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validator: (value) => value <= max,
    message: message || `Value must be no more than ${max}`,
  }),

  minLength: (length: number, message?: string): ValidationRule<string> => ({
    validator: (value) => value.length >= length,
    message: message || `Must be at least ${length} characters`,
  }),

  maxLength: (length: number, message?: string): ValidationRule<string> => ({
    validator: (value) => value.length <= length,
    message: message || `Must be no more than ${length} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validator: (value) => regex.test(value),
    message,
  }),

  email: (message: string = 'Invalid email address'): ValidationRule<string> => ({
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  url: (message: string = 'Invalid URL'): ValidationRule<string> => ({
    validator: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  ethereumAddress: (message: string = 'Invalid Ethereum address'): ValidationRule<string> => ({
    validator: (value) => /^0x[a-fA-F0-9]{40}$/.test(value),
    message,
  }),

  positive: (message: string = 'Value must be positive'): ValidationRule<number> => ({
    validator: (value) => value > 0,
    message,
  }),

  integer: (message: string = 'Value must be an integer'): ValidationRule<number> => ({
    validator: (value) => Number.isInteger(value),
    message,
  }),

  match: <T>(otherValue: T, message: string): ValidationRule<T> => ({
    validator: (value) => value === otherValue,
    message,
  }),

  custom: <T>(validator: (value: T) => boolean, message: string): ValidationRule<T> => ({
    validator,
    message,
  }),
};

/**
 * Validate USDC amount
 */
export function validateUSDCAmount(
  amount: string,
  minAmount?: number
): string | undefined {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return 'Please enter a valid amount';
  }
  
  if (numAmount <= 0) {
    return 'Amount must be greater than 0';
  }
  
  if (minAmount && numAmount < minAmount) {
    return `Minimum amount is ${minAmount} USDC`;
  }
  
  // Check for too many decimal places (USDC has 6 decimals)
  const decimals = amount.split('.')[1];
  if (decimals && decimals.length > 6) {
    return 'Maximum 6 decimal places allowed';
  }
  
  return undefined;
}

/**
 * Validate lock duration in days
 */
export function validateLockDuration(
  days: number,
  minDays?: number,
  maxDays?: number
): string | undefined {
  if (!Number.isInteger(days)) {
    return 'Lock duration must be a whole number of days';
  }
  
  if (days <= 0) {
    return 'Lock duration must be greater than 0';
  }
  
  if (minDays && days < minDays) {
    return `Minimum lock duration is ${minDays} days`;
  }
  
  if (maxDays && days > maxDays) {
    return `Maximum lock duration is ${maxDays} days`;
  }
  
  return undefined;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
}
