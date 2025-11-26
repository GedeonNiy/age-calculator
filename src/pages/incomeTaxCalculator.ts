/**
 * Income Tax Calculator Page Logic
 */

import {
  calculateIncomeTax,
  formatCurrency,
  formatPercentage,
  type IncomeTaxInputs,
} from '../utils/incomeTaxUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Income Tax Calculator page
 */
export function initIncomeTaxCalculator(): void {
  const incomeInput = document.getElementById('tax-annual-income') as HTMLInputElement;
  const filingStatusInput = document.getElementById('tax-filing-status') as HTMLSelectElement;
  const calculateButton = document.getElementById('tax-calculate-btn') as HTMLButtonElement;

  // Result elements
  const totalTaxResult = document.getElementById('tax-result-total-tax') as HTMLDivElement;
  const effectiveRateResult = document.getElementById('tax-result-effective-rate') as HTMLDivElement;
  const breakdownContainer = document.getElementById('tax-breakdown-container') as HTMLDivElement;

  if (!calculateButton) {
    console.warn('Income Tax Calculator elements not found');
    return;
  }

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    // Clear previous errors
    clearError('tax-annual-income');

    const annualIncome = parseFloat(incomeInput?.value || '0');
    const filingStatus = (filingStatusInput?.value || 'single') as 'single' | 'married';

    // Validation
    if (annualIncome < 0) {
      showError('tax-annual-income', 'Annual income cannot be negative');
      return;
    }

    if (annualIncome === 0) {
      if (totalTaxResult) {
        totalTaxResult.textContent = '$0.00';
      }
      if (effectiveRateResult) {
        effectiveRateResult.textContent = '0.00%';
      }
      if (breakdownContainer) {
        breakdownContainer.innerHTML = '';
      }
      return;
    }

    try {
      const inputs: IncomeTaxInputs = {
        annualIncome,
        filingStatus,
      };

      const result = calculateIncomeTax(inputs);

      // Display quick result in the form result div
      const pageResult = document.getElementById('tax-page-result');
      if (pageResult) {
        pageResult.textContent = `Estimated Tax: ${formatCurrency(result.totalTax)} | Effective Rate: ${formatPercentage(result.effectiveRate)}`;
        pageResult.className = 'result success';
      }

      // Show detailed results section
      const resultsSection = document.getElementById('tax-results-section');
      if (resultsSection) {
        resultsSection.style.display = 'block';
      }

      // Display summary results
      if (totalTaxResult) {
        totalTaxResult.textContent = formatCurrency(result.totalTax);
      }
      if (effectiveRateResult) {
        effectiveRateResult.textContent = formatPercentage(result.effectiveRate);
      }

      // Display bracket breakdown table
      if (breakdownContainer) {
        if (result.bracketBreakdown.length > 0) {
          breakdownContainer.innerHTML = `
            <h3>Tax Bracket Breakdown</h3>
            <div style="overflow-x: auto;">
              <table class="schedule-table">
                <thead>
                  <tr>
                    <th>Bracket Range</th>
                    <th>Rate</th>
                    <th>Income in Bracket</th>
                    <th>Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${result.bracketBreakdown.map(row => {
                    const maxDisplay = row.bracket.max === null ? 'and above' : formatCurrency(row.bracket.max);
                    return `
                      <tr>
                        <td>${formatCurrency(row.bracket.min)} - ${maxDisplay}</td>
                        <td>${row.bracket.rate}%</td>
                        <td>${formatCurrency(row.incomeInBracket)}</td>
                        <td>${formatCurrency(row.taxInBracket)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `;
        } else {
          breakdownContainer.innerHTML = '';
        }
      }
    } catch (error) {
      console.error('Income tax calculation error:', error);
      showError('tax-annual-income', 'Error calculating tax. Please check your inputs.');
    }
  });

  // Clear result when inputs change (but don't auto-calculate)
  const inputs = [incomeInput, filingStatusInput];

  inputs.forEach(input => {
    input?.addEventListener('input', () => {
      // Clear the result when user changes input
      const pageResult = document.getElementById('tax-page-result');
      if (pageResult) {
        pageResult.textContent = '';
        pageResult.className = 'result';
      }
      const resultsSection = document.getElementById('tax-results-section');
      if (resultsSection) {
        resultsSection.style.display = 'none';
      }
    });
  });
}

