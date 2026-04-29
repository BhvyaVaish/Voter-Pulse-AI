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

  it('should handle noisy input and still detect intent', () => {
    const result = detectIntentAdvanced('hey can you please tell me if i am actually allowed to vote in the next election', dictionary, 'en')
    expect(result.intent).toBe('ELIGIBILITY_CHECK')
    expect(result.confidence).toBeGreaterThan(0.5)
  })

  it('should handle severe typos in core keywords', () => {
    // "registrashun" instead of "registration"
    const result = detectIntentAdvanced('voter id registrashun help', dictionary, 'en')
    expect(result.intent).toBe('REGISTRATION_HELP')
  })

  it('should prioritize specific phrases over generic keywords', () => {
    const result = detectIntentAdvanced('voter registration application track', dictionary, 'en')
    expect(result.intent).toBe('REGISTRATION_HELP')
  })

  it('should handle mixed language input gracefully', () => {
    // Mixed Hindi/English "Voter registration kaise kare"
    const result = detectIntentAdvanced('Voter registration kaise kare', dictionary, 'hi')
    expect(result.intent).toBe('REGISTRATION_HELP')
  })

  it('should return low confidence for completely irrelevant input', () => {
    const result = detectIntentAdvanced('what is the weather in mumbai', dictionary, 'en')
    expect(result.confidence).toBeLessThan(0.3)
  })
});
