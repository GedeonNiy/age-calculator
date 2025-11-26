/**
 * Pregnancy Due Date Calculator Page Logic
 */

import {
  calculatePregnancyDueDate,
  formatDateLong,
  getCurrentTrimester,
  type PregnancyInputs,
} from '../utils/pregnancyUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the Pregnancy Due Date Calculator page
 */
export function initPregnancyDueDateCalculator(): void {
  const lmpInput = document.getElementById('pregnancy-lmp') as HTMLInputElement;
  const cycleLengthInput = document.getElementById('pregnancy-cycle-length') as HTMLInputElement;
  const calculateButton = document.getElementById('pregnancy-calculate-btn') as HTMLButtonElement;

  // Result elements
  const pageResult = document.getElementById('pregnancy-page-result') as HTMLDivElement;
  const dueDateResult = document.getElementById('pregnancy-result-due-date') as HTMLParagraphElement;
  const gestationalAgeResult = document.getElementById('pregnancy-result-gestational-age') as HTMLParagraphElement;
  const trimesterResult = document.getElementById('pregnancy-result-trimester') as HTMLParagraphElement;
  const secondTrimesterResult = document.getElementById('pregnancy-result-second-trimester') as HTMLParagraphElement;
  const thirdTrimesterResult = document.getElementById('pregnancy-result-third-trimester') as HTMLParagraphElement;
  const disclaimerResult = document.getElementById('pregnancy-result-disclaimer') as HTMLDivElement;

  if (!calculateButton) {
    console.warn('Pregnancy Due Date Calculator elements not found');
    return;
  }

  // Set default LMP to 4 weeks ago (typical use case)
  if (lmpInput) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 28);
    lmpInput.value = defaultDate.toISOString().split('T')[0];
  }

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    // Clear previous errors
    clearError('pregnancy-lmp');
    clearError('pregnancy-cycle-length');

    const lmpStr = lmpInput?.value || '';
    const cycleLength = parseFloat(cycleLengthInput?.value || '28');

    // Validation
    let hasErrors = false;

    if (!lmpStr) {
      showError('pregnancy-lmp', 'Please select your last menstrual period date');
      hasErrors = true;
    }

    if (cycleLength < 21 || cycleLength > 35) {
      showError('pregnancy-cycle-length', 'Cycle length should be between 21 and 35 days');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const lmp = new Date(lmpStr);
    lmp.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Additional validation: LMP should not be more than 1 year in the past or in the future
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (lmp > oneYearFromNow) {
      showError('pregnancy-lmp', 'Last menstrual period cannot be more than 1 year in the future');
      return;
    }

    if (lmp < oneYearAgo) {
      showError('pregnancy-lmp', 'Last menstrual period should be within the last year');
      return;
    }

    try {
      const inputs: PregnancyInputs = {
        lastMenstrualPeriod: lmp,
        cycleLength,
      };

      const result = calculatePregnancyDueDate(inputs);

      // Display quick result in the form result div
      if (pageResult) {
        if (result.isPregnancyStarted) {
          pageResult.textContent = `Due Date: ${formatDateLong(result.dueDate)} | ${result.gestationalAgeWeeks} weeks ${result.gestationalAgeDays} days`;
          pageResult.className = 'result success';
        } else {
          pageResult.textContent = 'Pregnancy has not started yet (LMP is in the future)';
          pageResult.className = 'result';
        }
      }

      // Show detailed results section
      const resultsSection = document.getElementById('pregnancy-results-section');
      if (resultsSection) {
        resultsSection.style.display = 'block';
        // Scroll to results section
        setTimeout(() => {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }

      // Display detailed results
      if (dueDateResult) {
        dueDateResult.textContent = formatDateLong(result.dueDate);
      }

      if (gestationalAgeResult) {
        if (result.isPregnancyStarted) {
          gestationalAgeResult.textContent = `You are approximately ${result.gestationalAgeWeeks} weeks ${result.gestationalAgeDays} day${result.gestationalAgeDays !== 1 ? 's' : ''} pregnant`;
        } else {
          gestationalAgeResult.textContent = 'Pregnancy has not started yet (LMP is in the future)';
        }
      }

      if (trimesterResult) {
        if (result.isPregnancyStarted) {
          const currentTrimester = getCurrentTrimester(result.gestationalAgeWeeks);
          trimesterResult.textContent = currentTrimester;
        } else {
          trimesterResult.textContent = 'N/A';
        }
      }

      if (secondTrimesterResult) {
        secondTrimesterResult.textContent = formatDateLong(result.secondTrimesterStart);
      }

      if (thirdTrimesterResult) {
        thirdTrimesterResult.textContent = formatDateLong(result.thirdTrimesterStart);
      }

      if (disclaimerResult) {
        disclaimerResult.style.display = 'block';
      }
    } catch (error) {
      console.error('Pregnancy due date calculation error:', error);
      showError('pregnancy-lmp', 'Error calculating due date. Please check your inputs.');
    }
  });

  // Clear results when inputs change (but don't auto-calculate)
  const clearResults = (): void => {
    if (pageResult) {
      pageResult.textContent = '';
      pageResult.className = 'result';
    }
    const resultsSection = document.getElementById('pregnancy-results-section');
    if (resultsSection) {
      resultsSection.style.display = 'none';
    }
  };

  lmpInput?.addEventListener('input', clearResults);
  cycleLengthInput?.addEventListener('input', clearResults);
}

