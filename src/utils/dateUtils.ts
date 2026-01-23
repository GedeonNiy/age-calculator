/**
 * Date utility functions for age and date difference calculations
 */

export interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export interface DateDifferenceResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

/**
 * Calculates age from date of birth to current date
 */
export function calculateAge(dob: Date): AgeResult {
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calculates the difference between two dates
 */
export function calculateDateDifference(start: Date, end: Date): DateDifferenceResult {
  // Calculate total days difference
  const timeDiff = end.getTime() - start.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // Calculate years, months, and remaining days
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let remainingDays = end.getDate() - start.getDate();

  // Adjust for negative days
  if (remainingDays < 0) {
    months--;
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    remainingDays += lastMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  const weeks = Math.floor(days / 7);

  return { days, weeks, months, years };
}

/**
 * Formats age result for display
 */
export function formatAgeResult(result: AgeResult): string {
  const parts: string[] = [];
  if (result.years > 0) {
    parts.push(`${result.years} ${result.years === 1 ? 'year' : 'years'}`);
  }
  if (result.months > 0) {
    parts.push(`${result.months} ${result.months === 1 ? 'month' : 'months'}`);
  }
  if (result.days > 0 || parts.length === 0) {
    parts.push(`${result.days} ${result.days === 1 ? 'day' : 'days'}`);
  }
  return parts.join(', ');
}

/**
 * Formats date difference result for display
 */
export function formatDateDifferenceResult(result: DateDifferenceResult): string {
  const parts: string[] = [];
  if (result.years > 0) {
    parts.push(`${result.years} ${result.years === 1 ? 'year' : 'years'}`);
  }
  if (result.months > 0) {
    parts.push(`${result.months} ${result.months === 1 ? 'month' : 'months'}`);
  }
  if (result.weeks > 0) {
    parts.push(`${result.weeks} ${result.weeks === 1 ? 'week' : 'weeks'}`);
  }
  if (result.days > 0 || parts.length === 0) {
    parts.push(`${result.days} ${result.days === 1 ? 'day' : 'days'}`);
  }
  return parts.join(', ');
}






