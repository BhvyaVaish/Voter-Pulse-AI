/**
 * @file knowledgeBase.test.ts
 * @description Unit tests for the offline knowledge base lookup system.
 */
import { describe, it, expect } from 'vitest';
import { getResponse } from './knowledgeBase';

describe('getResponse', () => {
  it('returns eligibility information for ELIGIBILITY_CHECK intent', () => {
    const result = getResponse('ELIGIBILITY_CHECK');
    expect(result).toBeDefined();
    expect(result.answer).toBeTypeOf('string');
    expect(result.answer.length).toBeGreaterThan(10);
    expect(result.answer.toLowerCase()).toContain('18');
  });

  it('returns registration info for REGISTRATION_HELP intent', () => {
    const result = getResponse('REGISTRATION_HELP');
    expect(result).toBeDefined();
    expect(result.answer.toLowerCase()).toContain('form');
    expect(result.trustLevel).toBeDefined();
  });

  it('returns voting info for VOTING_EXPLANATION intent', () => {
    const result = getResponse('VOTING_EXPLANATION');
    expect(result).toBeDefined();
    expect(result.answer.toLowerCase()).toContain('evm');
  });

  it('returns booth info for BOOTH_LOOKUP intent', () => {
    const result = getResponse('BOOTH_LOOKUP');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns candidate info for CANDIDATE_INFO intent', () => {
    const result = getResponse('CANDIDATE_INFO');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns complaint info for COMPLAINT_SUPPORT intent', () => {
    const result = getResponse('COMPLAINT_SUPPORT');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns document info for DOCUMENT_HELP intent', () => {
    const result = getResponse('DOCUMENT_HELP');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns correction info for CORRECTION_TRANSFER intent', () => {
    const result = getResponse('CORRECTION_TRANSFER');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns schedule info for ELECTION_SCHEDULE intent', () => {
    const result = getResponse('ELECTION_SCHEDULE');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns result info for RESULT_INFO intent', () => {
    const result = getResponse('RESULT_INFO');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns fact check info for FACT_CHECK intent', () => {
    const result = getResponse('FACT_CHECK');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(10);
  });

  it('returns greeting for GREETING intent', () => {
    const result = getResponse('GREETING');
    expect(result).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(5);
  });

  it('falls back to GENERAL for unknown intents', () => {
    const result = getResponse('TOTALLY_UNKNOWN_INTENT_XYZ');
    expect(result).toBeDefined();
    expect(result.trustLevel).toBe('general');
  });

  it('every known intent response has quickActions array', () => {
    const intents = [
      'ELIGIBILITY_CHECK', 'REGISTRATION_HELP', 'VOTING_EXPLANATION',
      'BOOTH_LOOKUP', 'COMPLAINT_SUPPORT', 'GENERAL',
    ];
    for (const intent of intents) {
      const result = getResponse(intent);
      expect(Array.isArray(result.quickActions), `${intent} missing quickActions`).toBe(true);
      expect(result.quickActions.length).toBeGreaterThan(0);
    }
  });

  it('quickActions have label and action fields', () => {
    const result = getResponse('ELIGIBILITY_CHECK');
    for (const qa of result.quickActions) {
      expect(qa.label).toBeTypeOf('string');
      expect(qa.action).toBeTypeOf('string');
    }
  });

  it('trustLevel is one of the valid values', () => {
    const intents = [
      'ELIGIBILITY_CHECK', 'REGISTRATION_HELP', 'GENERAL',
      'VOTING_EXPLANATION', 'FACT_CHECK',
    ];
    const validLevels = ['verified', 'official', 'informational', 'general'];
    for (const intent of intents) {
      const result = getResponse(intent);
      expect(validLevels).toContain(result.trustLevel);
    }
  });
});
