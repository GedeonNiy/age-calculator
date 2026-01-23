/**
 * Age Calculator Page Logic
 */

import { calculateAge, formatAgeResult } from '../utils/dateUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Age Calculator page
 */
export function initAgeCalculator(): void {
  const dobInput = document.getElementById('age-dob-input') as HTMLInputElement;
  const calculateButton = document.getElementById('age-calculate-btn') as HTMLButtonElement;
  const resultDiv = document.getElementById('age-page-result') as HTMLDivElement;

  if (!dobInput || !calculateButton || !resultDiv) {
    console.warn('Age Calculator elements not found');
    return;
  }

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    clearError('age-dob-input');
    
    if (!dobInput.value) {
      showError('age-dob-input', 'Please select a date of birth');
      return;
    }

    const dob = new Date(dobInput.value);
    const today = new Date();
    
    if (dob > today) {
      showError('age-dob-input', 'Date of birth cannot be in the future');
      return;
    }

    try {
      const result = calculateAge(dob);
      resultDiv.textContent = formatAgeResult(result);
      resultDiv.className = 'result success';
    } catch (error) {
      showError('age-dob-input', 'Invalid date. Please try again.');
    }
  });

  // Clear error when input changes
  dobInput.addEventListener('input', () => clearError('age-dob-input'));
}






