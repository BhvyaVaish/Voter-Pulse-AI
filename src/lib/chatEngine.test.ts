import { describe, it, expect } from 'vitest'
import { detectIntentAdvanced } from './chatEngine'
import { dictionary } from './chatDictionary'

describe('detectIntentAdvanced', () => {
  it('should detect ELIGIBILITY_CHECK for English queries', () => {
    const result = detectIntentAdvanced('can i vote', dictionary, 'en')
    expect(result.intent).toBe('ELIGIBILITY_CHECK')
    expect(result.confidence).toBeGreaterThan(0.5)
  })

  it('should detect ELIGIBILITY_CHECK for Hindi queries', () => {
    const result = detectIntentAdvanced('क्या मैं वोट दे सकता हूँ', dictionary, 'hi')
    expect(result.intent).toBe('ELIGIBILITY_CHECK')
    expect(result.confidence).toBeGreaterThan(0.5)
  })

  it('should handle typos using fuzzy matching', () => {
    // "eligibilty" instead of "eligibility"
    const result = detectIntentAdvanced('check my eligibilty', dictionary, 'en')
    expect(result.intent).toBe('ELIGIBILITY_CHECK')
    expect(result.confidence).toBeGreaterThan(0)
  })

  it('should detect REGISTRATION_HELP', () => {
    const result = detectIntentAdvanced('how to register for voter id', dictionary, 'en')
    expect(result.intent).toBe('REGISTRATION_HELP')
  })

  it('should detect BOOTH_LOOKUP', () => {
    const result = detectIntentAdvanced('where is my polling booth', dictionary, 'en')
    expect(result.intent).toBe('BOOTH_LOOKUP')
  })

  it('should detect GREETING', () => {
    const result = detectIntentAdvanced('hello namaste', dictionary, 'hi')
    expect(result.intent).toBe('GREETING')
  })

  it('should return GENERAL for empty input', () => {
    const result = detectIntentAdvanced('', dictionary, 'en')
    expect(result.intent).toBe('GENERAL')
    expect(result.confidence).toBe(0)
  })

  it('should handle multi-language localized labels', () => {
    const resultEn = detectIntentAdvanced('can i vote', dictionary, 'en')
    expect(resultEn.label).toBe('Eligibility Check')

    const resultHi = detectIntentAdvanced('क्या मैं वोट दे सकता हूँ', dictionary, 'hi')
    expect(resultHi.label).toBe('पात्रता जाँच')
  })
})
