'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Defines the user's role and journey type.
 */
export type Persona = 'new-voter' | 'existing-voter' | 'civic-action' | null;

/**
 * Supported application languages.
 */
export type Language = 'en' | 'hi' | 'ta' | 'bn' | 'mr';

/**
 * Verifiable trust levels for AI and information sources.
 */
export type TrustLevel = 'OFFICIAL' | 'VERIFIED' | 'EXPLANATORY' | 'MOCK_DATA' | 'UNCERTAIN' | 'ECI_SOURCE';

/**
 * A single step in the voter roadmap journey.
 */
export interface QuestStep {
  /** Unique identifier for the step */
  id: string;
  /** Title displayed in the UI */
  title: string;
  /** Description of what the step entails */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** Completion status */
  completed: boolean;
  /** Whether this is the current active step */
  active: boolean;
  /** Required documents or information for this step */
  whatYouNeed?: string[];
  /** Common errors voters make at this stage */
  commonMistake?: string;
  /** Official resources for this stage */
  links?: { text: string; url: string }[];
  /** Sub-tasks for the user to complete */
  checklist?: string[];
}

/**
 * Gamification element awarded for completing milestones.
 */
export interface Badge {
  /** Unique badge identifier */
  id: string;
  /** Name of the achievement */
  title: string;
  /** Short summary of how it was earned */
  description: string;
  /** Icon name */
  icon: string;
  /** Hex color for the badge theme */
  color: string;
  /** Experience points rewarded upon earning */
  xpReward: number;
  /** Whether the user has earned this badge */
  earned: boolean;
  /** Timestamp of when it was earned */
  earnedAt?: string;
}

/**
 * Record of a simulated vote cast in the EVM simulator.
 */
export interface VoteRecord {
  candidateId: number;
  candidateName: string;
  party: string;
  timestamp: string;
}

/**
 * User-submitted report for election violations or issues.
 */
export interface Report {
  id: string;
  type: string;
  description: string;
  status: 'submitted' | 'under-review' | 'assigned' | 'resolved';
  timestamp: string;
  location: string;
}

/**
 * Personalized election event reminders.
 */
export interface Reminder {
  id: string;
  title: string;
  date: string;
  notified: boolean;
}

/**
 * Data captured during the initial onboarding flow.
 */
export interface OnboardingAnswers {
  isRegistered?: string;
  age?: string;
  lastVoted?: string;
  knowsBooth?: string;
  primaryInterest?: string;
}

/**
 * The root application state schema.
 */
interface AppState {
  /** Current user persona determined by onboarding */
  persona: Persona;
  /** User's preferred language */
  language: Language;
  /** UI theme preference */
  darkMode: boolean;
  /** Whether onboarding has been fully completed */
  onboardingCompleted: boolean;
  /** Current step in the onboarding flow */
  onboardingStep: number;
  /** Raw answers from onboarding */
  onboardingAnswers: OnboardingAnswers;

  // Journey
  /** Current roadmap steps based on persona */
  questSteps: QuestStep[];
  /** All available and earned badges */
  badges: Badge[];
  /** Total user experience points */
  xp: number;
  /** User's civic engagement level title */
  level: string;

  // Features
  /** History of simulated votes */
  voteHistory: VoteRecord[];
  /** User submitted violation reports */
  reports: Report[];
  /** Scheduled reminders */
  reminders: Reminder[];
  /** Local chat history with AI assistant */
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string; trustLevel?: TrustLevel }>;

  // Eligibility
  /** Stored eligibility check parameters and results */
  eligibility: {
    dob: string;
    isCitizen: boolean;
    residency: string;
    checked: boolean;
    eligible: boolean | null;
  };

  /** Authenticated user details from Firebase */
  user: {
    uid: string | null;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;

  /** The most recently earned badge, for display in popups */
  pendingBadge: Badge | null;

  // Actions
  /** Updates the authenticated user state */
  setUser: (user: AppState['user']) => void;
  /** Sets the user's primary journey path */
  setPersona: (p: Persona) => void;
  /** Updates global language setting */
  setLanguage: (l: Language) => void;
  /** Toggles dark/light mode */
  toggleDarkMode: () => void;
  /** Finalizes the onboarding status */
  setOnboardingCompleted: (v: boolean) => void;
  /** Navigates through onboarding screens */
  setOnboardingStep: (s: number) => void;
  /** Persists onboarding responses */
  setOnboardingAnswers: (a: Partial<OnboardingAnswers>) => void;
  /** Initializes the roadmap steps */
  setQuestSteps: (steps: QuestStep[]) => void;
  /** Marks a journey step as completed and activates the next */
  completeStep: (id: string) => void;
  /** Awards a badge if requirements are met */
  earnBadge: (id: string) => void;
  /** Clears the current badge popup */
  dismissBadge: () => void;
  /** Grants XP to the user */
  addXP: (amount: number) => void;
  /** Records a simulated vote */
  addVote: (v: VoteRecord) => void;
  /** Submits a new violation report */
  addReport: (r: Report) => void;
  /** Updates status of an existing report */
  updateReportStatus: (id: string, status: Report['status']) => void;
  /** Schedules a new reminder */
  addReminder: (r: Reminder) => void;
  /** Deletes a reminder */
  removeReminder: (id: string) => void;
  /** Appends a message to the AI chat history */
  addChatMessage: (msg: { role: 'user' | 'assistant'; content: string; trustLevel?: TrustLevel }) => void;
  /** Clears the entire chat history */
  clearChat: () => void;
  /** Stores the results of an eligibility check */
  setEligibility: (e: Partial<AppState['eligibility']>) => void;
  /** Resets the entire application state (for testing or restart) */
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
      user: null,

      setUser: (user) => set({ user }),
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
        pendingBadge: null, user: null,
      }),
    }),
    { name: 'voterpulse-storage' }
  )
);
