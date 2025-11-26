/**
 * Income Tax calculation utility functions
 */

export interface TaxBracket {
  min: number;
  max: number | null; // null means no upper limit
  rate: number;
}

export interface TaxBracketResult {
  bracket: TaxBracket;
  incomeInBracket: number;
  taxInBracket: number;
}

export interface IncomeTaxInputs {
  annualIncome: number;
  filingStatus: 'single' | 'married';
}

export interface IncomeTaxResult {
  totalTax: number;
  effectiveRate: number;
  bracketBreakdown: TaxBracketResult[];
}

/**
 * Sample tax brackets (for demonstration only, NOT actual tax law)
 * These are simplified brackets for educational purposes
 */
const TAX_BRACKETS_SINGLE: TaxBracket[] = [
  { min: 0, max: 10000, rate: 10 },
  { min: 10001, max: 40000, rate: 12 },
  { min: 40001, max: 85000, rate: 22 },
  { min: 85001, max: 160000, rate: 24 },
  { min: 160001, max: null, rate: 32 },
];

const TAX_BRACKETS_MARRIED: TaxBracket[] = [
  { min: 0, max: 20000, rate: 10 },
  { min: 20001, max: 80000, rate: 12 },
  { min: 80001, max: 170000, rate: 22 },
  { min: 170001, max: 320000, rate: 24 },
  { min: 320001, max: null, rate: 32 },
];

/**
 * Calculate income tax based on progressive brackets
 */
export function calculateIncomeTax(inputs: IncomeTaxInputs): IncomeTaxResult {
  const { annualIncome, filingStatus } = inputs;

  if (annualIncome <= 0) {
    return {
      totalTax: 0,
      effectiveRate: 0,
      bracketBreakdown: [],
    };
  }

  const brackets = filingStatus === 'married' ? TAX_BRACKETS_MARRIED : TAX_BRACKETS_SINGLE;
  const breakdown: TaxBracketResult[] = [];
  let totalTax = 0;

  for (const bracket of brackets) {
    const bracketMin = bracket.min;
    const bracketMax = bracket.max === null ? Infinity : bracket.max;

    // Calculate how much income falls in this bracket
    let incomeInBracket = 0;
    
    if (annualIncome > bracketMin) {
      // Income has reached this bracket
      const bracketTop = bracketMax === null ? annualIncome : Math.min(bracketMax, annualIncome);
      incomeInBracket = bracketTop - bracketMin;
      
      if (incomeInBracket > 0) {
        const taxInBracket = incomeInBracket * (bracket.rate / 100);
        totalTax += taxInBracket;

        breakdown.push({
          bracket,
          incomeInBracket,
          taxInBracket,
        });
      }
    }
  }

  const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

  return {
    totalTax: Math.round(totalTax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    bracketBreakdown: breakdown,
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

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

