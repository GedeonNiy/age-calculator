/**
 * Car Loan Calculator Page Logic
 */

import {
  calculateCarLoan,
  formatCurrency,
  formatDateMonthYear,
  formatDateShort,
  type CarLoanInputs,
} from '../utils/carLoanUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Car Loan Calculator page
 */
export function initCarLoanCalculator(): void {
  // Get all input elements
  const vehiclePriceInput = document.getElementById('car-vehicle-price') as HTMLInputElement;
  const downPaymentInput = document.getElementById('car-down-payment') as HTMLInputElement;
  const tradeInValueInput = document.getElementById('car-trade-in') as HTMLInputElement;
  const salesTaxInput = document.getElementById('car-sales-tax') as HTMLInputElement;
  const loanTermInput = document.getElementById('car-loan-term') as HTMLInputElement;
  const interestRateInput = document.getElementById('car-interest-rate') as HTMLInputElement;
  const startDateInput = document.getElementById('car-start-date') as HTMLInputElement;
  const extraPaymentInput = document.getElementById('car-extra-payment') as HTMLInputElement;
  const calculateButton = document.getElementById('car-calculate-btn') as HTMLButtonElement;

  // Result elements
  const loanAmountResult = document.getElementById('car-result-loan-amount') as HTMLDivElement;
  const monthlyPaymentResult = document.getElementById('car-result-monthly-payment') as HTMLDivElement;
  const totalInterestResult = document.getElementById('car-result-total-interest') as HTMLDivElement;
  const totalPaidResult = document.getElementById('car-result-total-paid') as HTMLDivElement;
  const payoffDateResult = document.getElementById('car-result-payoff-date') as HTMLDivElement;
  const scheduleContainer = document.getElementById('car-schedule-container') as HTMLDivElement;

  if (!calculateButton) {
    console.warn('Car Loan Calculator elements not found');
    return;
  }

  // Set default start date to today
  if (startDateInput) {
    const today = new Date();
    startDateInput.value = today.toISOString().split('T')[0];
  }

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    // Get and validate inputs
    const vehiclePrice = parseFloat(vehiclePriceInput?.value || '0');
    const downPayment = parseFloat(downPaymentInput?.value || '0');
    const tradeInValue = parseFloat(tradeInValueInput?.value || '0');
    const salesTaxPercent = parseFloat(salesTaxInput?.value || '8.5');
    const termYears = parseFloat(loanTermInput?.value || '5');
    const annualInterestRatePercent = parseFloat(interestRateInput?.value || '6.5');
    const extraMonthlyPayment = parseFloat(extraPaymentInput?.value || '0');
    const startDateStr = startDateInput?.value || new Date().toISOString().split('T')[0];
    const startDate = new Date(startDateStr);

    // Validation
    let hasErrors = false;

    if (vehiclePrice <= 0) {
      showError('car-vehicle-price', 'Vehicle price must be greater than 0');
      hasErrors = true;
    } else {
      clearError('car-vehicle-price');
    }

    if (termYears <= 0) {
      showError('car-loan-term', 'Loan term must be greater than 0');
      hasErrors = true;
    } else {
      clearError('car-loan-term');
    }

    if (annualInterestRatePercent < 0) {
      showError('car-interest-rate', 'Interest rate must be 0 or greater');
      hasErrors = true;
    } else {
      clearError('car-interest-rate');
    }

    if (hasErrors) {
      return;
    }

    try {
      const inputs: CarLoanInputs = {
        vehiclePrice,
        downPayment,
        tradeInValue,
        salesTaxPercent,
        termYears,
        annualInterestRatePercent,
        extraMonthlyPayment,
        startDate,
      };

      const results = calculateCarLoan(inputs);

      // Display results
      if (loanAmountResult) {
        loanAmountResult.textContent = formatCurrency(results.loanAmount);
      }
      if (monthlyPaymentResult) {
        monthlyPaymentResult.textContent = formatCurrency(results.actualMonthlyPayment);
      }
      if (totalInterestResult) {
        totalInterestResult.textContent = formatCurrency(results.totalInterest);
      }
      if (totalPaidResult) {
        totalPaidResult.textContent = formatCurrency(results.totalPayments);
      }
      if (payoffDateResult) {
        payoffDateResult.textContent = formatDateMonthYear(results.payoffDate);
      }

      // Display amortization schedule
      if (scheduleContainer) {
        scheduleContainer.innerHTML = `
          <h3>Amortization Schedule</h3>
          <div style="overflow-x: auto;">
            <table class="schedule-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                ${results.amortizationSchedule.map(row => `
                  <tr>
                    <td>${row.monthIndex}</td>
                    <td>${formatDateShort(row.date)}</td>
                    <td>${formatCurrency(row.payment)}</td>
                    <td>${formatCurrency(row.principal)}</td>
                    <td>${formatCurrency(row.interest)}</td>
                    <td>${formatCurrency(row.remainingBalance)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    } catch (error) {
      console.error('Car loan calculation error:', error);
      showError('car-vehicle-price', 'Error calculating car loan. Please check your inputs.');
    }
  });

  // Real-time calculation on input change (debounced)
  let debounceTimer: ReturnType<typeof setTimeout>;
  const inputs = [
    vehiclePriceInput,
    downPaymentInput,
    tradeInValueInput,
    salesTaxInput,
    loanTermInput,
    interestRateInput,
    startDateInput,
    extraPaymentInput,
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





