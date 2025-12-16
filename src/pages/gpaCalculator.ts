/**
 * GPA Calculator Page Logic
 */

import { calculateGPA, getAvailableGrades, type Course } from '../utils/gpaUtils';
import { showError, clearError } from '../utils/validationUtils';

/**
 * Initializes the GPA Calculator page
 */
export function initGPACalculator(): void {
  const coursesContainer = document.getElementById('gpa-courses-container') as HTMLDivElement;
  const addCourseButton = document.getElementById('gpa-add-course-btn') as HTMLButtonElement;
  const calculateButton = document.getElementById('gpa-calculate-btn') as HTMLButtonElement;
  const gpaResult = document.getElementById('gpa-result') as HTMLDivElement;

  if (!coursesContainer || !addCourseButton || !calculateButton) {
    console.warn('GPA Calculator elements not found');
    return;
  }

  let courseCounter = 0;

  /**
   * Create a new course row
   */
  function createCourseRow(): HTMLDivElement {
    const courseId = `course-${courseCounter++}`;
    const row = document.createElement('div');
    row.className = 'gpa-course-row';
    row.id = courseId;

    const grades = getAvailableGrades();
    const gradeOptions = grades
      .map(grade => `<option value="${grade}">${grade}</option>`)
      .join('');

    row.innerHTML = `
      <div class="gpa-course-name">
        <input type="text" class="gpa-course-name-input" placeholder="Course name (optional)" />
      </div>
      <div class="gpa-course-credits">
        <input type="number" class="gpa-course-credits-input" placeholder="Credits" min="0" step="0.5" />
      </div>
      <div class="gpa-course-grade">
        <select class="gpa-course-grade-select">
          <option value="">Select Grade</option>
          ${gradeOptions}
        </select>
      </div>
      <div class="gpa-course-actions">
        <button type="button" class="gpa-remove-course-btn" data-course-id="${courseId}">Remove</button>
      </div>
    `;

    // Add remove button handler
    const removeBtn = row.querySelector('.gpa-remove-course-btn') as HTMLButtonElement;
    removeBtn.addEventListener('click', () => {
      row.remove();
      clearResult();
    });

    // Clear result when inputs change
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearResult();
        // Clear errors when user starts typing
        const creditsInput = row.querySelector('.gpa-course-credits-input') as HTMLInputElement;
        if (input === creditsInput) {
          clearError(creditsInput.id || '');
        }
      });
    });

    return row;
  }

  /**
   * Clear the result display
   */
  function clearResult(): void {
    if (gpaResult) {
      gpaResult.textContent = '';
      gpaResult.className = 'result';
    }
  }

  /**
   * Add a new course row
   */
  addCourseButton.addEventListener('click', () => {
    const newRow = createCourseRow();
    coursesContainer.appendChild(newRow);
  });

  /**
   * Calculate GPA
   */
  calculateButton.addEventListener('click', () => {
    const courseRows = coursesContainer.querySelectorAll('.gpa-course-row');
    const courses: Course[] = [];
    let hasErrors = false;

    // Clear previous errors
    courseRows.forEach((row, index) => {
      const creditsInput = row.querySelector('.gpa-course-credits-input') as HTMLInputElement;
      if (creditsInput) {
        clearError(creditsInput.id || `gpa-credits-${index}`);
      }
    });

    // Collect courses
    courseRows.forEach((row, index) => {
      const nameInput = row.querySelector('.gpa-course-name-input') as HTMLInputElement;
      const creditsInput = row.querySelector('.gpa-course-credits-input') as HTMLInputElement;
      const gradeSelect = row.querySelector('.gpa-course-grade-select') as HTMLSelectElement;

      const name = nameInput?.value.trim() || '';
      const credits = parseFloat(creditsInput?.value || '0');
      const grade = gradeSelect?.value || '';

      // Validate credits if grade is provided
      if (grade && credits <= 0) {
        const inputId = creditsInput?.id || `gpa-credits-${index}`;
        if (!creditsInput?.id) {
          creditsInput!.id = inputId;
        }
        showError(inputId, 'Credits must be greater than 0');
        hasErrors = true;
      }

      // Only add courses with both grade and valid credits
      if (grade && credits > 0) {
        courses.push({ name, credits, grade });
      }
    });

    if (hasErrors) {
      return;
    }

    try {
      const result = calculateGPA(courses);

      if (result.courseCount === 0) {
        if (gpaResult) {
          gpaResult.textContent = 'Please add at least one course with a grade and credits to calculate GPA.';
          gpaResult.className = 'result';
        }
        return;
      }

      if (gpaResult) {
        gpaResult.textContent = `GPA: ${result.gpa.toFixed(2)} (${result.courseCount} course${result.courseCount !== 1 ? 's' : ''}, ${result.totalCredits} credit${result.totalCredits !== 1 ? 's' : ''})`;
        gpaResult.className = 'result success';
      }
    } catch (error) {
      console.error('GPA calculation error:', error);
      if (gpaResult) {
        gpaResult.textContent = 'Error calculating GPA. Please check your inputs.';
        gpaResult.className = 'result';
      }
    }
  });

  // Add initial course row
  const initialRow = createCourseRow();
  coursesContainer.appendChild(initialRow);
}




