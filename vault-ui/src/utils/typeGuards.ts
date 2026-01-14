/**
 * Type guard utilities
 */

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as any).then === 'function'
  );
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isEmptyString(value: unknown): boolean {
  return isString(value) && value.trim().length === 0;
}

export function isEmptyArray(value: unknown): boolean {
  return isArray(value) && value.length === 0;
}
