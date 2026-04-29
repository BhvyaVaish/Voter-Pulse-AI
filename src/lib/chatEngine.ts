/**
 * @file chatEngine.ts
 * @description Provides a custom, offline Natural Language Processing (NLP) engine for intent detection.
 * Utilizes Levenshtein distance for fuzzy matching and supports multi-lingual intent mapping.
 */

// Fuzzy NLP Engine for offline multilingual intent detection

/**
 * Unique identifiers for different types of user intents.
 */
export type IntentId =
  | 'ELIGIBILITY_CHECK'
  | 'REGISTRATION_HELP'
  | 'BOOTH_LOOKUP'
  | 'CANDIDATE_INFO'
  | 'COMPLAINT_SUPPORT'
  | 'VOTING_EXPLANATION'
  | 'FACT_CHECK'
  | 'DOCUMENT_HELP'
  | 'CORRECTION_TRANSFER'
  | 'ELECTION_SCHEDULE'
  | 'RESULT_INFO'
  | 'GENERAL_CIVIC'
  | 'GREETING'
  | 'GENERAL';

/**
 * Structure of the result returned by the intent detection engine.
 */
export interface IntentResult {
  /** The unique ID of the detected intent. */
  intent: IntentId;
  /** Numerical value representing detection certainty (0.0 to 1.0). */
  confidence: number;
  /** A human-readable, localized label for the intent. */
  label: string;
}

// Levenshtein distance for typo tolerance
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Check if a word fuzzy-matches a keyword (tolerates typos)
function fuzzyMatch(word: string, keyword: string): boolean {
  if (word === keyword) return true;
  if (keyword.length <= 3) return word === keyword;
  let maxDist = 1;
  if (keyword.length > 5) maxDist = 2;
  if (keyword.length > 8) maxDist = 3; // Allow more typos for long words
  return levenshtein(word, keyword) <= maxDist;
}

// Check if input contains a phrase (multi-word keyword)
function phraseMatch(input: string, phrase: string): boolean {
  return input.includes(phrase);
}

export interface IntentConfig {
  keywords: string[];
  phrases: string[];
  label: string;
  labelLocalized: Record<string, string>;
}

export type IntentDictionary = Record<IntentId, IntentConfig>;

// Score an input against an intent config
function scoreIntent(input: string, config: IntentConfig): number {
  const lower = input.toLowerCase().trim();
  const words = lower.split(/\s+/);
  let score = 0;

  // Phrase matching (highest value - worth 3 points each)
  for (const phrase of config.phrases) {
    if (phraseMatch(lower, phrase.toLowerCase())) {
      score += 3;
    }
  }

  // Exact keyword matching (2 points)
  for (const kw of config.keywords) {
    const kwLower = kw.toLowerCase();
    if (lower.includes(kwLower)) {
      score += 2;
    }
  }

  // Fuzzy word matching (1 point)
  for (const word of words) {
    if (word.length < 3) continue;
    for (const kw of config.keywords) {
      if (kw.includes(' ')) continue; // skip phrases in keywords
      if (fuzzyMatch(word, kw.toLowerCase())) {
        score += 1;
      }
    }
  }

  return score;
}

/**
 * Main detection function for identifying user intent from natural language input.
 * Uses a combination of phrase matching, exact keyword matching, and fuzzy word matching.
 * 
 * @param input - The raw text input from the user.
 * @param dictionary - The IntentDictionary containing keywords and phrases for each intent.
 * @param language - The current user language (e.g., 'en', 'hi', 'ta', 'bn', 'mr').
 * @returns An IntentResult containing the detected intent, confidence score (0-1.0), and localized label.
 */
export function detectIntentAdvanced(
  input: string,
  dictionary: IntentDictionary,
  language: string
): IntentResult {
  if (!input.trim()) {
    return { intent: 'GENERAL', confidence: 0, label: '' };
  }

  let bestIntent: IntentId = 'GENERAL';
  let bestScore = 0;

  for (const [intentId, config] of Object.entries(dictionary) as [IntentId, IntentConfig][]) {
    const score = scoreIntent(input, config);
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intentId;
    }
  }

  // Normalize confidence (cap at 1.0)
  const confidence = Math.min(bestScore / 6, 1.0);

  // Get localized label
  const config = dictionary[bestIntent];
  const label = config?.labelLocalized?.[language] || config?.label || '';

  return { intent: bestIntent, confidence, label };
}
