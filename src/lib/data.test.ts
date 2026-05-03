/**
 * @file data.test.ts
 * @description Unit tests for candidate data, profiles, and utility functions.
 */
import { describe, it, expect } from 'vitest';
import { candidates, mockCandidateProfiles, indianStates, formatINR } from './data';

describe('candidates', () => {
  it('should contain 7 candidates including NOTA', () => {
    expect(candidates).toHaveLength(7);
  });

  it('should have NOTA as the last candidate', () => {
    const nota = candidates[candidates.length - 1];
    expect(nota.name).toBe('NOTA');
    expect(nota.party).toBe('None of the Above');
  });

  it('every candidate should have required fields', () => {
    for (const c of candidates) {
      expect(c.id).toBeTypeOf('number');
      expect(c.name).toBeTypeOf('string');
      expect(c.party).toBeTypeOf('string');
      expect(c.symbol).toBeTypeOf('string');
      expect(c.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('should have unique IDs', () => {
    const ids = candidates.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('mockCandidateProfiles', () => {
  it('should contain 6 profiles', () => {
    expect(mockCandidateProfiles).toHaveLength(6);
  });

  it('every profile should have valid asset structure', () => {
    for (const p of mockCandidateProfiles) {
      expect(p.assets.movable).toBeTypeOf('number');
      expect(p.assets.immovable).toBeTypeOf('number');
      expect(p.assets.total).toBeTypeOf('number');
      expect(p.assets.total).toBe(p.assets.movable + p.assets.immovable);
    }
  });

  it('criminal details count should match criminalCases', () => {
    for (const p of mockCandidateProfiles) {
      expect(p.criminalDetails.length).toBe(p.criminalCases);
    }
  });

  it('all profiles should be from same constituency', () => {
    const constituencies = new Set(mockCandidateProfiles.map(p => p.constituency));
    expect(constituencies.size).toBe(1);
    expect(constituencies.has('Mumbai South')).toBe(true);
  });
});

describe('indianStates', () => {
  it('should contain all 28 states + 3 UTs', () => {
    expect(indianStates.length).toBeGreaterThanOrEqual(31);
  });

  it('should include Delhi', () => {
    expect(indianStates).toContain('Delhi');
  });

  it('should include Jammu & Kashmir', () => {
    expect(indianStates).toContain('Jammu & Kashmir');
  });

  it('should not contain duplicates', () => {
    expect(new Set(indianStates).size).toBe(indianStates.length);
  });
});

describe('formatINR', () => {
  it('formats crores correctly', () => {
    expect(formatINR(10000000)).toBe('₹1.0 Cr');
    expect(formatINR(45000000)).toBe('₹4.5 Cr');
    expect(formatINR(12700000000)).toBe('₹1270.0 Cr');
  });

  it('formats lakhs correctly', () => {
    expect(formatINR(100000)).toBe('₹1.0 L');
    expect(formatINR(500000)).toBe('₹5.0 L');
    expect(formatINR(9900000)).toBe('₹99.0 L');
  });

  it('formats small amounts with locale', () => {
    const result = formatINR(50000);
    expect(result).toContain('₹');
    expect(result).toContain('50');
  });

  it('formats zero correctly', () => {
    const result = formatINR(0);
    expect(result).toContain('₹');
  });
});
