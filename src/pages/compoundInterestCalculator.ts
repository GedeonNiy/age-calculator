/**
 * Compound Interest Calculator Page Logic
 */

import {
  calculateCompoundInterest,
  formatCurrency,
  type CompoundInterestInputs,
} from '../utils/compoundInterestUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Compound Interest Calculator page
 */
export function initCompoundInterestCalculator(): void {
  const principalInput = document.getElementById('compound-principal') as HTMLInputElement;
  const monthlyContributionInput = document.getElementById('compound-monthly-contribution') as HTMLInputElement;
  const interestRateInput = document.getElementById('compound-interest-rate') as HTMLInputElement;
  const yearsInput = document.getElementById('compound-years') as HTMLInputElement;
  const compoundingFrequencyInput = document.getElementById('compound-frequency') as HTMLSelectElement;
  const calculateButton = document.getElementById('compound-calculate-btn') as HTMLButtonElement;

  // Result elements
  const pageResult = document.getElementById('compound-page-result') as HTMLDivElement;
  const finalBalanceResult = document.getElementById('compound-result-final-balance') as HTMLDivElement;
  const totalContributionsResult = document.getElementById('compound-result-total-contributions') as HTMLDivElement;
  const totalInterestResult = document.getElementById('compound-result-total-interest') as HTMLDivElement;
  const breakdownContainer = document.getElementById('compound-breakdown-container') as HTMLDivElement;

  if (!calculateButton) {
    console.warn('Compound Interest Calculator elements not found');
    return;
  }

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    // Clear previous errors
    clearError('compound-principal');
    clearError('compound-interest-rate');
    clearError('compound-years');

    const principal = parseFloat(principalInput?.value || '0');
    const monthlyContribution = parseFloat(monthlyContributionInput?.value || '0');
    const annualInterestRate = parseFloat(interestRateInput?.value || '0');
    const years = parseInt(yearsInput?.value || '0');
    const compoundingFrequency = (compoundingFrequencyInput?.value || 'monthly') as 'yearly' | 'quarterly' | 'monthly' | 'daily';

    // Validation
    let hasErrors = false;

    if (principal < 0) {
      showError('compound-principal', 'Principal cannot be negative');
      hasErrors = true;
    }

    if (monthlyContribution < 0) {
      showError('compound-monthly-contribution', 'Monthly contribution cannot be negative');
      hasErrors = true;
    }

    if (annualInterestRate < 0 || annualInterestRate > 100) {
      showError('compound-interest-rate', 'Interest rate must be between 0 and 100%');
      hasErrors = true;
    }

    if (years <= 0 || years > 100) {
      showError('compound-years', 'Years must be between 1 and 100');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Check if all inputs are zero
    if (principal === 0 && monthlyContribution === 0) {
      if (pageResult) {
        pageResult.textContent = 'Please enter an initial investment or monthly contribution.';
        pageResult.className = 'result';
      }
      const resultsSection = document.getElementById('compound-results-section');
      if (resultsSection) {
        resultsSection.style.display = 'none';
      }
      return;
    }

    try {
      const inputs: CompoundInterestInputs = {
        principal,
        monthlyContribution,
        annualInterestRate,
        years,
        compoundingFrequency,
      };

      const result = calculateCompoundInterest(inputs);

      // Display quick result in the form result div
      if (pageResult) {
        pageResult.textContent = `Final Balance: ${formatCurrency(result.finalBalance)} | Total Interest: ${formatCurrency(result.totalInterest)}`;
        pageResult.className = 'result success';
      }

      // Show detailed results section
      const resultsSection = document.getElementById('compound-results-section');
      if (resultsSection) {
        resultsSection.style.display = 'block';
      }

      // Display summary results
      if (finalBalanceResult) {
        finalBalanceResult.textContent = formatCurrency(result.finalBalance);
      }
      if (totalContributionsResult) {
        totalContributionsResult.textContent = formatCurrency(result.totalContributions);
      }
      if (totalInterestResult) {
        totalInterestResult.textContent = formatCurrency(result.totalInterest);
      }

      // Display yearly breakdown table
      if (breakdownContainer) {
        if (result.yearlyBreakdown.length > 0) {
          breakdownContainer.innerHTML = `
            <h3>Year-by-Year Breakdown</h3>
            <div style="overflow-x: auto;">
              <table class="schedule-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Starting Balance</th>
                    <th>Contributions</th>
                    <th>Interest</th>
                    <th>Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${result.yearlyBreakdown.map(row => `
                    <tr>
                      <td>${row.year}</td>
                      <td>${formatCurrency(row.startingBalance)}</td>
                      <td>${formatCurrency(row.contributions)}</td>
                      <td>${formatCurrency(row.interest)}</td>
                      <td>${formatCurrency(row.endingBalance)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        } else {
          breakdownContainer.innerHTML = '';
        }
      }
    } catch (error) {
      console.error('Compound interest calculation error:', error);
      showError('compound-principal', 'Error calculating compound interest. Please check your inputs.');
    }
  });

  // Real-time calculation on input change (debounced)
  let debounceTimer: ReturnType<typeof setTimeout>;
  const inputs = [principalInput, monthlyContributionInput, interestRateInput, yearsInput, compoundingFrequencyInput];

  inputs.forEach(input => {
    input?.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        calculateButton.click();
      }, 500);
    });
  });
}

