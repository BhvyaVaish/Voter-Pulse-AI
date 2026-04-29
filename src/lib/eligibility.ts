import { differenceInYears, differenceInDays, isBefore, isAfter, startOfDay, format, parseISO } from 'date-fns';

const QUALIFYING_DATES = [
  { month: 0, day: 1 },  // Jan 1
  { month: 3, day: 1 },  // Apr 1
  { month: 6, day: 1 },  // Jul 1
  { month: 9, day: 1 },  // Oct 1
];

export interface EligibilityResult {
  eligible: boolean;
  advanceEligible: boolean;
  age: number;
  nextQualifyingDate: Date;
  daysUntilNext: number;
  recommendedForm: 'Form 6' | 'Form 6A' | 'Form 8' | null;
  message: string;
}

export function getNextQualifyingDate(fromDate: Date = new Date()): Date {
  const today = startOfDay(fromDate);
  const year = today.getFullYear();

  for (const qd of QUALIFYING_DATES) {
    const date = new Date(year, qd.month, qd.day);
    if (isAfter(date, today)) return date;
  }
  return new Date(year + 1, 0, 1);
}

export function getPreviousQualifyingDate(fromDate: Date = new Date()): Date {
  const today = startOfDay(fromDate);
  const year = today.getFullYear();

  for (let i = QUALIFYING_DATES.length - 1; i >= 0; i--) {
    const date = new Date(year, QUALIFYING_DATES[i].month, QUALIFYING_DATES[i].day);
    if (isBefore(date, today) || date.getTime() === today.getTime()) return date;
  }
  return new Date(year - 1, 9, 1);
}

export function checkEligibility(
  dob: string,
  isCitizen: boolean,
  isNRI: boolean = false
): EligibilityResult {
  const today = startOfDay(new Date());
  const birthDate = startOfDay(parseISO(dob));
  const nextQD = getNextQualifyingDate(today);
  const prevQD = getPreviousQualifyingDate(today);
  const daysUntilNext = differenceInDays(nextQD, today);
  const ageNow = differenceInYears(today, birthDate);
  const ageAtNext = differenceInYears(nextQD, birthDate);
  const ageAtPrev = differenceInYears(prevQD, birthDate);

  if (!isCitizen) {
    return {
      eligible: false, advanceEligible: false, age: ageNow,
      nextQualifyingDate: nextQD, daysUntilNext,
      recommendedForm: null,
      message: 'Only Indian citizens are eligible to vote.',
    };
  }

  if (ageAtPrev >= 18) {
    return {
      eligible: true, advanceEligible: false, age: ageNow,
      nextQualifyingDate: nextQD, daysUntilNext,
      recommendedForm: isNRI ? 'Form 6A' : 'Form 6',
      message: `You are ${ageNow} years old and eligible to vote! Register using ${isNRI ? 'Form 6A' : 'Form 6'}.`,
    };
  }

  if (ageAtNext >= 18) {
    return {
      eligible: false, advanceEligible: true, age: ageNow,
      nextQualifyingDate: nextQD, daysUntilNext,
      recommendedForm: 'Form 6',
      message: `You will turn 18 before ${format(nextQD, 'dd-MM-yyyy')}. You can submit an advance application using Form 6 now!`,
    };
  }

  return {
    eligible: false, advanceEligible: false, age: ageNow,
    nextQualifyingDate: nextQD, daysUntilNext,
    recommendedForm: null,
    message: `You are ${ageNow} years old. You need to be 18 on a qualifying date (Jan 1, Apr 1, Jul 1, Oct 1) to be eligible.`,
  };
}
