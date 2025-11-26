/**
 * Pregnancy Due Date calculation utility functions
 */

export interface PregnancyInputs {
  lastMenstrualPeriod: Date;
  cycleLength: number;
}

export interface PregnancyResult {
  dueDate: Date;
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  secondTrimesterStart: Date;
  thirdTrimesterStart: Date;
  isPregnancyStarted: boolean;
}

/**
 * Calculate pregnancy due date and related information
 */
export function calculatePregnancyDueDate(inputs: PregnancyInputs): PregnancyResult {
  const { lastMenstrualPeriod, cycleLength } = inputs;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Base calculation: LMP + 280 days (40 weeks)
  const baseDueDate = new Date(lastMenstrualPeriod);
  baseDueDate.setDate(baseDueDate.getDate() + 280);

  // Adjust for cycle length (if cycle is not 28 days)
  const cycleAdjustment = cycleLength - 28;
  const dueDate = new Date(baseDueDate);
  dueDate.setDate(dueDate.getDate() + cycleAdjustment);

  // Calculate gestational age
  const daysSinceLMP = Math.floor((today.getTime() - lastMenstrualPeriod.getTime()) / (1000 * 60 * 60 * 24));
  const isPregnancyStarted = daysSinceLMP >= 0;
  
  let gestationalAgeWeeks = 0;
  let gestationalAgeDays = 0;

  if (isPregnancyStarted) {
    gestationalAgeWeeks = Math.floor(daysSinceLMP / 7);
    gestationalAgeDays = daysSinceLMP % 7;
    // Ensure days don't exceed 6 (0-6 days in a week)
    if (gestationalAgeDays >= 7) {
      gestationalAgeWeeks += Math.floor(gestationalAgeDays / 7);
      gestationalAgeDays = gestationalAgeDays % 7;
    }
  }

  // Calculate trimester start dates (from LMP)
  const secondTrimesterStart = new Date(lastMenstrualPeriod);
  secondTrimesterStart.setDate(secondTrimesterStart.getDate() + (13 * 7) - 1); // Week 13 (0-indexed, so 12 weeks + 6 days)

  const thirdTrimesterStart = new Date(lastMenstrualPeriod);
  thirdTrimesterStart.setDate(thirdTrimesterStart.getDate() + (28 * 7) - 1); // Week 28 (0-indexed, so 27 weeks + 6 days)

  return {
    dueDate,
    gestationalAgeWeeks,
    gestationalAgeDays,
    secondTrimesterStart,
    thirdTrimesterStart,
    isPregnancyStarted,
  };
}

/**
 * Format date as "Month Day, Year" (e.g., "June 10, 2026")
 */
export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format date as "MM/DD/YYYY"
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Get current trimester based on gestational age
 */
export function getCurrentTrimester(gestationalAgeWeeks: number): string {
  if (gestationalAgeWeeks < 13) {
    return 'First Trimester';
  } else if (gestationalAgeWeeks < 28) {
    return 'Second Trimester';
  } else {
    return 'Third Trimester';
  }
}

