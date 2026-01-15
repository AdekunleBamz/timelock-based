/**
 * Unit tests for vault utilities
 */

import { describe, it, expect } from 'vitest';
import {
  isDepositUnlocked,
  formatLockDuration,
  calculateAPY,
  getLockDurationTier,
  isValidLockDuration,
  getPopularLockDurations,
} from '../utils/vault';

describe('Vault Utilities', () => {
  describe('isDepositUnlocked', () => {
    it('should return true for past timestamps', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      expect(isDepositUnlocked(pastTimestamp)).toBe(true);
    });

    it('should return false for future timestamps', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      expect(isDepositUnlocked(futureTimestamp)).toBe(false);
    });
  });

  describe('formatLockDuration', () => {
    it('should format days correctly', () => {
      expect(formatLockDuration(1)).toBe('1 day');
      expect(formatLockDuration(15)).toBe('15 days');
    });

    it('should format months correctly', () => {
      expect(formatLockDuration(30)).toBe('1 month');
      expect(formatLockDuration(90)).toBe('3 months');
    });

    it('should format years correctly', () => {
      expect(formatLockDuration(365)).toBe('1 year');
      expect(formatLockDuration(730)).toBe('2 years');
    });
  });

  describe('calculateAPY', () => {
    it('should return correct APY for different durations', () => {
      expect(calculateAPY(30)).toBe(5.0);
      expect(calculateAPY(90)).toBe(7.0);
      expect(calculateAPY(180)).toBe(10.0);
      expect(calculateAPY(365)).toBe(15.0);
    });
  });

  describe('getLockDurationTier', () => {
    it('should return correct tier names', () => {
      expect(getLockDurationTier(15)).toBe('Basic');
      expect(getLockDurationTier(30)).toBe('Bronze');
      expect(getLockDurationTier(90)).toBe('Silver');
      expect(getLockDurationTier(180)).toBe('Gold');
      expect(getLockDurationTier(365)).toBe('Platinum');
    });
  });

  describe('isValidLockDuration', () => {
    it('should validate lock durations', () => {
      expect(isValidLockDuration(0)).toBe(false);
      expect(isValidLockDuration(1)).toBe(true);
      expect(isValidLockDuration(365)).toBe(true);
      expect(isValidLockDuration(1826)).toBe(false);
    });
  });

  describe('getPopularLockDurations', () => {
    it('should return popular lock durations', () => {
      const durations = getPopularLockDurations();
      expect(durations).toHaveLength(4);
      expect(durations[0].days).toBe(30);
      expect(durations[0].label).toBe('1 Month');
    });
  });
});
