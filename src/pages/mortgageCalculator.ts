/**
 * Mortgage Calculator Page Logic
 */

import { calculateMortgage, formatCurrency, formatNumber, type MortgageInputs } from '../utils/mortgageUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Mortgage Calculator page
 */
export function initMortgageCalculator(): void {
  // Get all input elements
  const homePriceInput = document.getElementById('mortgage-home-price') as HTMLInputElement;
  const downPaymentTypeAmount = document.getElementById('down-payment-amount') as HTMLInputElement;
  const downPaymentTypePercent = document.getElementById('down-payment-percent') as HTMLInputElement;
  const downPaymentAmountInput = document.getElementById('mortgage-down-amount') as HTMLInputElement;
  const downPaymentPercentInput = document.getElementById('mortgage-down-percent') as HTMLInputElement;
  const loanTermInput = document.getElementById('mortgage-loan-term') as HTMLSelectElement;
  const interestRateInput = document.getElementById('mortgage-interest-rate') as HTMLInputElement;
  const propertyTaxTypePercent = document.getElementById('property-tax-percent') as HTMLInputElement;
  const propertyTaxTypeAmount = document.getElementById('property-tax-amount') as HTMLInputElement;
  const propertyTaxPercentInput = document.getElementById('mortgage-tax-percent') as HTMLInputElement;
  const propertyTaxAmountInput = document.getElementById('mortgage-tax-amount') as HTMLInputElement;
  const insuranceInput = document.getElementById('mortgage-insurance') as HTMLInputElement;
  const pmiCheckbox = document.getElementById('mortgage-include-pmi') as HTMLInputElement;
  const pmiPercentInput = document.getElementById('mortgage-pmi-percent') as HTMLInputElement;
  const hoaInput = document.getElementById('mortgage-hoa') as HTMLInputElement;
  const extraPaymentInput = document.getElementById('mortgage-extra-payment') as HTMLInputElement;
  const calculateButton = document.getElementById('mortgage-calculate-btn') as HTMLButtonElement;

  // Result elements
  const monthlyPIResult = document.getElementById('mortgage-result-monthly-pi') as HTMLDivElement;
  const totalMonthlyResult = document.getElementById('mortgage-result-total-monthly') as HTMLDivElement;
  const totalInterestResult = document.getElementById('mortgage-result-total-interest') as HTMLDivElement;
  const totalCostResult = document.getElementById('mortgage-result-total-cost') as HTMLDivElement;
  const extraPaymentResults = document.getElementById('mortgage-extra-results') as HTMLDivElement;
  const scheduleContainer = document.getElementById('mortgage-schedule-container') as HTMLDivElement;

  if (!calculateButton) {
    console.warn('Mortgage Calculator elements not found');
    return;
  }

  // Initialize down payment type display
  if (downPaymentTypePercent?.checked && downPaymentAmountInput && downPaymentPercentInput) {
    downPaymentAmountInput.style.display = 'none';
    downPaymentPercentInput.style.display = 'block';
  }

  // Initialize property tax type display
  if (propertyTaxTypePercent?.checked && propertyTaxAmountInput && propertyTaxPercentInput) {
    propertyTaxAmountInput.style.display = 'none';
    propertyTaxPercentInput.style.display = 'block';
  }

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    // Get and validate inputs
    const homePrice = parseFloat(homePriceInput?.value || '0');
    const downPaymentType = downPaymentTypeAmount?.checked ? 'amount' : 'percentage';
    const downPaymentAmount = parseFloat(downPaymentAmountInput?.value || '0');
    const downPaymentPercent = parseFloat(downPaymentPercentInput?.value || '0');
    const loanTermYears = parseInt(loanTermInput?.value || '30');
    const annualInterestRate = parseFloat(interestRateInput?.value || '0');
    const propertyTaxType = propertyTaxTypePercent?.checked ? 'percent' : 'amount';
    const propertyTaxPercent = parseFloat(propertyTaxPercentInput?.value || '0');
    const propertyTaxAmount = parseFloat(propertyTaxAmountInput?.value || '0');
    const annualInsurance = parseFloat(insuranceInput?.value || '0');
    const includePMI = pmiCheckbox?.checked || false;
    const pmiPercent = parseFloat(pmiPercentInput?.value || '0');
    const monthlyHOA = parseFloat(hoaInput?.value || '0');
    const extraPrincipalPayment = parseFloat(extraPaymentInput?.value || '0');

    // Basic validation
    if (homePrice <= 0) {
      showError('mortgage-home-price', 'Home price must be greater than 0');
      return;
    }

    if (annualInterestRate < 0 || annualInterestRate > 30) {
      showError('mortgage-interest-rate', 'Interest rate must be between 0 and 30%');
      return;
    }

    // Clear errors
    clearError('mortgage-home-price');
    clearError('mortgage-interest-rate');

    try {
      const inputs: MortgageInputs = {
        homePrice,
        downPaymentType,
        downPaymentAmount,
        downPaymentPercentage: downPaymentPercent,
        loanTermYears,
        annualInterestRate,
        propertyTaxType,
        propertyTaxPercent,
        propertyTaxAmount,
        annualInsurance,
        pmiPercent,
        includePMI,
        monthlyHOA,
        extraPrincipalPayment,
      };

      const results = calculateMortgage(inputs);

      // Display results
      if (monthlyPIResult) {
        monthlyPIResult.textContent = formatCurrency(results.monthlyPI);
      }
      if (totalMonthlyResult) {
        totalMonthlyResult.textContent = formatCurrency(results.totalMonthlyPayment);
      }
      if (totalInterestResult) {
        totalInterestResult.textContent = formatCurrency(results.totalInterestPaid);
      }
      if (totalCostResult) {
        totalCostResult.textContent = formatCurrency(results.totalCost);
      }

      // Show extra payment results if applicable
      if (extraPaymentResults) {
        if (extraPrincipalPayment > 0) {
          extraPaymentResults.innerHTML = `
            <h3>With Extra Payments</h3>
            <div class="extra-results-grid">
              <div>
                <strong>Payoff Date:</strong> ${results.monthsToPayoffWithExtra} months
                <br />
                <small>(${formatNumber(results.monthsToPayoffWithExtra / 12, 1)} years)</small>
              </div>
              <div>
                <strong>Months Saved:</strong> ${results.monthsSaved}
              </div>
              <div>
                <strong>Interest Saved:</strong> ${formatCurrency(results.interestSaved)}
              </div>
              <div>
                <strong>New Total Cost:</strong> ${formatCurrency(results.extraTotalCost)}
              </div>
            </div>
          `;
          extraPaymentResults.style.display = 'block';
        } else {
          extraPaymentResults.style.display = 'none';
        }
      }

      // Display amortization schedule (first 12 months as example)
      if (scheduleContainer) {
        const schedule = results.amortizationSchedule.slice(0, 12);
        scheduleContainer.innerHTML = `
          <h3>Amortization Schedule (First 12 Months)</h3>
          <table class="schedule-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              ${schedule.map(row => `
                <tr>
                  <td>${row.month}</td>
                  <td>${formatCurrency(row.payment)}</td>
                  <td>${formatCurrency(row.principal)}</td>
                  <td>${formatCurrency(row.interest)}</td>
                  <td>${formatCurrency(row.remainingBalance)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    } catch (error) {
      console.error('Mortgage calculation error:', error);
      showError('mortgage-home-price', 'Error calculating mortgage. Please check your inputs.');
    }
  });

  // Handle down payment type toggle
  downPaymentTypeAmount?.addEventListener('change', () => {
    if (downPaymentTypeAmount.checked && downPaymentAmountInput && downPaymentPercentInput) {
      downPaymentAmountInput.style.display = 'block';
      downPaymentPercentInput.style.display = 'none';
    }
  });
  downPaymentTypePercent?.addEventListener('change', () => {
    if (downPaymentTypePercent.checked && downPaymentAmountInput && downPaymentPercentInput) {
      downPaymentAmountInput.style.display = 'none';
      downPaymentPercentInput.style.display = 'block';
    }
  });

  // Handle property tax type toggle
  propertyTaxTypePercent?.addEventListener('change', () => {
    if (propertyTaxTypePercent.checked && propertyTaxAmountInput && propertyTaxPercentInput) {
      propertyTaxPercentInput.style.display = 'block';
      propertyTaxAmountInput.style.display = 'none';
    }
  });
  propertyTaxTypeAmount?.addEventListener('change', () => {
    if (propertyTaxTypeAmount.checked && propertyTaxAmountInput && propertyTaxPercentInput) {
      propertyTaxPercentInput.style.display = 'none';
      propertyTaxAmountInput.style.display = 'block';
    }
  });

  // Real-time calculation on input change (debounced)
  let debounceTimer: ReturnType<typeof setTimeout>;
  const inputs = [
    homePriceInput, downPaymentAmountInput, downPaymentPercentInput,
    loanTermInput, interestRateInput, propertyTaxPercentInput, propertyTaxAmountInput,
    insuranceInput, pmiPercentInput, hoaInput, extraPaymentInput
  ];

  inputs.forEach(input => {
    input?.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        calculateButton.click();
      }, 500);
    });
  });
}
