/**
 * Mortgage calculation utility functions
 */

export interface MortgageInputs {
  homePrice: number;
  downPaymentType: 'amount' | 'percentage';
  downPaymentAmount: number;
  downPaymentPercentage: number;
  loanTermYears: number;
  annualInterestRate: number;
  propertyTaxType: 'percent' | 'amount';
  propertyTaxPercent: number;
  propertyTaxAmount: number;
  annualInsurance: number;
  pmiPercent: number;
  includePMI: boolean;
  monthlyHOA: number;
  extraPrincipalPayment: number;
}

export interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface YearlySummary {
  year: number;
  totalPrincipal: number;
  totalInterest: number;
  endingBalance: number;
}

export interface MortgageResults {
  loanAmount: number;
  monthlyPI: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  totalCost: number;
  amortizationSchedule: AmortizationRow[];
  yearlySummary: YearlySummary[];
  // With extra payments
  extraMonthlyPayment: number;
  extraTotalInterestPaid: number;
  extraTotalCost: number;
  monthsToPayoffWithExtra: number;
  interestSaved: number;
  monthsSaved: number;
  extraAmortizationSchedule: AmortizationRow[];
  extraYearlySummary: YearlySummary[];
}

/**
 * Calculate loan amount
 */
export function calculateLoanAmount(homePrice: number, downPayment: number): number {
  return Math.max(0, homePrice - downPayment);
}

/**
 * Calculate down payment based on type
 */
export function calculateDownPayment(
  homePrice: number,
  downPaymentType: 'amount' | 'percentage',
  downPaymentAmount: number,
  downPaymentPercentage: number
): number {
  if (downPaymentType === 'amount') {
    return Math.min(downPaymentAmount, homePrice);
  } else {
    return (homePrice * downPaymentPercentage) / 100;
  }
}

/**
 * Calculate monthly principal and interest payment using standard annuity formula
 * Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
 * Where:
 *   P = loan amount
 *   r = monthly interest rate
 *   n = total number of months
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermMonths: number
): number {
  if (loanAmount <= 0) return 0;
  if (loanTermMonths <= 0) return 0;
  
  const monthlyRate = (annualInterestRate / 100) / 12;
  
  // Handle 0% interest rate
  if (monthlyRate === 0) {
    return loanAmount / loanTermMonths;
  }
  
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths);
  const denominator = Math.pow(1 + monthlyRate, loanTermMonths) - 1;
  
  return numerator / denominator;
}

/**
 * Build amortization schedule without extra payments
 */
export function buildAmortizationSchedule(
  loanAmount: number,
  monthlyPI: number,
  annualInterestRate: number,
  loanTermMonths: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const monthlyRate = (annualInterestRate / 100) / 12;
  let balance = loanAmount;
  let currentYear = 1;
  let monthsInYear = 0;
  
  for (let month = 1; month <= loanTermMonths && balance > 0.01; month++) {
    monthsInYear++;
    if (monthsInYear > 12) {
      currentYear++;
      monthsInYear = 1;
    }
    
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPI - interest, balance);
    balance = Math.max(0, balance - principal);
    
    schedule.push({
      month,
      year: currentYear,
      payment: monthlyPI,
      principal,
      interest,
      remainingBalance: balance,
    });
  }
  
  return schedule;
}

/**
 * Build amortization schedule with extra principal payments
 */
export function buildExtraPaymentAmortizationSchedule(
  loanAmount: number,
  monthlyPI: number,
  extraPrincipal: number,
  annualInterestRate: number,
  maxMonths: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const monthlyRate = (annualInterestRate / 100) / 12;
  let balance = loanAmount;
  let currentYear = 1;
  let monthsInYear = 0;
  const totalPayment = monthlyPI + extraPrincipal;
  
  for (let month = 1; month <= maxMonths && balance > 0.01; month++) {
    monthsInYear++;
    if (monthsInYear > 12) {
      currentYear++;
      monthsInYear = 1;
    }
    
    const interest = balance * monthlyRate;
    const principal = Math.min(totalPayment - interest, balance);
    balance = Math.max(0, balance - principal);
    
    schedule.push({
      month,
      year: currentYear,
      payment: totalPayment,
      principal,
      interest,
      remainingBalance: balance,
    });
    
    // Stop if balance is paid off
    if (balance <= 0.01) break;
  }
  
  return schedule;
}

/**
 * Calculate yearly summary from amortization schedule
 */
export function calculateYearlySummary(schedule: AmortizationRow[]): YearlySummary[] {
  const summary: YearlySummary[] = [];
  const byYear = new Map<number, AmortizationRow[]>();
  
  // Group by year
  schedule.forEach(row => {
    if (!byYear.has(row.year)) {
      byYear.set(row.year, []);
    }
    byYear.get(row.year)!.push(row);
  });
  
  // Calculate totals per year
  byYear.forEach((rows, year) => {
    const totalPrincipal = rows.reduce((sum, row) => sum + row.principal, 0);
    const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
    const endingBalance = rows[rows.length - 1].remainingBalance;
    
    summary.push({
      year,
      totalPrincipal,
      totalInterest,
      endingBalance,
    });
  });
  
  return summary;
}

/**
 * Calculate total interest paid from amortization schedule
 */
export function calculateTotalInterest(schedule: AmortizationRow[]): number {
  return schedule.reduce((sum, row) => sum + row.interest, 0);
}

/**
 * Calculate all mortgage results
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  // Calculate down payment
  const downPayment = calculateDownPayment(
    inputs.homePrice,
    inputs.downPaymentType,
    inputs.downPaymentAmount,
    inputs.downPaymentPercentage
  );
  
  // Calculate loan amount
  const loanAmount = calculateLoanAmount(inputs.homePrice, downPayment);
  const loanTermMonths = inputs.loanTermYears * 12;
  
  // Calculate monthly P&I
  const monthlyPI = calculateMonthlyPayment(
    loanAmount,
    inputs.annualInterestRate,
    loanTermMonths
  );
  
  // Calculate monthly property tax
  let monthlyPropertyTax = 0;
  if (inputs.propertyTaxType === 'percent') {
    const annualTax = (inputs.homePrice * inputs.propertyTaxPercent) / 100;
    monthlyPropertyTax = annualTax / 12;
  } else {
    monthlyPropertyTax = inputs.propertyTaxAmount / 12;
  }
  
  // Calculate monthly insurance
  const monthlyInsurance = inputs.annualInsurance / 12;
  
  // Calculate monthly PMI (only if down payment < 20% and PMI is included)
  let monthlyPMI = 0;
  const downPaymentPercent = (downPayment / inputs.homePrice) * 100;
  if (inputs.includePMI && downPaymentPercent < 20) {
    monthlyPMI = ((inputs.pmiPercent / 100) * loanAmount) / 12;
  }
  
  // Monthly HOA
  const monthlyHOA = inputs.monthlyHOA || 0;
  
  // Total monthly payment
  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
  
  // Build base amortization schedule
  const amortizationSchedule = buildAmortizationSchedule(
    loanAmount,
    monthlyPI,
    inputs.annualInterestRate,
    loanTermMonths
  );
  
  // Calculate totals from base schedule
  const totalInterestPaid = calculateTotalInterest(amortizationSchedule);
  const totalCost = loanAmount + totalInterestPaid;
  const yearlySummary = calculateYearlySummary(amortizationSchedule);
  
  // Calculate with extra payments
  const extraMonthlyPayment = monthlyPI + (inputs.extraPrincipalPayment || 0);
  const extraAmortizationSchedule = buildExtraPaymentAmortizationSchedule(
    loanAmount,
    monthlyPI,
    inputs.extraPrincipalPayment || 0,
    inputs.annualInterestRate,
    loanTermMonths
  );
  
  const extraTotalInterestPaid = calculateTotalInterest(extraAmortizationSchedule);
  const extraTotalCost = loanAmount + extraTotalInterestPaid;
  const monthsToPayoffWithExtra = extraAmortizationSchedule.length;
  const interestSaved = totalInterestPaid - extraTotalInterestPaid;
  const monthsSaved = loanTermMonths - monthsToPayoffWithExtra;
  const extraYearlySummary = calculateYearlySummary(extraAmortizationSchedule);
  
  return {
    loanAmount,
    monthlyPI,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    totalMonthlyPayment,
    totalInterestPaid,
    totalCost,
    amortizationSchedule,
    yearlySummary,
    extraMonthlyPayment,
    extraTotalInterestPaid,
    extraTotalCost,
    monthsToPayoffWithExtra,
    interestSaved,
    monthsSaved,
    extraAmortizationSchedule,
    extraYearlySummary,
  };
}

/**
 * Format currency using Intl.NumberFormat
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}





