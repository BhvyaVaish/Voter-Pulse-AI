'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Persona = 'new-voter' | 'existing-voter' | 'civic-action' | null;
export type Language = 'en' | 'hi' | 'ta' | 'bn' | 'mr';
export type TrustLevel = 'OFFICIAL' | 'VERIFIED' | 'EXPLANATORY' | 'MOCK_DATA' | 'UNCERTAIN' | 'ECI_SOURCE';

export interface QuestStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
  whatYouNeed?: string[];
  commonMistake?: string;
  links?: { text: string; url: string }[];
  checklist?: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  xpReward: number;
  earned: boolean;
  earnedAt?: string;
}

export interface VoteRecord {
  candidateId: number;
  candidateName: string;
  party: string;
  timestamp: string;
}

export interface Report {
  id: string;
  type: string;
  description: string;
  status: 'submitted' | 'under-review' | 'assigned' | 'resolved';
  timestamp: string;
  location: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  notified: boolean;
}

export interface OnboardingAnswers {
  isRegistered?: string;
  age?: string;
  lastVoted?: string;
  knowsBooth?: string;
  primaryInterest?: string;
}

interface AppState {
  // Core
  persona: Persona;
  language: Language;
  darkMode: boolean;
  onboardingCompleted: boolean;
  onboardingStep: number;
  onboardingAnswers: OnboardingAnswers;

  // Journey
  questSteps: QuestStep[];
  badges: Badge[];
  xp: number;
  level: string;

  // Features
  voteHistory: VoteRecord[];
  reports: Report[];
  reminders: Reminder[];
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string; trustLevel?: TrustLevel }>;

  // Eligibility
  eligibility: {
    dob: string;
    isCitizen: boolean;
    residency: string;
    checked: boolean;
    eligible: boolean | null;
  };

  // Badge popup
  pendingBadge: Badge | null;

  // Actions
  setPersona: (p: Persona) => void;
  setLanguage: (l: Language) => void;
  toggleDarkMode: () => void;
  setOnboardingCompleted: (v: boolean) => void;
  setOnboardingStep: (s: number) => void;
  setOnboardingAnswers: (a: Partial<OnboardingAnswers>) => void;
  setQuestSteps: (steps: QuestStep[]) => void;
  completeStep: (id: string) => void;
  earnBadge: (id: string) => void;
  dismissBadge: () => void;
  addXP: (amount: number) => void;
  addVote: (v: VoteRecord) => void;
  addReport: (r: Report) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;
  addReminder: (r: Reminder) => void;
  removeReminder: (id: string) => void;
  addChatMessage: (msg: { role: 'user' | 'assistant'; content: string; trustLevel?: TrustLevel }) => void;
  clearChat: () => void;
  setEligibility: (e: Partial<AppState['eligibility']>) => void;
  resetAll: () => void;
}

export const defaultBadges: Badge[] = [
  { id: 'civic-starter', title: 'Civic Starter', description: 'Completed onboarding', icon: 'star', color: '#F59E0B', xpReward: 25, earned: false },
  { id: 'eligible-citizen', title: 'Eligible Citizen', description: 'Passed eligibility check', icon: 'shield-check', color: '#10B981', xpReward: 50, earned: false },
  { id: 'registered-voter', title: 'Registered Voter', description: 'Completed registration stage', icon: 'clipboard-check', color: '#3B82F6', xpReward: 75, earned: false },
  { id: 'informed-citizen', title: 'Informed Citizen', description: 'Viewed all candidate profiles', icon: 'book-open', color: '#8B5CF6', xpReward: 50, earned: false },
  { id: 'mock-voter', title: 'Mock Voter', description: 'Completed EVM simulator', icon: 'vote', color: '#6366F1', xpReward: 75, earned: false },
  { id: 'civic-guardian', title: 'Civic Guardian', description: 'Filed a complaint report', icon: 'megaphone', color: '#EF4444', xpReward: 50, earned: false },
  { id: 'prepared-voter', title: 'Prepared Voter', description: 'Completed voting day checklist', icon: 'list-checks', color: '#14B8A6', xpReward: 50, earned: false },
  { id: 'election-champion', title: 'Election Champion', description: 'All roadmap stages completed', icon: 'trophy', color: '#F59E0B', xpReward: 200, earned: false },
];

function getLevel(xp: number): string {
  if (xp >= 600) return 'Election Champion';
  if (xp >= 301) return 'Informed Voter';
  if (xp >= 101) return 'Active Citizen';
  return 'Civic Beginner';
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      persona: null,
      language: 'en',
      darkMode: false,
      onboardingCompleted: false,
      onboardingStep: 0,
      onboardingAnswers: {},
      questSteps: [],
      badges: defaultBadges,
      xp: 0,
      level: 'Civic Beginner',
      voteHistory: [],
      reports: [],
      reminders: [],
      chatHistory: [],
      eligibility: { dob: '', isCitizen: true, residency: '', checked: false, eligible: null },
      pendingBadge: null,

      setPersona: (p) => set({ persona: p }),
      setLanguage: (l) => set({ language: l }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setOnboardingCompleted: (v) => set({ onboardingCompleted: v }),
      setOnboardingStep: (s) => set({ onboardingStep: s }),
      setOnboardingAnswers: (a) => set((s) => ({ onboardingAnswers: { ...s.onboardingAnswers, ...a } })),
      setQuestSteps: (steps) => set({ questSteps: steps }),
      completeStep: (id) => {
        const state = get();
        const newSteps = state.questSteps.map((st, i, arr) => {
          if (st.id === id) return { ...st, completed: true, active: false };
          const prev = arr.findIndex((s) => s.id === id);
          if (i === prev + 1 && !st.completed) return { ...st, active: true };
          return st;
        });
        const allDone = newSteps.every((s) => s.completed);
        set({ questSteps: newSteps });
        if (allDone) get().earnBadge('election-champion');
      },
      earnBadge: (id) => {
        const state = get();
        const badge = state.badges.find((b) => b.id === id);
        if (!badge || badge.earned) return;
        const updated = state.badges.map((b) =>
          b.id === id ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
        );
        const newXp = state.xp + badge.xpReward;
        set({ badges: updated, xp: newXp, level: getLevel(newXp), pendingBadge: { ...badge, earned: true } });
      },
      dismissBadge: () => set({ pendingBadge: null }),
      addXP: (amount) => set((s) => {
        const newXp = s.xp + amount;
        return { xp: newXp, level: getLevel(newXp) };
      }),
      addVote: (v) => set((s) => ({ voteHistory: [...s.voteHistory, v] })),
      addReport: (r) => set((s) => ({ reports: [...s.reports, r] })),
      updateReportStatus: (id, status) => set((s) => ({
        reports: s.reports.map((r) => r.id === id ? { ...r, status } : r),
      })),
      addReminder: (r) => set((s) => ({ reminders: [...s.reminders, r] })),
      removeReminder: (id) => set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),
      addChatMessage: (msg) => set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
      clearChat: () => set({ chatHistory: [] }),
      setEligibility: (e) => set((s) => ({ eligibility: { ...s.eligibility, ...e } })),
      resetAll: () => set({
        persona: null, questSteps: [], badges: defaultBadges, voteHistory: [],
        reports: [], reminders: [], chatHistory: [], xp: 0, level: 'Civic Beginner',
        onboardingCompleted: false, onboardingStep: 0, onboardingAnswers: {},
        eligibility: { dob: '', isCitizen: true, residency: '', checked: false, eligible: null },
        pendingBadge: null,
      }),
    }),
    { name: 'voterpulse-storage' }
  )
);
