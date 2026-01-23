/**
 * Validation utility functions
 */

/**
 * Shows an error message below an input element
 */
export function showError(inputId: string, message: string): void {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (!input) return;

  // Remove existing error message
  const existingError = input.parentElement?.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  input.parentElement?.appendChild(errorDiv);
}

/**
 * Removes error message below an input element
 */
export function clearError(inputId: string): void {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (!input) return;
  const errorDiv = input.parentElement?.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
}






