/**
 * Unit tests for address utilities
 */

import { describe, it, expect } from 'vitest';
import {
  isValidAddress,
  truncateAddress,
  addressesEqual,
  isZeroAddress,
  getDisplayName,
} from '../utils/addresses';

describe('Address Utilities', () => {
  describe('isValidAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false);
      expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidAddress('invalid')).toBe(false);
      expect(isValidAddress('0x123')).toBe(false);
      expect(isValidAddress('')).toBe(false);
    });
  });

  describe('truncateAddress', () => {
    it('should truncate address correctly', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
      expect(truncateAddress(address)).toBe('0x742d...bEb0');
      expect(truncateAddress(address, 8, 6)).toBe('0x742d35...f0bEb0');
    });

    it('should handle short addresses', () => {
      expect(truncateAddress('0x123')).toBe('0x123');
    });
  });

  describe('addressesEqual', () => {
    it('should compare addresses case-insensitively', () => {
      const addr1 = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
      const addr2 = '0x742D35CC6634C0532925A3B844BC9E7595F0BEB0';
      expect(addressesEqual(addr1, addr2)).toBe(true);
    });
  });

  describe('isZeroAddress', () => {
    it('should identify zero address', () => {
      expect(isZeroAddress('0x0000000000000000000000000000000000000000')).toBe(true);
      expect(isZeroAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(false);
    });
  });

  describe('getDisplayName', () => {
    it('should return ENS name when provided', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
      expect(getDisplayName(address, 'vitalik.eth')).toBe('vitalik.eth');
    });

    it('should return truncated address when no ENS', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
      expect(getDisplayName(address)).toBe('0x742d...bEb0');
    });
  });
});
