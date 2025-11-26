/**
 * Compound Interest calculation utility functions
 */

export interface CompoundInterestInputs {
  principal: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  compoundingFrequency: 'yearly' | 'quarterly' | 'monthly' | 'daily';
}

export interface YearlyBreakdown {
  year: number;
  startingBalance: number;
  contributions: number;
  interest: number;
  endingBalance: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * Calculate compound interest with contributions
 */
export function calculateCompoundInterest(inputs: CompoundInterestInputs): CompoundInterestResult {
  const {
    principal,
    monthlyContribution,
    annualInterestRate,
    years,
    compoundingFrequency,
  } = inputs;

  // Determine periods per year and contribution frequency
  let periodsPerYear: number;
  let contributionPeriods: number; // How many periods between contributions

  switch (compoundingFrequency) {
    case 'yearly':
      periodsPerYear = 1;
      contributionPeriods = 12; // Monthly contributions, yearly compounding
      break;
    case 'quarterly':
      periodsPerYear = 4;
      contributionPeriods = 3; // Monthly contributions, quarterly compounding
      break;
    case 'monthly':
      periodsPerYear = 12;
      contributionPeriods = 1; // Monthly contributions, monthly compounding
      break;
    case 'daily':
      periodsPerYear = 365;
      contributionPeriods = 30; // Approximate: monthly contributions, daily compounding
      break;
  }

  const periodicRate = annualInterestRate / 100 / periodsPerYear;
  const totalPeriods = years * periodsPerYear;
  const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear);

  let balance = principal;
  let totalContributions = principal;
  let totalInterest = 0;

  const yearlyBreakdown: YearlyBreakdown[] = [];
  let yearStartingBalance = principal;
  let yearContributions = 0;
  let yearInterest = 0;

  for (let period = 1; period <= totalPeriods; period++) {
    const isYearEnd = period % periodsPerYear === 0;

    // Add contribution at the start of each contribution period
    if ((period - 1) % contributionPeriods === 0) {
      balance += contributionPerPeriod;
      totalContributions += contributionPerPeriod;
      yearContributions += contributionPerPeriod;
    }

    // Calculate interest
    const interest = balance * periodicRate;
    balance += interest;
    totalInterest += interest;
    yearInterest += interest;

    // Record yearly breakdown
    if (isYearEnd || period === totalPeriods) {
      const year = Math.ceil(period / periodsPerYear);
      yearlyBreakdown.push({
        year,
        startingBalance: yearStartingBalance,
        contributions: yearContributions,
        interest: yearInterest,
        endingBalance: balance,
      });

      // Reset for next year
      if (period < totalPeriods) {
        yearStartingBalance = balance;
        yearContributions = 0;
        yearInterest = 0;
      }
    }
  }

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  };
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

