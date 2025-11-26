/**
 * BMI Calculator Page Logic
 */

import {
  calculateBMI,
  feetInchesToInches,
  inchesToFeetInches,
  kgToLb,
  lbToKg,
  cmToInches,
  inchesToCm,
  type BMIInputs,
} from '../utils/bmiUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the BMI Calculator page
 */
export function initBMICalculator(): void {
  // Get all input elements
  const unitToggleMetric = document.getElementById('bmi-unit-metric') as HTMLInputElement;
  const unitToggleImperial = document.getElementById('bmi-unit-imperial') as HTMLInputElement;
  const weightInputMetric = document.getElementById('bmi-weight') as HTMLInputElement;
  const weightInputImperial = document.getElementById('bmi-weight-imperial') as HTMLInputElement;
  const heightInput = document.getElementById('bmi-height-cm') as HTMLInputElement;
  const heightFeetInput = document.getElementById('bmi-height-feet') as HTMLInputElement;
  const heightInchesInput = document.getElementById('bmi-height-inches') as HTMLInputElement;
  const metricInputs = document.getElementById('bmi-metric-inputs') as HTMLDivElement;
  const imperialInputs = document.getElementById('bmi-imperial-inputs') as HTMLDivElement;
  const calculateButton = document.getElementById('bmi-calculate-btn') as HTMLButtonElement;

  // Result elements
  const bmiPageResult = document.getElementById('bmi-page-result') as HTMLDivElement;

  if (!calculateButton) {
    console.warn('BMI Calculator elements not found');
    return;
  }

  // Initialize unit system display
  const updateUnitDisplay = () => {
    if (unitToggleMetric?.checked) {
      metricInputs!.style.display = 'block';
      imperialInputs!.style.display = 'none';
    } else {
      metricInputs!.style.display = 'none';
      imperialInputs!.style.display = 'block';
    }
  };

  // Set default to metric
  if (unitToggleMetric) {
    unitToggleMetric.checked = true;
    updateUnitDisplay();
  }

  // Handle unit toggle
  unitToggleMetric?.addEventListener('change', () => {
    updateUnitDisplay();
    // Convert values when switching to metric
    if (unitToggleMetric.checked) {
      const lbValue = parseFloat(weightInputImperial?.value || '0');
      if (lbValue > 0) {
        weightInputMetric!.value = lbToKg(lbValue).toFixed(1);
      }
      const feet = parseFloat(heightFeetInput?.value || '0');
      const inches = parseFloat(heightInchesInput?.value || '0');
      if (feet > 0 || inches > 0) {
        const totalInches = feetInchesToInches(feet, inches);
        heightInput!.value = inchesToCm(totalInches).toFixed(1);
      }
    }
  });
  
  unitToggleImperial?.addEventListener('change', () => {
    updateUnitDisplay();
    // Convert values when switching to imperial
    if (unitToggleImperial.checked) {
      const kgValue = parseFloat(weightInputMetric?.value || '0');
      if (kgValue > 0) {
        weightInputImperial!.value = kgToLb(kgValue).toFixed(1);
      }
      const cmValue = parseFloat(heightInput?.value || '0');
      if (cmValue > 0) {
        const totalInches = cmToInches(cmValue);
        const { feet, inches } = inchesToFeetInches(totalInches);
        heightFeetInput!.value = feet.toString();
        heightInchesInput!.value = inches.toString();
      }
    }
  });

  // Calculate button handler
  calculateButton.addEventListener('click', () => {
    const unitSystem = unitToggleMetric?.checked ? 'metric' : 'imperial';
    let weight: number = 0;
    let height: number = 0;

    // Clear previous errors
    clearError('bmi-weight');
    clearError('bmi-weight-imperial');
    clearError('bmi-height-cm');
    clearError('bmi-height-feet');
    clearError('bmi-height-inches');

    let hasErrors = false;

    // Get weight based on unit system
    if (unitSystem === 'metric') {
      weight = parseFloat(weightInputMetric?.value || '0');
      if (weight <= 0) {
        showError('bmi-weight', 'Weight must be greater than 0');
        hasErrors = true;
      }
    } else {
      weight = parseFloat(weightInputImperial?.value || '0');
      if (weight <= 0) {
        showError('bmi-weight-imperial', 'Weight must be greater than 0');
        hasErrors = true;
      }
    }

    // Get height based on unit system
    if (unitSystem === 'metric') {
      const heightCm = parseFloat(heightInput?.value || '0');
      if (heightCm <= 0) {
        showError('bmi-height-cm', 'Height must be greater than 0');
        hasErrors = true;
      } else {
        height = heightCm;
      }
    } else {
      const feet = parseFloat(heightFeetInput?.value || '0');
      const inches = parseFloat(heightInchesInput?.value || '0');
      if (feet < 0 || inches < 0 || (feet === 0 && inches === 0)) {
        showError('bmi-height-feet', 'Height must be greater than 0');
        hasErrors = true;
      } else {
        height = feetInchesToInches(feet, inches);
      }
    }

    if (hasErrors) {
      return;
    }

    try {
      const inputs: BMIInputs = {
        weight,
        height,
        unitSystem,
      };

      const result = calculateBMI(inputs);

      // Display results in the main result div only
      if (bmiPageResult) {
        bmiPageResult.textContent = `BMI: ${result.bmi.toFixed(1)} - ${result.category}`;
        bmiPageResult.className = 'result success';
        bmiPageResult.style.borderColor = result.categoryColor;
      }

      // Hide the detailed results section to avoid duplicate display
      const resultsSection = document.getElementById('bmi-results-section');
      if (resultsSection) {
        resultsSection.style.display = 'none';
      }
    } catch (error) {
      console.error('BMI calculation error:', error);
      showError('bmi-weight', 'Error calculating BMI. Please check your inputs.');
    }
  });

  // Sync values between metric and imperial inputs
  let isUpdating = false; // Prevent infinite loops

  // Metric weight to imperial
  weightInputMetric?.addEventListener('input', () => {
    if (isUpdating) return;
    const kgValue = parseFloat(weightInputMetric.value || '0');
    if (kgValue > 0) {
      isUpdating = true;
      weightInputImperial!.value = kgToLb(kgValue).toFixed(1);
      isUpdating = false;
    }
    clearResult();
  });

  // Imperial weight to metric
  weightInputImperial?.addEventListener('input', () => {
    if (isUpdating) return;
    const lbValue = parseFloat(weightInputImperial.value || '0');
    if (lbValue > 0) {
      isUpdating = true;
      weightInputMetric!.value = lbToKg(lbValue).toFixed(1);
      isUpdating = false;
    }
    clearResult();
  });

  // Metric height to imperial
  heightInput?.addEventListener('input', () => {
    if (isUpdating) return;
    const cmValue = parseFloat(heightInput.value || '0');
    if (cmValue > 0) {
      isUpdating = true;
      const totalInches = cmToInches(cmValue);
      const { feet, inches } = inchesToFeetInches(totalInches);
      heightFeetInput!.value = feet.toString();
      heightInchesInput!.value = inches.toString();
      isUpdating = false;
    }
    clearResult();
  });

  // Imperial height to metric
  const updateHeightFromImperial = () => {
    if (isUpdating) return;
    const feet = parseFloat(heightFeetInput?.value || '0');
    const inches = parseFloat(heightInchesInput?.value || '0');
    if (feet > 0 || inches > 0) {
      isUpdating = true;
      const totalInches = feetInchesToInches(feet, inches);
      heightInput!.value = inchesToCm(totalInches).toFixed(1);
      isUpdating = false;
    }
    clearResult();
  };

  heightFeetInput?.addEventListener('input', updateHeightFromImperial);
  heightInchesInput?.addEventListener('input', updateHeightFromImperial);

  // Helper function to clear result
  function clearResult() {
    if (bmiPageResult) {
      bmiPageResult.textContent = '';
      bmiPageResult.className = 'result';
      bmiPageResult.style.borderColor = '';
    }
    const resultsSection = document.getElementById('bmi-results-section');
    if (resultsSection) {
      resultsSection.style.display = 'none';
    }
  }
}

