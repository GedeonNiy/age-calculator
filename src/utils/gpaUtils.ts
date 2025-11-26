/**
 * GPA calculation utility functions
 */

export interface Course {
  name: string;
  credits: number;
  grade: string;
}

export interface GPAResult {
  gpa: number;
  totalQualityPoints: number;
  totalCredits: number;
  courseCount: number;
}

/**
 * Grade to points mapping (4.0 scale)
 */
const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D': 1.0,
  'F': 0.0,
};

/**
 * Get grade points for a given grade
 */
export function getGradePoints(grade: string): number {
  return GRADE_POINTS[grade.toUpperCase()] ?? 0;
}

/**
 * Calculate GPA from courses
 */
export function calculateGPA(courses: Course[]): GPAResult {
  // Filter out invalid courses (no grade or credits <= 0)
  const validCourses = courses.filter(
    course => course.grade && course.grade !== '' && course.credits > 0
  );

  if (validCourses.length === 0) {
    return {
      gpa: 0,
      totalQualityPoints: 0,
      totalCredits: 0,
      courseCount: 0,
    };
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const course of validCourses) {
    const gradePoints = getGradePoints(course.grade);
    totalQualityPoints += gradePoints * course.credits;
    totalCredits += course.credits;
  }

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    gpa: Math.round(gpa * 100) / 100, // Round to 2 decimal places
    totalQualityPoints,
    totalCredits,
    courseCount: validCourses.length,
  };
}

/**
 * Get all available grades
 */
export function getAvailableGrades(): string[] {
  return Object.keys(GRADE_POINTS);
}

