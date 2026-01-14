// Common form validation patterns and utilities

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type ValidatorFn = (value: unknown) => ValidationResult;

/**
 * Compose multiple validators into one
 */
export function composeValidators(...validators: ValidatorFn[]): ValidatorFn {
  return (value: unknown) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  };
}

/**
 * Required field validator
 */
export function required(message = 'This field is required'): ValidatorFn {
  return (value: unknown) => {
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (typeof value === 'string' && value.trim() === '');

    return isEmpty ? { valid: false, error: message } : { valid: true };
  };
}

/**
 * Minimum value validator (for numbers)
 */
export function min(minValue: number, message?: string): ValidatorFn {
  return (value: unknown) => {
    const num = Number(value);
    if (isNaN(num) || num < minValue) {
      return {
        valid: false,
        error: message || `Value must be at least ${minValue}`,
      };
    }
    return { valid: true };
  };
}

/**
 * Maximum value validator (for numbers)
 */
export function max(maxValue: number, message?: string): ValidatorFn {
  return (value: unknown) => {
    const num = Number(value);
    if (isNaN(num) || num > maxValue) {
      return {
        valid: false,
        error: message || `Value must be at most ${maxValue}`,
      };
    }
    return { valid: true };
  };
}

/**
 * Minimum length validator (for strings/arrays)
 */
export function minLength(length: number, message?: string): ValidatorFn {
  return (value: unknown) => {
    const hasLength = typeof value === 'string' || Array.isArray(value);
    if (!hasLength || (value as string | unknown[]).length < length) {
      return {
        valid: false,
        error: message || `Must be at least ${length} characters`,
      };
    }
    return { valid: true };
  };
}

/**
 * Maximum length validator (for strings/arrays)
 */
export function maxLength(length: number, message?: string): ValidatorFn {
  return (value: unknown) => {
    const hasLength = typeof value === 'string' || Array.isArray(value);
    if (hasLength && (value as string | unknown[]).length > length) {
      return {
        valid: false,
        error: message || `Must be at most ${length} characters`,
      };
    }
    return { valid: true };
  };
}

/**
 * Pattern/regex validator
 */
export function pattern(regex: RegExp, message = 'Invalid format'): ValidatorFn {
  return (value: unknown) => {
    const str = String(value);
    return regex.test(str) ? { valid: true } : { valid: false, error: message };
  };
}

/**
 * Email validator
 */
export function email(message = 'Invalid email address'): ValidatorFn {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern(emailRegex, message);
}

/**
 * Ethereum address validator
 */
export function ethereumAddress(message = 'Invalid Ethereum address'): ValidatorFn {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return pattern(addressRegex, message);
}

/**
 * Numeric string validator
 */
export function numeric(message = 'Must be a valid number'): ValidatorFn {
  return (value: unknown) => {
    const num = Number(value);
    return !isNaN(num) && isFinite(num)
      ? { valid: true }
      : { valid: false, error: message };
  };
}

/**
 * Integer validator
 */
export function integer(message = 'Must be a whole number'): ValidatorFn {
  return (value: unknown) => {
    const num = Number(value);
    return Number.isInteger(num)
      ? { valid: true }
      : { valid: false, error: message };
  };
}

/**
 * Custom validator from function
 */
export function custom(
  validatorFn: (value: unknown) => boolean,
  message = 'Invalid value'
): ValidatorFn {
  return (value: unknown) => {
    return validatorFn(value)
      ? { valid: true }
      : { valid: false, error: message };
  };
}

/**
 * USDC amount validator (positive number with max 6 decimals)
 */
export function usdcAmount(message?: string): ValidatorFn {
  return composeValidators(
    required('Amount is required'),
    numeric('Must be a valid number'),
    min(0.000001, 'Amount must be greater than 0'),
    custom(
      (value) => {
        const str = String(value);
        const decimals = str.split('.')[1];
        return !decimals || decimals.length <= 6;
      },
      message || 'Maximum 6 decimal places allowed'
    )
  );
}

/**
 * Lock duration validator (in seconds, positive integer)
 */
export function lockDuration(minDays = 1, maxDays = 365): ValidatorFn {
  const minSeconds = minDays * 86400;
  const maxSeconds = maxDays * 86400;
  
  return composeValidators(
    required('Duration is required'),
    integer('Duration must be a whole number'),
    min(minSeconds, `Minimum lock duration is ${minDays} day(s)`),
    max(maxSeconds, `Maximum lock duration is ${maxDays} day(s)`)
  );
}
