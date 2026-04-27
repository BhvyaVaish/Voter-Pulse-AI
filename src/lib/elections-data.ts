// ─── Comprehensive Indian Elections Data ───
// Computes upcoming elections dynamically based on 5-year assembly terms.
// All CEO links are official .gov.in / .nic.in domains.
import { format } from 'date-fns';

export type ElectionType = 'general' | 'state_assembly' | 'ut_assembly' | 'by-election';
export type ElectionStatus = 'completed' | 'ongoing' | 'announced' | 'upcoming' | 'expected';
export type Region = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'central';

export interface StateInfo {
  name: string;
  code: string;
  type: 'state' | 'ut';
  region: Region;
  seats: number;
  lastElectionDate: string;     // ISO date of last assembly election
  termExpiryDate: string;       // ISO date when current assembly term expires
  ceoUrl: string;               // Chief Electoral Officer website
  eciStateUrl: string;          // ECI page for the state
}

export interface ElectionEvent {
  id: string;
  name: string;
  type: ElectionType;
  state: string;
  stateCode: string;
  region: Region;
  seats: number;
  scheduledDate?: string;       // Confirmed polling date
  scheduledPhases?: { phase: number; date: string; constituencies?: string }[];
  estimatedPeriod: string;      // e.g., "Apr 2027"
  resultDate?: string;
  status: ElectionStatus;
  ceoUrl: string;
  eciUrl: string;
  highlights?: string[];
}

// ─── State Data (all 28 states + key UTs) ───
export const stateData: StateInfo[] = [
  // ── NORTH ──
  { name: 'Delhi', code: 'DL', type: 'ut', region: 'north', seats: 70, lastElectionDate: '2025-02-05', termExpiryDate: '2030-02-25', ceoUrl: 'https://ceodelhi.gov.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Haryana', code: 'HR', type: 'state', region: 'north', seats: 90, lastElectionDate: '2024-10-05', termExpiryDate: '2029-10-25', ceoUrl: 'https://ceoharyana.gov.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Himachal Pradesh', code: 'HP', type: 'state', region: 'north', seats: 68, lastElectionDate: '2022-11-12', termExpiryDate: '2028-01-08', ceoUrl: 'https://ceohimachal.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Jammu & Kashmir', code: 'JK', type: 'ut', region: 'north', seats: 90, lastElectionDate: '2024-09-18', termExpiryDate: '2029-11-01', ceoUrl: 'https://ceojk.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Punjab', code: 'PB', type: 'state', region: 'north', seats: 117, lastElectionDate: '2022-02-20', termExpiryDate: '2027-03-20', ceoUrl: 'https://ceopunjab.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Rajasthan', code: 'RJ', type: 'state', region: 'north', seats: 200, lastElectionDate: '2023-11-25', termExpiryDate: '2028-12-15', ceoUrl: 'https://ceorajasthan.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Uttar Pradesh', code: 'UP', type: 'state', region: 'north', seats: 403, lastElectionDate: '2022-02-10', termExpiryDate: '2027-03-14', ceoUrl: 'https://ceouttarpradesh.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Uttarakhand', code: 'UK', type: 'state', region: 'north', seats: 70, lastElectionDate: '2022-02-14', termExpiryDate: '2027-03-21', ceoUrl: 'https://ceo.uk.gov.in', eciStateUrl: 'https://eci.gov.in' },

  // ── CENTRAL ──
  { name: 'Chhattisgarh', code: 'CG', type: 'state', region: 'central', seats: 90, lastElectionDate: '2023-11-07', termExpiryDate: '2028-12-04', ceoUrl: 'https://ceochhattisgarh.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Madhya Pradesh', code: 'MP', type: 'state', region: 'central', seats: 230, lastElectionDate: '2023-11-17', termExpiryDate: '2028-12-12', ceoUrl: 'https://ceomadhyapradesh.nic.in', eciStateUrl: 'https://eci.gov.in' },

  // ── WEST ──
  { name: 'Goa', code: 'GA', type: 'state', region: 'west', seats: 40, lastElectionDate: '2022-02-14', termExpiryDate: '2027-03-15', ceoUrl: 'https://ceogoa.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Gujarat', code: 'GJ', type: 'state', region: 'west', seats: 182, lastElectionDate: '2022-12-01', termExpiryDate: '2027-12-23', ceoUrl: 'https://ceo.gujarat.gov.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Maharashtra', code: 'MH', type: 'state', region: 'west', seats: 288, lastElectionDate: '2024-11-20', termExpiryDate: '2029-11-26', ceoUrl: 'https://ceo.maharashtra.gov.in', eciStateUrl: 'https://eci.gov.in' },

  // ── SOUTH ──
  { name: 'Andhra Pradesh', code: 'AP', type: 'state', region: 'south', seats: 175, lastElectionDate: '2024-05-13', termExpiryDate: '2029-06-09', ceoUrl: 'https://ceoandhra.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Karnataka', code: 'KA', type: 'state', region: 'south', seats: 224, lastElectionDate: '2023-05-10', termExpiryDate: '2028-05-24', ceoUrl: 'https://ceokarnataka.kar.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Kerala', code: 'KL', type: 'state', region: 'south', seats: 140, lastElectionDate: '2026-04-09', termExpiryDate: '2031-05-23', ceoUrl: 'https://ceo.kerala.gov.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Puducherry', code: 'PY', type: 'ut', region: 'south', seats: 30, lastElectionDate: '2026-04-09', termExpiryDate: '2031-06-15', ceoUrl: 'https://ceopuducherry.py.gov.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Tamil Nadu', code: 'TN', type: 'state', region: 'south', seats: 234, lastElectionDate: '2026-04-23', termExpiryDate: '2031-05-10', ceoUrl: 'https://elections.tn.gov.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Telangana', code: 'TS', type: 'state', region: 'south', seats: 119, lastElectionDate: '2023-11-30', termExpiryDate: '2028-12-09', ceoUrl: 'https://ceotelangana.nic.in', eciStateUrl: 'https://eci.gov.in' },

  // ── EAST ──
  { name: 'Bihar', code: 'BR', type: 'state', region: 'east', seats: 243, lastElectionDate: '2025-11-01', termExpiryDate: '2030-11-29', ceoUrl: 'https://ceobihar.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Jharkhand', code: 'JH', type: 'state', region: 'east', seats: 81, lastElectionDate: '2024-11-13', termExpiryDate: '2029-12-05', ceoUrl: 'https://ceojharkhand.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Odisha', code: 'OD', type: 'state', region: 'east', seats: 147, lastElectionDate: '2024-05-13', termExpiryDate: '2029-06-12', ceoUrl: 'https://ceoodisha.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'West Bengal', code: 'WB', type: 'state', region: 'east', seats: 294, lastElectionDate: '2026-04-23', termExpiryDate: '2031-05-07', ceoUrl: 'https://ceowestbengal.nic.in', eciStateUrl: 'https://eci.gov.in' },

  // ── NORTHEAST ──
  { name: 'Arunachal Pradesh', code: 'AR', type: 'state', region: 'northeast', seats: 60, lastElectionDate: '2024-04-19', termExpiryDate: '2029-06-02', ceoUrl: 'https://ceoarunachal.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Assam', code: 'AS', type: 'state', region: 'northeast', seats: 126, lastElectionDate: '2026-04-09', termExpiryDate: '2031-05-20', ceoUrl: 'https://ceoassam.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Manipur', code: 'MN', type: 'state', region: 'northeast', seats: 60, lastElectionDate: '2022-02-28', termExpiryDate: '2027-03-19', ceoUrl: 'https://ceomanipur.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Meghalaya', code: 'ML', type: 'state', region: 'northeast', seats: 60, lastElectionDate: '2023-02-27', termExpiryDate: '2028-03-15', ceoUrl: 'https://ceomeghalaya.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Mizoram', code: 'MZ', type: 'state', region: 'northeast', seats: 40, lastElectionDate: '2023-11-07', termExpiryDate: '2028-12-15', ceoUrl: 'https://ceomizoram.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Nagaland', code: 'NL', type: 'state', region: 'northeast', seats: 60, lastElectionDate: '2023-02-27', termExpiryDate: '2028-03-07', ceoUrl: 'https://ceonagaland.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Sikkim', code: 'SK', type: 'state', region: 'northeast', seats: 32, lastElectionDate: '2024-04-19', termExpiryDate: '2029-06-03', ceoUrl: 'https://ceosikkim.nic.in', eciStateUrl: 'https://eci.gov.in' },
  { name: 'Tripura', code: 'TR', type: 'state', region: 'northeast', seats: 60, lastElectionDate: '2023-02-16', termExpiryDate: '2028-03-08', ceoUrl: 'https://ceotripura.nic.in', eciStateUrl: 'https://eci.gov.in' },
];

// ─── Central Election (Lok Sabha) ───
export const lokSabhaInfo = {
  name: '18th Lok Sabha',
  seats: 543,
  lastElection: '2024-04-19',
  termExpiry: '2029-06-16',
  phases: 7,
  eciUrl: 'https://eci.gov.in',
  voterPortal: 'https://voters.eci.gov.in',
};

// ─── ECI Links ───
export const eciLinks = {
  main: 'https://eci.gov.in',
  voterServices: 'https://voters.eci.gov.in',
  voterRegistration: 'https://voters.eci.gov.in/register',
  electoralSearch: 'https://electoralsearch.eci.gov.in',
  eciResults: 'https://results.eci.gov.in',
  cVigil: 'https://cvigil.eci.gov.in',
  pib: 'https://pib.gov.in',
};

// ─── Dynamic Election Computation ───

function monthsUntil(dateStr: string, from: Date): number {
  const target = new Date(dateStr);
  return (target.getFullYear() - from.getFullYear()) * 12 + (target.getMonth() - from.getMonth());
}

function getStatus(termExpiry: string, now: Date): ElectionStatus {
  const months = monthsUntil(termExpiry, now);
  if (months < -1) return 'completed';
  if (months < 0) return 'ongoing';
  if (months <= 3) return 'announced';
  if (months <= 12) return 'upcoming';
  return 'expected';
}

function formatEstimatedPeriod(termExpiry: string): string {
  const d = new Date(termExpiry);
  // Elections are usually held 1-2 months before term expiry
  d.setMonth(d.getMonth() - 1);
  return format(d, 'dd-MM-yyyy');
}

export function getUpcomingElections(now: Date = new Date()): ElectionEvent[] {
  const events: ElectionEvent[] = [];

  // State/UT Assembly elections
  for (const state of stateData) {
    const status = getStatus(state.termExpiryDate, now);

    events.push({
      id: `${state.code}-assembly-${state.termExpiryDate.slice(0, 4)}`,
      name: `${state.name} Legislative Assembly Election`,
      type: state.type === 'ut' ? 'ut_assembly' : 'state_assembly',
      state: state.name,
      stateCode: state.code,
      region: state.region,
      seats: state.seats,
      estimatedPeriod: formatEstimatedPeriod(state.termExpiryDate),
      status,
      ceoUrl: state.ceoUrl,
      eciUrl: state.eciStateUrl,
    });
  }

  // Lok Sabha
  const lsStatus = getStatus(lokSabhaInfo.termExpiry, now);
  events.push({
    id: 'lok-sabha-19',
    name: '19th Lok Sabha General Election',
    type: 'general',
    state: 'All India',
    stateCode: 'IN',
    region: 'north',
    seats: lokSabhaInfo.seats,
    estimatedPeriod: formatEstimatedPeriod(lokSabhaInfo.termExpiry),
    status: lsStatus,
    ceoUrl: eciLinks.main,
    eciUrl: eciLinks.main,
    highlights: ['General election for 543 Lok Sabha constituencies across India', 'Multi-phase polling expected'],
  });

  // Sort: ongoing first, then announced, then upcoming, then expected, then completed
  const statusOrder: Record<ElectionStatus, number> = { ongoing: 0, announced: 1, upcoming: 2, expected: 3, completed: 4 };
  events.sort((a, b) => {
    const so = statusOrder[a.status] - statusOrder[b.status];
    if (so !== 0) return so;
    return new Date(a.estimatedPeriod).getTime() - new Date(b.estimatedPeriod).getTime();
  });

  return events;
}

export function searchElections(elections: ElectionEvent[], query: string): ElectionEvent[] {
  if (!query.trim()) return elections;
  const q = query.toLowerCase().trim();
  return elections.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.state.toLowerCase().includes(q) ||
    e.stateCode.toLowerCase() === q ||
    e.type.replace(/_/g, ' ').includes(q) ||
    e.region.includes(q) ||
    e.estimatedPeriod.toLowerCase().includes(q) ||
    e.status.includes(q)
  );
}

export function filterByRegion(elections: ElectionEvent[], region: Region | 'all'): ElectionEvent[] {
  if (region === 'all') return elections;
  return elections.filter(e => e.region === region);
}

export function filterByStatus(elections: ElectionEvent[], status: ElectionStatus | 'all'): ElectionEvent[] {
  if (status === 'all') return elections;
  return elections.filter(e => e.status === status);
}

export function filterByType(elections: ElectionEvent[], type: ElectionType | 'all'): ElectionEvent[] {
  if (type === 'all') return elections;
  return elections.filter(e => e.type === type);
}

export function getNextElection(elections: ElectionEvent[]): ElectionEvent | undefined {
  return elections.find(e => e.status === 'announced' || e.status === 'upcoming') || elections.find(e => e.status === 'expected');
}

export const regionLabels: Record<Region | 'all', string> = {
  all: 'All Regions',
  north: 'North India',
  south: 'South India',
  east: 'East India',
  west: 'West India',
  northeast: 'Northeast India',
  central: 'Central India',
};

export const statusLabels: Record<ElectionStatus | 'all', string> = {
  all: 'All Status',
  ongoing: 'Ongoing Now',
  announced: 'Dates Announced',
  upcoming: 'Coming Soon',
  expected: 'Expected',
  completed: 'Completed',
};

export const statusColors: Record<ElectionStatus, string> = {
  ongoing: 'bg-red-500 text-white',
  announced: 'bg-amber-500 text-white',
  upcoming: 'bg-blue-500 text-white',
  expected: 'bg-gray-500 text-white',
  completed: 'bg-green-600 text-white',
};
