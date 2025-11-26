/**
 * BMI calculation utility functions
 */

export interface BMIInputs {
  weight: number;
  height: number;
  unitSystem: 'metric' | 'imperial';
}

export interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
}

/**
 * Calculate BMI based on unit system
 */
export function calculateBMI(inputs: BMIInputs): BMIResult {
  const { weight, height, unitSystem } = inputs;

  let bmi: number;

  if (unitSystem === 'metric') {
    // BMI = weight (kg) / height (m)^2
    // Convert cm to meters
    const heightMeters = height / 100;
    bmi = weight / (heightMeters * heightMeters);
  } else {
    // BMI = 703 * weight (lb) / height (in)^2
    bmi = 703 * weight / (height * height);
  }

  // Determine category
  let category: string;
  let categoryColor: string;

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3b82f6'; // Blue
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
    categoryColor = '#10b981'; // Green
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    categoryColor = '#f59e0b'; // Orange
  } else {
    category = 'Obesity';
    categoryColor = '#ef4444'; // Red
  }

  return {
    bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal place
    category,
    categoryColor,
  };
}

/**
 * Convert feet and inches to total inches
 */
export function feetInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

/**
 * Convert inches to feet and inches
 */
export function inchesToFeetInches(totalInches: number): { feet: number; inches: number } {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Convert kilograms to pounds
 */
export function kgToLb(kg: number): number {
  return kg * 2.20462;
}

/**
 * Convert pounds to kilograms
 */
export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number): number {
  return cm / 2.54;
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

