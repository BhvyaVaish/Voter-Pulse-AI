import { describe, it, expect } from 'vitest'
import { getRoadmap } from './roadmaps'

describe('getRoadmap', () => {
  it('should return the correct roadmap for new-voter persona', () => {
    const roadmap = getRoadmap('new-voter')
    expect(roadmap.length).toBeGreaterThan(0)
    expect(roadmap[0].id).toBe('eligibility')
    expect(roadmap.some(s => s.id === 'registration')).toBe(true)
  })

  it('should return the correct roadmap for existing-voter persona', () => {
    const roadmap = getRoadmap('existing-voter')
    expect(roadmap.length).toBeGreaterThan(0)
    expect(roadmap[0].id).toBe('verify-reg')
  })

  it('should return the correct roadmap for civic-action persona', () => {
    const roadmap = getRoadmap('civic-action')
    expect(roadmap.length).toBeGreaterThan(0)
    expect(roadmap[0].id).toBe('mcc')
  })

  it('should return an empty array for an unknown persona', () => {
    const roadmap = getRoadmap('unknown')
    expect(roadmap).toEqual([])
  })

  it('should return a fresh copy of the roadmap (not shared state)', () => {
    const r1 = getRoadmap('new-voter')
    const r2 = getRoadmap('new-voter')
    
    r1[0].completed = true
    expect(r2[0].completed).toBe(false)
  })
})
