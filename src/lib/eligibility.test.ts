import { describe, it, expect } from 'vitest'
import { checkEligibility, getNextQualifyingDate } from './eligibility'
import { format } from 'date-fns'

describe('checkEligibility', () => {
  it('should identify eligible adult citizens', () => {
    // 25 years old
    const dob = '1999-01-01'
    const result = checkEligibility(dob, true, false)
    expect(result.eligible).toBe(true)
    expect(result.recommendedForm).toBe('Form 6')
  })

  it('should identify eligible NRI adult citizens', () => {
    const dob = '1990-05-15'
    const result = checkEligibility(dob, true, true)
    expect(result.eligible).toBe(true)
    expect(result.recommendedForm).toBe('Form 6A')
  })

  it('should identify ineligible non-citizens', () => {
    const dob = '1990-01-01'
    const result = checkEligibility(dob, false, false)
    expect(result.eligible).toBe(false)
    expect(result.message).toContain('Only Indian citizens')
  })

  it('should handle advance application for those turning 18 soon', () => {
    const today = new Date()
    const nextQD = getNextQualifyingDate(today)
    
    // Set DOB so they are 17 now but 18 exactly on the next qualifying date
    const dob = new Date(nextQD.getFullYear() - 18, nextQD.getMonth(), nextQD.getDate())
    const dobStr = format(dob, 'yyyy-MM-dd')
    
    const result = checkEligibility(dobStr, true, false)
    expect(result.advanceEligible).toBe(true)
    expect(result.message).toContain('advance application')
  })

  it('should identify minors who are too young for advance application', () => {
    // 5 years old
    const dob = '2019-01-01'
    const result = checkEligibility(dob, true, false)
    expect(result.eligible).toBe(false)
    expect(result.advanceEligible).toBe(false)
    expect(result.message).toContain('need to be 18')
  })
})
