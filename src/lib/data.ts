/**
 * @file data.ts
 * @description Mock data and utility functions for candidate information and regional data.
 */

/**
 * List of basic candidate details for quick lookup and symbols.
 */
export const candidates = [
  { id: 1, name: 'Priya Sharma', party: 'Progressive Alliance', symbol: 'Sun', color: '#F59E0B' },
  { id: 2, name: 'Rajesh Kumar', party: 'National Democratic Front', symbol: 'Flower2', color: '#EC4899' },
  { id: 3, name: 'Ananya Patel', party: "People's United Party", symbol: 'Wheat', color: '#10B981' },
  { id: 4, name: 'Mohammed Irfan', party: 'Social Justice League', symbol: 'Scale', color: '#6366F1' },
  { id: 5, name: 'Lakshmi Devi', party: 'Green Earth Movement', symbol: 'Leaf', color: '#22C55E' },
  { id: 6, name: 'Vikram Singh', party: 'Independent', symbol: 'Star', color: '#8B5CF6' },
  { id: 7, name: 'NOTA', party: 'None of the Above', symbol: 'X', color: '#6B7280' },
];

/**
 * Detailed candidate profiles for the Simulator and Candidate Info modules.
 */
export const mockCandidateProfiles = [
  {
    id: 1, name: 'Arjun Mehta', party: 'Progressive Alliance', constituency: 'Mumbai South',
    age: 52, education: 'MBA - IIM Ahmedabad', profession: 'Industrialist',
    assets: { movable: 4500000000, immovable: 8200000000, total: 12700000000 },
    liabilities: 2100000000, criminalCases: 0, criminalDetails: [],
    photo: null,
  },
  {
    id: 2, name: 'Sneha Reddy', party: 'National Democratic Front', constituency: 'Mumbai South',
    age: 41, education: 'LLB - National Law School', profession: 'Advocate',
    assets: { movable: 120000000, immovable: 350000000, total: 470000000 },
    liabilities: 50000000, criminalCases: 0, criminalDetails: [],
    photo: null,
  },
  {
    id: 3, name: 'Ramesh Yadav', party: 'People\'s United Party', constituency: 'Mumbai South',
    age: 58, education: 'Class XII', profession: 'Farmer / Politician',
    assets: { movable: 980000000, immovable: 2400000000, total: 3380000000 },
    liabilities: 800000000, criminalCases: 3, criminalDetails: ['IPC 420 - Cheating', 'IPC 406 - Criminal Breach of Trust', 'IPC 384 - Extortion'],
    photo: null,
  },
  {
    id: 4, name: 'Fatima Khan', party: 'Social Justice League', constituency: 'Mumbai South',
    age: 35, education: 'PhD - Political Science, JNU', profession: 'Academic / Social Worker',
    assets: { movable: 8000000, immovable: 22000000, total: 30000000 },
    liabilities: 5000000, criminalCases: 0, criminalDetails: [],
    photo: null,
  },
  {
    id: 5, name: 'Karthik Iyer', party: 'Green Earth Movement', constituency: 'Mumbai South',
    age: 44, education: 'B.Tech - IIT Madras', profession: 'Tech Entrepreneur',
    assets: { movable: 650000000, immovable: 1200000000, total: 1850000000 },
    liabilities: 300000000, criminalCases: 1, criminalDetails: ['IPC 500 - Defamation'],
    photo: null,
  },
  {
    id: 6, name: 'Sunita Kumari', party: 'Independent', constituency: 'Mumbai South',
    age: 48, education: 'MA - Sociology', profession: 'NGO Worker',
    assets: { movable: 3500000, immovable: 12000000, total: 15500000 },
    liabilities: 2000000, criminalCases: 0, criminalDetails: [],
    photo: null,
  },
];

/**
 * List of Indian states and Union Territories.
 */
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

/**
 * Formats a numerical amount into the Indian Rupee (INR) system (Cr/L).
 * @param amount The numerical value to format.
 * @returns A formatted string (e.g., ₹1.2 Cr).
 */
export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
