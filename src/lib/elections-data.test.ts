/**
 * @file elections-data.test.ts
 * @description Unit tests for the election computation engine, filters, and search.
 */
import { describe, it, expect } from 'vitest';
import {
  stateData,
  lokSabhaInfo,
  eciLinks,
  getUpcomingElections,
  searchElections,
  filterByRegion,
  filterByStatus,
  filterByType,
  getNextElection,
  regionLabels,
  statusLabels,
  statusColors,
} from './elections-data';

describe('stateData', () => {
  it('should contain data for all major states and UTs', () => {
    expect(stateData.length).toBeGreaterThanOrEqual(28);
  });

  it('every state should have valid required fields', () => {
    for (const s of stateData) {
      expect(s.name).toBeTypeOf('string');
      expect(s.code).toBeTypeOf('string');
      expect(s.code.length).toBeLessThanOrEqual(3);
      expect(['state', 'ut']).toContain(s.type);
      expect(['north', 'south', 'east', 'west', 'northeast', 'central']).toContain(s.region);
      expect(s.seats).toBeGreaterThan(0);
      expect(s.lastElectionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.termExpiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('CEO URLs should be .gov.in or .nic.in domains', () => {
    for (const s of stateData) {
      expect(s.ceoUrl).toMatch(/\.(gov\.in|nic\.in)/);
    }
  });

  it('should have unique state codes', () => {
    const codes = stateData.map(s => s.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('term expiry should be after last election date', () => {
    for (const s of stateData) {
      const last = new Date(s.lastElectionDate);
      const expiry = new Date(s.termExpiryDate);
      expect(expiry.getTime()).toBeGreaterThan(last.getTime());
    }
  });
});

describe('lokSabhaInfo', () => {
  it('should have 543 seats', () => {
    expect(lokSabhaInfo.seats).toBe(543);
  });

  it('should have valid ECI URLs', () => {
    expect(lokSabhaInfo.eciUrl).toContain('eci.gov.in');
    expect(lokSabhaInfo.voterPortal).toContain('voters.eci.gov.in');
  });
});

describe('eciLinks', () => {
  it('all links should be HTTPS', () => {
    for (const url of Object.values(eciLinks)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});

describe('getUpcomingElections', () => {
  it('should return an array of election events', () => {
    const events = getUpcomingElections();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  it('should include the Lok Sabha election', () => {
    const events = getUpcomingElections();
    const lokSabha = events.find(e => e.type === 'general');
    expect(lokSabha).toBeDefined();
    expect(lokSabha?.seats).toBe(543);
  });

  it('every event should have a valid status', () => {
    const events = getUpcomingElections();
    const validStatuses = ['completed', 'ongoing', 'announced', 'upcoming', 'expected'];
    for (const e of events) {
      expect(validStatuses).toContain(e.status);
    }
  });

  it('events should be sorted by status priority', () => {
    const events = getUpcomingElections();
    const statusOrder = { ongoing: 0, announced: 1, upcoming: 2, expected: 3, completed: 4 };
    for (let i = 1; i < events.length; i++) {
      const prev = statusOrder[events[i - 1].status];
      const curr = statusOrder[events[i].status];
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });

  it('should compute status based on provided date', () => {
    // Far future date — all should be completed
    const farFuture = new Date('2040-01-01');
    const events = getUpcomingElections(farFuture);
    const allCompleted = events.every(e => e.status === 'completed');
    expect(allCompleted).toBe(true);
  });
});

describe('searchElections', () => {
  const events = getUpcomingElections();

  it('empty query returns all events', () => {
    expect(searchElections(events, '')).toEqual(events);
    expect(searchElections(events, '   ')).toEqual(events);
  });

  it('filters by state name', () => {
    const results = searchElections(events, 'Delhi');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(e => e.state === 'Delhi')).toBe(true);
  });

  it('filters by state code', () => {
    const results = searchElections(events, 'DL');
    expect(results.length).toBeGreaterThan(0);
  });

  it('is case-insensitive', () => {
    const upper = searchElections(events, 'DELHI');
    const lower = searchElections(events, 'delhi');
    expect(upper.length).toBe(lower.length);
  });
});

describe('filterByRegion', () => {
  const events = getUpcomingElections();

  it('"all" returns everything', () => {
    expect(filterByRegion(events, 'all')).toEqual(events);
  });

  it('filters to specific region', () => {
    const south = filterByRegion(events, 'south');
    expect(south.length).toBeGreaterThan(0);
    expect(south.every(e => e.region === 'south')).toBe(true);
  });
});

describe('filterByStatus', () => {
  const events = getUpcomingElections();

  it('"all" returns everything', () => {
    expect(filterByStatus(events, 'all')).toEqual(events);
  });
});

describe('filterByType', () => {
  const events = getUpcomingElections();

  it('"all" returns everything', () => {
    expect(filterByType(events, 'all')).toEqual(events);
  });

  it('filters to general elections', () => {
    const general = filterByType(events, 'general');
    expect(general.every(e => e.type === 'general')).toBe(true);
  });
});

describe('getNextElection', () => {
  it('returns the first announced/upcoming election', () => {
    const events = getUpcomingElections();
    const next = getNextElection(events);
    if (next) {
      expect(['announced', 'upcoming', 'expected']).toContain(next.status);
    }
  });
});

describe('label and color constants', () => {
  it('regionLabels covers all regions plus "all"', () => {
    expect(Object.keys(regionLabels)).toContain('all');
    expect(Object.keys(regionLabels)).toContain('north');
    expect(Object.keys(regionLabels)).toContain('south');
  });

  it('statusLabels covers all statuses plus "all"', () => {
    expect(Object.keys(statusLabels)).toContain('all');
    expect(Object.keys(statusLabels)).toContain('ongoing');
    expect(Object.keys(statusLabels)).toContain('completed');
  });

  it('statusColors maps all statuses to CSS classes', () => {
    for (const val of Object.values(statusColors)) {
      expect(val).toContain('bg-');
      expect(val).toContain('text-');
    }
  });
});
