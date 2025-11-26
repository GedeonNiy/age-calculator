/**
 * Date Difference Calculator Page Logic
 */

import { calculateDateDifference, formatDateDifferenceResult } from '../utils/dateUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Date Difference Calculator page
 */
export function initDateDifferenceCalculator(): void {
  const startDateInput = document.getElementById('diff-start-date-input') as HTMLInputElement;
  const endDateInput = document.getElementById('diff-end-date-input') as HTMLInputElement;
  const calculateButton = document.getElementById('diff-calculate-btn') as HTMLButtonElement;
  const resultDiv = document.getElementById('diff-page-result') as HTMLDivElement;

  if (!startDateInput || !endDateInput || !calculateButton || !resultDiv) {
    console.warn('Date Difference Calculator elements not found');
    return;
  }

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    clearError('diff-start-date-input');
    clearError('diff-end-date-input');

    if (!startDateInput.value) {
      showError('diff-start-date-input', 'Please select a start date');
      return;
    }

    if (!endDateInput.value) {
      showError('diff-end-date-input', 'Please select an end date');
      return;
    }

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate < startDate) {
      showError('diff-end-date-input', 'End date cannot be before start date');
      return;
    }

    try {
      const result = calculateDateDifference(startDate, endDate);
      resultDiv.textContent = formatDateDifferenceResult(result);
      resultDiv.className = 'result success';
    } catch (error) {
      showError('diff-end-date-input', 'Invalid dates. Please try again.');
    }
  });

  // Clear errors when inputs change
  startDateInput.addEventListener('input', () => clearError('diff-start-date-input'));
  endDateInput.addEventListener('input', () => clearError('diff-end-date-input'));
}

