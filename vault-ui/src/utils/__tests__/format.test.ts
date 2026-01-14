import { describe, it, expect } from 'vitest';
import { formatCurrency, formatAddress, formatPercentage } from '../format';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('should format numbers with commas', () => {
      expect(formatCurrency('1000')).toBe('1,000.00');
      expect(formatCurrency('1000000')).toBe('1,000,000.00');
    });

    it('should handle decimals', () => {
      expect(formatCurrency('1234.56')).toBe('1,234.56');
      expect(formatCurrency('1234.567')).toBe('1,234.57');
    });

    it('should handle zero', () => {
      expect(formatCurrency('0')).toBe('0.00');
    });
  });

  describe('formatAddress', () => {
    it('should shorten Ethereum addresses', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(formatAddress(address)).toBe('0x1234...7890');
    });

    it('should handle short addresses', () => {
      expect(formatAddress('0x1234')).toBe('0x1234');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages', () => {
      expect(formatPercentage(12.5)).toBe('12.50%');
      expect(formatPercentage(0.123)).toBe('0.12%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.00%');
    });
  });
});
