/**
 * @file chatDictionary.test.ts
 * @description Unit tests for the multi-lingual intent dictionary structure and coverage.
 */
import { describe, it, expect } from 'vitest';
import { dictionary } from './chatDictionary';

describe('chatDictionary', () => {
  it('should export a non-empty dictionary', () => {
    expect(dictionary).toBeDefined();
    expect(Object.keys(dictionary).length).toBeGreaterThan(5);
  });

  it('should contain all core intent categories', () => {
    const requiredIntents = [
      'ELIGIBILITY_CHECK',
      'REGISTRATION_HELP',
      'BOOTH_LOOKUP',
      'CANDIDATE_INFO',
      'COMPLAINT_SUPPORT',
      'VOTING_EXPLANATION',
      'GREETING',
    ];
    for (const intent of requiredIntents) {
      expect(dictionary).toHaveProperty(intent);
    }
  });

  it('every intent should have keywords and phrases arrays', () => {
    for (const [key, entry] of Object.entries(dictionary)) {
      expect(Array.isArray(entry.keywords), `${key} missing keywords`).toBe(true);
      expect(Array.isArray(entry.phrases), `${key} missing phrases`).toBe(true);
    }
  });

  it('every intent should have a label', () => {
    for (const [key, entry] of Object.entries(dictionary)) {
      expect(entry.label, `${key} missing label`).toBeTypeOf('string');
    }
  });

  it('ELIGIBILITY_CHECK should contain multi-lingual keywords', () => {
    const entry = dictionary['ELIGIBILITY_CHECK'];
    expect(entry.keywords).toContain('eligible');
    expect(entry.keywords).toContain('18');
    // Hindi keyword
    expect(entry.keywords.some((k: string) => k.includes('पात्र'))).toBe(true);
  });

  it('no intent should have an empty keywords array (except GENERAL)', () => {
    for (const [key, entry] of Object.entries(dictionary)) {
      if (key === 'GENERAL') continue;
      expect(entry.keywords.length, `${key} has empty keywords`).toBeGreaterThan(0);
    }
  });

  it('REGISTRATION_HELP should include common typo "registraton"', () => {
    const entry = dictionary['REGISTRATION_HELP'];
    expect(entry.keywords).toContain('registraton');
  });

  it('labelLocalized should have en, hi, ta, bn, mr keys', () => {
    for (const [key, entry] of Object.entries(dictionary)) {
      if (key === 'GENERAL') continue;
      const locales = Object.keys(entry.labelLocalized);
      expect(locales, `${key} missing locale keys`).toContain('en');
      expect(locales).toContain('hi');
      expect(locales).toContain('ta');
    }
  });
});
