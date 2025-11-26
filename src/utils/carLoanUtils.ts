/**
 * Car Loan calculation utility functions
 */

export interface CarLoanInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  termYears: number;
  annualInterestRatePercent: number;
  extraMonthlyPayment: number;
  startDate: Date;
}

export interface CarLoanAmortizationRow {
  monthIndex: number;
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface CarLoanResults {
  loanAmount: number;
  baseMonthlyPayment: number;
  actualMonthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  payoffDate: Date;
  amortizationSchedule: CarLoanAmortizationRow[];
}

/**
 * Calculate car loan details
 */
export function calculateCarLoan(inputs: CarLoanInputs): CarLoanResults {
  const {
    vehiclePrice,
    downPayment,
    tradeInValue,
    salesTaxPercent,
    termYears,
    annualInterestRatePercent,
    extraMonthlyPayment,
    startDate,
  } = inputs;

  // Calculate taxable amount (price minus trade-in and down payment)
  const taxableAmount = Math.max(vehiclePrice - tradeInValue - downPayment, 0);

  // Calculate tax amount
  const taxAmount = taxableAmount * (salesTaxPercent / 100);

  // Calculate loan amount
  const loanAmount = vehiclePrice + taxAmount - downPayment - tradeInValue;

  // Monthly interest rate
  const monthlyRate = (annualInterestRatePercent / 100) / 12;

  // Total number of months
  const totalMonths = termYears * 12;

  // Calculate base monthly payment
  let baseMonthlyPayment: number;
  if (monthlyRate > 0) {
    // Standard annuity formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
    const denominator = Math.pow(1 + monthlyRate, totalMonths) - 1;
    baseMonthlyPayment = numerator / denominator;
  } else {
    // 0% interest case
    baseMonthlyPayment = loanAmount / totalMonths;
  }

  // Actual monthly payment including extra payments
  const actualMonthlyPayment = baseMonthlyPayment + extraMonthlyPayment;

  // Build amortization schedule
  const schedule: CarLoanAmortizationRow[] = [];
  let remainingPrincipal = loanAmount;
  const epsilon = 0.01; // Small value to stop calculation

  for (let month = 1; month <= totalMonths && remainingPrincipal > epsilon; month++) {
    // Calculate interest for this month
    const interestForMonth = remainingPrincipal * monthlyRate;

    // Calculate principal payment
    let principalForMonth = actualMonthlyPayment - interestForMonth;

    // Ensure we don't pay more than remaining principal
    if (principalForMonth > remainingPrincipal) {
      principalForMonth = remainingPrincipal;
    }

    // Fallback: if principal is too small or negative, pay at least a small amount
    if (principalForMonth <= 0) {
      principalForMonth = Math.min(remainingPrincipal, loanAmount / totalMonths);
    }

    // Update remaining principal
    remainingPrincipal = remainingPrincipal - principalForMonth;

    // Calculate payment date
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + month);

    // Actual payment amount (may be less on final payment)
    const actualPayment = month === totalMonths || remainingPrincipal <= epsilon
      ? principalForMonth + interestForMonth
      : actualMonthlyPayment;

    schedule.push({
      monthIndex: month,
      date: paymentDate,
      payment: actualPayment,
      principal: principalForMonth,
      interest: interestForMonth,
      remainingBalance: Math.max(remainingPrincipal, 0),
    });

    // Stop if paid off
    if (remainingPrincipal <= epsilon) {
      break;
    }
  }

  // Calculate totals
  const totalPayments = schedule.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);

  // Get payoff date (last payment date)
  const payoffDate = schedule.length > 0 ? schedule[schedule.length - 1].date : startDate;

  return {
    loanAmount,
    baseMonthlyPayment,
    actualMonthlyPayment,
    totalPayments,
    totalInterest,
    payoffDate,
    amortizationSchedule: schedule,
  };
}

// Re-export formatting functions from mortgageUtils for consistency
export { formatCurrency, formatNumber } from './mortgageUtils';

/**
 * Format date as "Month Year" (e.g., "June 2029")
 */
export function formatDateMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
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

